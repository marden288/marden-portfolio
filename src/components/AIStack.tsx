import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
} from 'react'

import {
  CaretDown,
  Circle,
} from '@/components/slab'

import {
  aiStack,
  type StackNode,
} from '@/data/ai-stack'

/**
 * AIStack
 *
 * Responsive visual tree for the AI / technology stack.
 *
 * Features:
 * - Real nested <ul>/<li> structure
 * - Responsive desktop/mobile layout
 * - Measured SVG connector lines
 * - ResizeObserver support
 * - Mobile branch disclosure
 * - Keyboard accessibility
 * - Hover/focus branch highlighting
 * - Animated entrance
 */

const COMPACT_QUERY = '(max-width: 900px)'

/**
 * Elbow corner radius.
 */
const CORNER = 12

/**
 * Position of the vertical rail inside a parent card.
 */
const RAIL_INSET = 15

type Box = {
  x: number
  y: number
  w: number
  h: number
}

type Wire = {
  id: string
  branchId: string
  d: string
  delay: number
}

type Flat = {
  node: StackNode
  depth: number
  parentId: string | null
  branchId: string
  index: number
}

const LEVEL = [
  'root',
  'branch',
  'leaf',
] as const

/**
 * Flatten the nested stack into a depth-first list.
 *
 * This makes measuring and drawing the connector
 * lines much easier.
 */
function flatten(root: StackNode): Flat[] {
  const output: Flat[] = []

  const walk = (
    node: StackNode,
    depth: number,
    parentId: string | null,
    branchId: string,
    index: number,
  ) => {
    output.push({
      node,
      depth,
      parentId,
      branchId,
      index,
    })

    const children = node.children ?? []

    children.forEach((child, childIndex) => {
      /**
       * Every direct child of the root becomes
       * its own visual branch.
       */
      const childBranchId =
        depth === 0
          ? child.id
          : branchId

      walk(
        child,
        depth + 1,
        node.id,
        childBranchId,
        childIndex,
      )
    })
  }

  walk(
    root,
    0,
    null,
    root.id,
    0,
  )

  return output
}

/**
 * Round SVG coordinates to avoid unnecessary
 * decimal noise.
 */
const round = (value: number) =>
  Math.round(value * 100) / 100

/**
 * Draw a vertical connector from a parent to a child.
 *
 * Used for desktop branch layout.
 */
function dropPath(
  parent: Box,
  child: Box,
): string {
  const startX =
    parent.x + parent.w / 2

  const startY =
    parent.y + parent.h

  const endX =
    child.x + child.w / 2

  const endY =
    child.y

  const dy = endY - startY
  const dx = endX - startX

  /**
   * Fallback to a straight line when the
   * boxes are overlapping or almost aligned.
   */
  if (
    dy <= 1 ||
    Math.abs(dx) < 1
  ) {
    return [
      `M ${round(startX)} ${round(startY)}`,
      `L ${round(endX)} ${round(endY)}`,
    ].join(' ')
  }

  const middleY =
    startY + dy / 2

  const radius = Math.min(
    CORNER,
    Math.abs(dx) / 2,
    dy / 2,
  )

  const direction =
    dx > 0 ? 1 : -1

  return [
    `M ${round(startX)} ${round(startY)}`,

    `L ${round(startX)} ${round(
      middleY - radius,
    )}`,

    `Q ${round(startX)} ${round(
      middleY,
    )} ${round(
      startX + direction * radius,
    )} ${round(middleY)}`,

    `L ${round(
      endX - direction * radius,
    )} ${round(middleY)}`,

    `Q ${round(endX)} ${round(
      middleY,
    )} ${round(endX)} ${round(
      middleY + radius,
    )}`,

    `L ${round(endX)} ${round(endY)}`,
  ].join(' ')
}

/**
 * Draw an L-shaped connector.
 *
 * Used for compact/mobile layout.
 */
function railPath(
  parent: Box,
  child: Box,
): string {
  const startX =
    parent.x + RAIL_INSET

  const startY =
    parent.y + parent.h

  const endX =
    child.x

  const endY =
    child.y + child.h / 2

  const dy = endY - startY
  const dx = endX - startX

  if (
    dy <= 1 ||
    dx <= 1
  ) {
    return [
      `M ${round(startX)} ${round(startY)}`,
      `L ${round(endX)} ${round(endY)}`,
    ].join(' ')
  }

  const radius = Math.min(
    CORNER,
    dx,
    dy,
  )

  return [
    `M ${round(startX)} ${round(startY)}`,

    `L ${round(startX)} ${round(
      endY - radius,
    )}`,

    `Q ${round(startX)} ${round(
      endY,
    )} ${round(
      startX + radius,
    )} ${round(endY)}`,

    `L ${round(endX)} ${round(endY)}`,
  ].join(' ')
}

export default function AIStack({
  root = aiStack,
}: {
  root?: StackNode
}) {
  /**
   * Main container.
   */
  const hostRef =
    useRef<HTMLDivElement | null>(null)

  /**
   * Every rendered node is registered here
   * so its real DOM position can be measured.
   */
  const nodeRefs =
    useRef(
      new Map<string, HTMLElement>(),
    )

  /**
   * requestAnimationFrame ID.
   */
  const frame =
    useRef(0)

  /**
   * Prevent unnecessary geometry updates.
   */
  const signature =
    useRef('')

  /**
   * SVG geometry state.
   */
  const [geometry, setGeometry] =
    useState<{
      w: number
      h: number
      wires: Wire[]
    }>({
      w: 0,
      h: 0,
      wires: [],
    })

  /**
   * Responsive mode.
   */
  const [compact, setCompact] =
    useState(() =>
      typeof window !== 'undefined'
        ? window.matchMedia(
            COMPACT_QUERY,
          ).matches
        : false,
    )

  /**
   * Controls initial entrance animation.
   */
  const [drawn, setDrawn] =
    useState(false)

  /**
   * Currently highlighted branch.
   */
  const [active, setActive] =
    useState<string | null>(null)

  /**
   * Open branches on compact/mobile.
   */
  const [open, setOpen] =
    useState<ReadonlySet<string>>(
      () => new Set(),
    )

  /**
   * Flatten tree once per root change.
   */
  const flat = useMemo(
    () => flatten(root),
    [root],
  )

  /**
   * Toggle a mobile branch.
   */
  const toggleBranch =
    useCallback(
      (id: string) => {
        setOpen((previous) => {
          const next =
            new Set(previous)

          if (next.has(id)) {
            next.delete(id)
          } else {
            next.add(id)
          }

          return next
        })
      },
      [],
    )

  /**
   * Register/unregister a node element.
   */
  const registerNode =
    useCallback(
      (id: string) => {
        return (
          element: HTMLElement | null,
        ) => {
          if (element) {
            nodeRefs.current.set(
              id,
              element,
            )
          } else {
            nodeRefs.current.delete(id)
          }
        }
      },
      [],
    )

  /**
   * Measure every node and rebuild SVG wires.
   */
  const measure =
    useCallback(() => {
      const host =
        hostRef.current

      if (!host) {
        return
      }

      const hostRect =
        host.getBoundingClientRect()

      if (hostRect.width === 0) {
        return
      }

      /**
       * Convert a DOM element into coordinates
       * relative to the AIStack host.
       */
      const boxOf = (
        id: string,
      ): Box | null => {
        const element =
          nodeRefs.current.get(id)

        if (!element) {
          return null
        }

        const rect =
          element.getBoundingClientRect()

        /**
         * Hidden mobile branches may still exist
         * in the DOM. Ignore their 0x0 rectangles.
         */
        if (
          rect.width === 0 &&
          rect.height === 0
        ) {
          return null
        }

        return {
          x:
            rect.left -
            hostRect.left,

          y:
            rect.top -
            hostRect.top,

          w: rect.width,
          h: rect.height,
        }
      }

      const wires: Wire[] = []

      for (const item of flat) {
        /**
         * Root has no parent.
         */
        if (!item.parentId) {
          continue
        }

        const parent =
          boxOf(item.parentId)

        const child =
          boxOf(item.node.id)

        if (!parent || !child) {
          continue
        }

        /**
         * Only direct root children use
         * the desktop fan-out connector.
         *
         * Everything else uses the rail.
         */
        const useDrop =
          item.depth === 1 &&
          !compact

        wires.push({
          id: item.node.id,

          branchId:
            item.branchId,

          d: useDrop
            ? dropPath(
                parent,
                child,
              )
            : railPath(
                parent,
                child,
              ),

          delay:
            item.depth === 1
              ? 90
              : 400 +
                item.index * 70,
        })
      }

      const nextGeometry = {
        w: hostRect.width,
        h: hostRect.height,
        wires,
      }

      const nextSignature =
        JSON.stringify(
          nextGeometry,
        )

      /**
       * Don't trigger another render if
       * nothing actually changed.
       */
      if (
        nextSignature ===
        signature.current
      ) {
        return
      }

      signature.current =
        nextSignature

      setGeometry(
        nextGeometry,
      )
    },
    [
      flat,
      compact,
    ],
  )

  /**
   * Schedule measurement on the next frame.
   */
  const schedule =
    useCallback(() => {
      cancelAnimationFrame(
        frame.current,
      )

      frame.current =
        requestAnimationFrame(
          measure,
        )
    }, [measure])

  /**
   * Recalculate when a branch opens/closes.
   */
  useLayoutEffect(() => {
    schedule()
  }, [
    open,
    schedule,
  ])

  /**
   * Observe host resize.
   */
  useLayoutEffect(() => {
    measure()

    const host =
      hostRef.current

    if (!host) {
      return
    }

    const observer =
      new ResizeObserver(
        schedule,
      )

    observer.observe(host)

    return () => {
      observer.disconnect()

      cancelAnimationFrame(
        frame.current,
      )
    }
  }, [
    measure,
    schedule,
  ])

  /**
   * Re-measure after fonts load.
   *
   * Font loading can change card dimensions.
   */
  useEffect(() => {
    if (!document.fonts) {
      return
    }

    let alive = true

    document.fonts.ready.then(() => {
      if (alive) {
        schedule()
      }
    })

    return () => {
      alive = false
    }
  }, [schedule])

  /**
   * Watch responsive breakpoint.
   */
  useEffect(() => {
    const media =
      window.matchMedia(
        COMPACT_QUERY,
      )

    const handleChange = () => {
      setCompact(
        media.matches,
      )

      setActive(null)

      /**
       * Recalculate wires after
       * responsive mode changes.
       */
      requestAnimationFrame(
        measure,
      )
    }

    media.addEventListener(
      'change',
      handleChange,
    )

    return () => {
      media.removeEventListener(
        'change',
        handleChange,
      )
    }
  }, [measure])

  /**
   * Trigger initial draw animation
   * when the component enters viewport.
   */
  useEffect(() => {
    const host =
      hostRef.current

    if (!host) {
      return
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            return
          }

          setDrawn(true)

          observer.disconnect()
        },
        {
          threshold: 0.15,
        },
      )

    observer.observe(host)

    return () => {
      observer.disconnect()
    }
  }, [])

  /**
   * Render a single tree node.
   */
  const renderNode = (
    node: StackNode,
    depth: number,
    branchId: string,
    index: number,
  ): React.ReactNode => {
    const level =
      LEVEL[
        Math.min(
          depth,
          2,
        )
      ]

    const children =
      node.children ?? []

    /**
     * Root never gets dimmed.
     */
    const state =
      active === null ||
      depth === 0
        ? ''
        : branchId === active
          ? ' is-lit'
          : ' is-dim'

    /**
     * Leaves highlight their parent branch.
     */
    const target =
      depth === 0
        ? null
        : branchId

    const NodeIcon =
      node.Icon

    const listId =
      `ai-stack-${node.id}-children`

    /**
     * Only non-root nodes with children
     * can be collapsed on compact layout.
     */
    const collapsible =
      compact &&
      depth > 0 &&
      children.length > 0

    /**
     * Desktop nodes are always visible.
     * Compact nodes depend on their open state.
     */
    const isOpen =
      !collapsible ||
      open.has(node.id)

    /**
     * Desktop hover/focus interaction.
     *
     * On mobile, the disclosure button is
     * the only keyboard interaction.
     */
    const interaction:
      HTMLAttributes<HTMLDivElement> =
      compact
        ? {}
        : {
            tabIndex: 0,

            onMouseEnter: () =>
              setActive(target),

            onMouseLeave: () =>
              setActive(null),

            onFocus: () =>
              setActive(target),

            onBlur: () =>
              setActive(null),
          }

    /**
     * Entrance delay.
     */
    const entranceDelay =
      compact && depth > 1
        ? index * 45
        : depth * 150 +
          index * 60

    return (
      <li
        key={node.id}
        className={[
          'ai-stack__item',
          `ai-stack__item--${level}`,
        ].join(' ')}
        style={{
          ['--enter' as string]:
            `${entranceDelay}ms`,
        }}
      >
        {/* Node card */}
        <div
          ref={registerNode(
            node.id,
          )}
          className={[
            'ai-stack__node',
            `ai-stack__node--${level}`,
            state,
            collapsible
              ? 'is-collapsible'
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
          {...interaction}
        >
          {/* Node heading */}
          <span className="ai-stack__head">
            <span
              className="ai-stack__mark"
              aria-hidden="true"
            >
              <NodeIcon
                weight={
                  depth === 0
                    ? 'fill'
                    : 'bold'
                }
                size={
                  depth === 0
                    ? 15
                    : 13
                }
              />
            </span>

            <span className="ai-stack__name">
              {node.name}
            </span>

            {node.status && (
              <span
                className={[
                  'ai-stack__status',
                  `ai-stack__status--${node.status.toLowerCase()}`,
                ].join(' ')}
              >
                <Circle
                  weight="fill"
                  size={6}
                  aria-hidden="true"
                />

                {node.status}
              </span>
            )}
          </span>

          {/* Description */}
          <p className="ai-stack__what">
            {node.what}
          </p>

          {/* Stack / logos */}
          {(node.stack ||
            node.logos) && (
            <span className="ai-stack__meta">
              {node.logos?.map(
                (logo) => (
                  <span
                    key={logo.src}
                    className="ai-stack__logo"
                    style={{
                      [
                        '--logo-mask' as string
                      ]: `url('${logo.src}')`,
                    }}
                    role="img"
                    aria-label={
                      logo.name
                    }
                  />
                ),
              )}

              {node.stack}
            </span>
          )}

          {/* Mobile disclosure */}
          {collapsible && (
            <button
              type="button"
              className="ai-stack__toggle"
              aria-expanded={
                isOpen
              }
              aria-controls={
                listId
              }
              aria-label={`${children.length} sub-systems under ${node.name}`}
              onClick={() =>
                toggleBranch(
                  node.id,
                )
              }
            >
              <span
                className="ai-stack__caret"
                aria-hidden="true"
              >
                <CaretDown
                  weight="bold"
                  size={13}
                />
              </span>
            </button>
          )}
        </div>

        {/* Children */}
        {children.length > 0 && (
          <ul
            id={listId}
            hidden={!isOpen}
            className={[
              'ai-stack__level',
              `ai-stack__level--${
                LEVEL[
                  Math.min(
                    depth + 1,
                    2,
                  )
                ]
              }`,
            ].join(' ')}
            style={
              depth === 0
                ? {
                    [
                      '--cols' as string
                    ]:
                      children.length,
                  }
                : undefined
            }
          >
            {children.map(
              (
                child,
                childIndex,
              ) =>
                renderNode(
                  child,
                  depth + 1,
                  depth === 0
                    ? child.id
                    : branchId,
                  childIndex,
                ),
            )}
          </ul>
        )}
      </li>
    )
  }

  return (
    <div
      ref={hostRef}
      className={[
        'ai-stack',
        drawn
          ? 'is-drawn'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* SVG connector layer */}
      {geometry.w > 0 && (
        <svg
          className="ai-stack__wires"
          viewBox={`0 0 ${round(
            geometry.w,
          )} ${round(
            geometry.h,
          )}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          {geometry.wires.map(
            (wire) => (
              <path
                key={wire.id}
                className={[
                  'ai-stack__wire',
                  active === null
                    ? ''
                    : wire.branchId ===
                        active
                      ? 'is-lit'
                      : 'is-dim',
                ]
                  .filter(Boolean)
                  .join(' ')}
                d={wire.d}
                pathLength={1}
                vectorEffect="non-scaling-stroke"
                style={{
                  [
                    '--wire-delay' as string
                  ]:
                    `${wire.delay}ms`,
                }}
              />
            ),
          )}
        </svg>
      )}

      {/* Tree */}
      <ul className="ai-stack__level ai-stack__level--trunk">
        {renderNode(
          root,
          0,
          root.id,
          0,
        )}
      </ul>
    </div>
  )
}