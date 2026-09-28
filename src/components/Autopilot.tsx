import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

import {
  Lightning,
  EnvelopeSimple,
  CalendarCheck,
  Clock,
  BellRinging,
  VideoCamera,
  FileText,
  Trophy,
  XCircle,
  Hourglass,
  Heart,
  Plug,
  Sparkle,
} from '@/components/slab'

import type { Icon } from '@/components/slab'

/**
 * Autopilot
 *
 * Interactive automation workflow visualization.
 *
 * Features:
 * - GSAP animated signal particles
 * - SVG bezier cables
 * - Decision branches
 * - Loop-back workflow
 * - Responsive compact mode
 * - Reduced-motion support
 * - Pauses animation when off-screen
 */

gsap.registerPlugin(MotionPathPlugin)

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const DESIGN_W = 1000
const DESIGN_H = 388

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type FlowNode = {
  id: string
  Icon: Icon
  title: string
  subtitle: string
  x: number
  y: number
  variant?: 'trigger' | 'gate' | 'win' | 'lost'
}

type LinkKind = 'solid' | 'dash' | 'loop'

type Link = {
  from: string
  to: string
  kind?: LinkKind
  label?: string
}

type Rect = {
  x: number
  y: number
  w: number
  h: number
}

type Point = {
  x: number
  y: number
}

type PathGeometry = {
  d: string
  p1: Point
  p2: Point
}

type AutopilotProps = {
  /**
   * Compact mode is used when the component is rendered inside
   * a smaller home/portfolio panel.
   */
  compact?: boolean

  /**
   * Maximum scale allowed in compact mode.
   */
  maxScale?: number
}

/* -------------------------------------------------------------------------- */
/* Workflow nodes                                                             */
/* -------------------------------------------------------------------------- */

const NODES: FlowNode[] = [
  // Main workflow
  {
    id: 'n-form',
    Icon: Lightning,
    title: 'Trigger',
    subtitle: 'Form submitted',
    x: 6,
    y: 36,
    variant: 'trigger',
  },
  {
    id: 'n-email',
    Icon: EnvelopeSimple,
    title: 'Send Email',
    subtitle: 'Action',
    x: 176,
    y: 36,
  },
  {
    id: 'n-booked',
    Icon: CalendarCheck,
    title: 'Update CRM',
    subtitle: 'Action',
    x: 346,
    y: 36,
  },
  {
    id: 'n-24hr',
    Icon: Clock,
    title: 'Wait',
    subtitle: 'Delay step',
    x: 516,
    y: 36,
  },
  {
    id: 'n-1hr',
    Icon: BellRinging,
    title: 'Reminder',
    subtitle: 'Email & SMS',
    x: 686,
    y: 36,
  },
  {
    id: 'n-call',
    Icon: VideoCamera,
    title: 'Decision',
    subtitle: 'Condition gate',
    x: 866,
    y: 36,
    variant: 'gate',
  },

  // Outcomes
  {
    id: 'n-proposal',
    Icon: FileText,
    title: 'Proposal',
    subtitle: 'Next action',
    x: 56,
    y: 268,
  },
  {
    id: 'n-won',
    Icon: Trophy,
    title: 'Won',
    subtitle: 'Goal reached',
    x: 240,
    y: 268,
    variant: 'win',
  },
  {
    id: 'n-maybe',
    Icon: Hourglass,
    title: 'Not Ready',
    subtitle: 'Follow-up needed',
    x: 468,
    y: 268,
  },
  {
    id: 'n-nurture',
    Icon: Heart,
    title: 'AI Follow-up',
    subtitle: 'Nurture sequence',
    x: 652,
    y: 268,
  },
  {
    id: 'n-lost',
    Icon: XCircle,
    title: 'Lost',
    subtitle: 'Closed out',
    x: 866,
    y: 268,
    variant: 'lost',
  },
]

/* -------------------------------------------------------------------------- */
/* Workflow connections                                                       */
/* -------------------------------------------------------------------------- */

const LINKS: Link[] = [
  // Main path
  {
    from: 'n-form',
    to: 'n-email',
  },
  {
    from: 'n-email',
    to: 'n-booked',
  },
  {
    from: 'n-booked',
    to: 'n-24hr',
  },
  {
    from: 'n-24hr',
    to: 'n-1hr',
  },
  {
    from: 'n-1hr',
    to: 'n-call',
  },

  // Loop
  {
    from: 'n-1hr',
    to: 'n-booked',
    kind: 'loop',
    label: 'Loop Back',
  },

  // Decision branches
  {
    from: 'n-call',
    to: 'n-proposal',
    kind: 'dash',
  },
  {
    from: 'n-call',
    to: 'n-maybe',
    kind: 'dash',
  },
  {
    from: 'n-call',
    to: 'n-lost',
    kind: 'dash',
  },

  // Outcome paths
  {
    from: 'n-proposal',
    to: 'n-won',
  },
  {
    from: 'n-maybe',
    to: 'n-nurture',
  },
]

/* -------------------------------------------------------------------------- */
/* Tools                                                                      */
/* -------------------------------------------------------------------------- */

export const TOOLS: { Icon: Icon; label: string }[] = [
  {
    Icon: Plug,
    label: 'CRM Integration',
  },
  {
    Icon: EnvelopeSimple,
    label: 'Email & SMS',
  },
  {
    Icon: Sparkle,
    label: 'AI Assistant',
  },
]

/* -------------------------------------------------------------------------- */
/* SVG helpers                                                                */
/* -------------------------------------------------------------------------- */

const SVGNS = 'http://www.w3.org/2000/svg'

function createSvgElement<K extends keyof SVGElementTagNameMap>(
  tag: K,
): SVGElementTagNameMap[K] {
  return document.createElementNS(
    SVGNS,
    tag,
  ) as SVGElementTagNameMap[K]
}

/* -------------------------------------------------------------------------- */
/* Straight cable                                                             */
/* -------------------------------------------------------------------------- */

function dStraight(a: Rect, b: Rect): PathGeometry {
  const ax = a.x + a.w / 2
  const ay = a.y + a.h / 2

  const bx = b.x + b.w / 2
  const by = b.y + b.h / 2

  let p1: Point
  let p2: Point
  let c1: Point
  let c2: Point

  if (Math.abs(bx - ax) >= Math.abs(by - ay)) {
    const dir = bx > ax ? 1 : -1

    const offset = Math.max(
      34,
      Math.abs(bx - ax) * 0.45,
    )

    p1 = {
      x: a.x + (dir > 0 ? a.w : 0),
      y: ay,
    }

    p2 = {
      x: b.x + (dir > 0 ? 0 : b.w),
      y: by,
    }

    c1 = {
      x: p1.x + dir * offset,
      y: p1.y,
    }

    c2 = {
      x: p2.x - dir * offset,
      y: p2.y,
    }
  } else {
    const dir = by > ay ? 1 : -1

    const offset = Math.max(
      40,
      Math.abs(by - ay) * 0.5,
    )

    p1 = {
      x: ax,
      y: a.y + (dir > 0 ? a.h : 0),
    }

    p2 = {
      x: bx,
      y: b.y + (dir > 0 ? 0 : b.h),
    }

    c1 = {
      x: p1.x,
      y: p1.y + dir * offset,
    }

    c2 = {
      x: p2.x,
      y: p2.y - dir * offset,
    }
  }

  return {
    d: `M${p1.x},${p1.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`,
    p1,
    p2,
  }
}

/* -------------------------------------------------------------------------- */
/* Branch cable                                                               */
/* -------------------------------------------------------------------------- */

function dBranch(a: Rect, b: Rect): PathGeometry {
  const p1: Point = {
    x: a.x + a.w / 2,
    y: a.y + a.h,
  }

  const p2: Point = {
    x: b.x + b.w / 2,
    y: b.y,
  }

  const distance = Math.max(
    48,
    (p2.y - p1.y) * 0.55,
  )

  const c1: Point = {
    x: p1.x,
    y: p1.y + distance,
  }

  const c2: Point = {
    x: p2.x,
    y: p2.y - distance,
  }

  return {
    d: `M${p1.x},${p1.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`,
    p1,
    p2,
  }
}

/* -------------------------------------------------------------------------- */
/* Loop cable                                                                 */
/* -------------------------------------------------------------------------- */

function dLoop(a: Rect, b: Rect): PathGeometry {
  const p1: Point = {
    x: a.x + a.w / 2,
    y: a.y + a.h,
  }

  const p2: Point = {
    x: b.x + b.w / 2,
    y: b.y + b.h,
  }

  const dip = Math.max(
    p1.y,
    p2.y,
  ) + 10

  return {
    d: `M${p1.x},${p1.y} C${p1.x},${dip} ${p2.x},${dip} ${p2.x},${p2.y}`,
    p1,
    p2,
  }
}

/* -------------------------------------------------------------------------- */
/* Node component                                                             */
/* -------------------------------------------------------------------------- */

function Node({ node }: { node: FlowNode }) {
  const NodeIcon = node.Icon

  const variantClass = node.variant
    ? ` autopilot__node--${node.variant}`
    : ''

  return (
    <div
      id={node.id}
      className={`autopilot__node${variantClass}`}
      style={{
        left: node.x,
        top: node.y,
      }}
    >
      <span className="autopilot__node-card">
        <NodeIcon
          size={24}
          weight="regular"
          aria-hidden="true"
        />
      </span>

      <span className="autopilot__node-cap">
        <strong>{node.title}</strong>
        <span>{node.subtitle}</span>
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function Autopilot({
  compact = false,
  maxScale = 1,
}: AutopilotProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const fitRef = useRef<HTMLDivElement>(null)
  const flowRef = useRef<HTMLDivElement>(null)

  const cablesRef = useRef<SVGSVGElement>(null)
  const signalsRef = useRef<SVGSVGElement>(null)

  const tweensRef = useRef<gsap.core.Tween[]>([])

  /* ---------------------------------------------------------------------- */
  /* Build workflow                                                         */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const flow = flowRef.current
    const cablesSvg = cablesRef.current
    const signalsSvg = signalsRef.current

    if (!flow || !cablesSvg || !signalsSvg) {
      return
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let lastKey = ''

    /* ------------------------------------------------------------------ */
    /* Measure a node                                                     */
    /* ------------------------------------------------------------------ */

    const rectOf = (
      id: string,
      flowRect: DOMRect,
      scale: number,
      whole = false,
    ): Rect | null => {
      const selector = whole
        ? `#${id}`
        : `#${id} .autopilot__node-card`

      const element = flow.querySelector<HTMLElement>(
        selector,
      )

      if (!element) {
        return null
      }

      const rect = element.getBoundingClientRect()

      return {
        x: (rect.left - flowRect.left) / scale,
        y: (rect.top - flowRect.top) / scale,
        w: rect.width / scale,
        h: rect.height / scale,
      }
    }

    /* ------------------------------------------------------------------ */
    /* Clear all animations                                                */
    /* ------------------------------------------------------------------ */

    const clearAnimations = () => {
      tweensRef.current.forEach((tween) => {
        tween.kill()
      })

      tweensRef.current = []

      cablesSvg.replaceChildren()
      signalsSvg.replaceChildren()
    }

    /* ------------------------------------------------------------------ */
    /* Build SVG cables                                                    */
    /* ------------------------------------------------------------------ */

    const build = () => {
      const width = flow.scrollWidth || DESIGN_W
      const height = flow.scrollHeight || DESIGN_H

      const key = `${width}x${height}`

      if (key === lastKey) {
        return
      }

      lastKey = key

      clearAnimations()

      cablesSvg.setAttribute(
        'viewBox',
        `0 0 ${width} ${height}`,
      )

      signalsSvg.setAttribute(
        'viewBox',
        `0 0 ${width} ${height}`,
      )

      cablesSvg.style.width = `${width}px`
      cablesSvg.style.height = `${height}px`

      signalsSvg.style.width = `${width}px`
      signalsSvg.style.height = `${height}px`

      const flowRect = flow.getBoundingClientRect()

      const scale = flow.offsetWidth
        ? flowRect.width / flow.offsetWidth
        : 1

      LINKS.forEach((link, index) => {
        const kind = link.kind ?? 'solid'

        const source = rectOf(
          link.from,
          flowRect,
          scale,
          kind === 'loop',
        )

        const target = rectOf(
          link.to,
          flowRect,
          scale,
          kind === 'loop',
        )

        if (!source || !target) {
          return
        }

        let geometry: PathGeometry

        if (kind === 'loop') {
          geometry = dLoop(
            source,
            target,
          )
        } else if (kind === 'dash') {
          geometry = dBranch(
            source,
            target,
          )
        } else {
          geometry = dStraight(
            source,
            target,
          )
        }

        const isDashed = kind !== 'solid'

        /* -------------------------------------------------------------- */
        /* Cable                                                           */
        /* -------------------------------------------------------------- */

        const path = createSvgElement('path')

        path.setAttribute(
          'd',
          geometry.d,
        )

        path.setAttribute(
          'fill',
          'none',
        )

        path.style.stroke =
          kind === 'loop'
            ? 'var(--ap-loop)'
            : isDashed
              ? 'var(--ap-cable-dash)'
              : 'var(--ap-cable)'

        path.setAttribute(
          'stroke-width',
          kind === 'loop'
            ? '2'
            : '2.3',
        )

        path.setAttribute(
          'stroke-linecap',
          'round',
        )

        if (isDashed) {
          path.setAttribute(
            'stroke-dasharray',
            kind === 'loop'
              ? '7 8'
              : '1 7',
          )
        }

        cablesSvg.appendChild(path)

        /* -------------------------------------------------------------- */
        /* Endpoint dots                                                   */
        /* -------------------------------------------------------------- */

        for (const point of [
          geometry.p1,
          geometry.p2,
        ]) {
          const dot = createSvgElement('circle')

          dot.setAttribute(
            'cx',
            String(point.x),
          )

          dot.setAttribute(
            'cy',
            String(point.y),
          )

          dot.setAttribute(
            'r',
            '3.2',
          )

          dot.style.fill =
            kind === 'loop'
              ? 'var(--ap-loop)'
              : 'var(--ap-port)'

          cablesSvg.appendChild(dot)
        }

        /* -------------------------------------------------------------- */
        /* Loop label                                                      */
        /* -------------------------------------------------------------- */

        if (link.label) {
          const text = createSvgElement('text')

          const labelX =
            (geometry.p1.x +
              geometry.p2.x) /
            2

          const labelY =
            kind === 'loop'
              ? Math.max(
                  geometry.p1.y,
                  geometry.p2.y,
                ) + 25
              : (geometry.p1.y +
                  geometry.p2.y) /
                  2 -
                10

          text.setAttribute(
            'x',
            String(labelX),
          )

          text.setAttribute(
            'y',
            String(labelY),
          )

          text.setAttribute(
            'text-anchor',
            'middle',
          )

          text.setAttribute(
            'font-size',
            '10.5',
          )

          text.setAttribute(
            'font-weight',
            '600',
          )

          text.setAttribute(
            'font-family',
            'Poppins, sans-serif',
          )

          text.style.fill =
            'var(--ap-loop)'

          text.textContent = link.label

          cablesSvg.appendChild(text)
        }

        /* -------------------------------------------------------------- */
        /* Signal animation                                                */
        /* -------------------------------------------------------------- */

        if (reduceMotion) {
          return
        }

        const signal = createSvgElement(
          'circle',
        )

        signal.setAttribute(
          'r',
          isDashed
            ? '3.2'
            : '4.4',
        )

        signal.style.fill =
          'var(--ap-loop)'

        signal.setAttribute(
          'filter',
          'drop-shadow(0 0 5px rgba(255, 122, 26, 0.9))',
        )

        signalsSvg.appendChild(signal)

        let length = 360

        try {
          length = path.getTotalLength()
        } catch {
          length = 360
        }

        const duration = Math.min(
          7,
          Math.max(
            2.4,
            length / 95,
          ),
        )

        const tween = gsap.to(
          signal,
          {
            duration,
            repeat: -1,
            ease: 'none',
            delay: -(index % 6) * 0.42,

            motionPath: {
              path: geometry.d,
              autoRotate: false,
              alignOrigin: [0.5, 0.5],
            },
          },
        )

        tweensRef.current.push(
          tween,
        )
      })
    }

    /* ------------------------------------------------------------------ */
    /* Initial build                                                       */
    /* ------------------------------------------------------------------ */

    let raf = requestAnimationFrame(
      build,
    )

    /* ------------------------------------------------------------------ */
    /* Wait for fonts                                                     */
    /* ------------------------------------------------------------------ */

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        window.setTimeout(
          build,
          60,
        )
      })
    }

    /* ------------------------------------------------------------------ */
    /* Resize observer                                                    */
    /* ------------------------------------------------------------------ */

    const resizeObserver =
      new ResizeObserver(() => {
        cancelAnimationFrame(raf)

        raf = requestAnimationFrame(
          build,
        )
      })

    resizeObserver.observe(flow)

    /* ------------------------------------------------------------------ */
    /* Window resize                                                      */
    /* ------------------------------------------------------------------ */

    const handleWindowResize = () => {
      lastKey = ''

      cancelAnimationFrame(raf)

      raf = requestAnimationFrame(
        build,
      )
    }

    window.addEventListener(
      'resize',
      handleWindowResize,
    )

    /* ------------------------------------------------------------------ */
    /* Cleanup                                                            */
    /* ------------------------------------------------------------------ */

    return () => {
      cancelAnimationFrame(raf)

      resizeObserver.disconnect()

      window.removeEventListener(
        'resize',
        handleWindowResize,
      )

      clearAnimations()
    }
  }, [])

  /* ---------------------------------------------------------------------- */
  /* Compact scaling                                                        */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!compact) {
      return
    }

    const box = fitRef.current

    if (!box) {
      return
    }

    const applyScale = () => {
      const width = box.clientWidth
      const height = box.clientHeight

      if (!width || !height) {
        return
      }

      const scale = Math.min(
        width / DESIGN_W,
        height / DESIGN_H,
        maxScale,
      )

      box.style.setProperty(
        '--flow-scale',
        String(
          scale > 0
            ? scale
            : 1,
        ),
      )
    }

    applyScale()

    const resizeObserver =
      new ResizeObserver(
        applyScale,
      )

    resizeObserver.observe(box)

    return () => {
      resizeObserver.disconnect()
    }
  }, [
    compact,
    maxScale,
  ])

  /* ---------------------------------------------------------------------- */
  /* Pause animation when off-screen                                        */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const section =
      sectionRef.current

    if (!section) {
      return
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          const visible =
            entry?.isIntersecting ??
            false

          tweensRef.current.forEach(
            (tween) => {
              if (visible) {
                tween.play()
              } else {
                tween.pause()
              }
            },
          )
        },
        {
          threshold: 0,
        },
      )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <section
      ref={sectionRef}
      id="autopilot"
      className={
        compact
          ? 'autopilot autopilot--compact'
          : 'autopilot'
      }
      aria-label={
        compact
          ? 'Example automation workflow'
          : undefined
      }
      aria-labelledby={
        compact
          ? undefined
          : 'autopilot-heading'
      }
      data-reveal
    >
      {/* -------------------------------------------------------------- */}
      {/* Header                                                          */}
      {/* -------------------------------------------------------------- */}

      {!compact && (
        <header className="autopilot__head">
          <span className="autopilot__eyebrow">
            Live Automation
          </span>

          <h2
            id="autopilot-heading"
            className="autopilot__headline"
          >
            Your workflow, end to end.
          </h2>

          <p className="autopilot__intro">
            A simple example of how an automated
            workflow can move a lead from the first
            form submission through email, CRM updates,
            reminders, AI follow-up, and final outcomes.
          </p>
        </header>
      )}

      {/* -------------------------------------------------------------- */}
      {/* macOS-style window                                               */}
      {/* -------------------------------------------------------------- */}

      <div className="autopilot__window">
        <div
          className="autopilot__titlebar"
          aria-hidden="true"
        >
          <span className="autopilot__dots">
            <span className="autopilot__dot autopilot__dot--r" />
            <span className="autopilot__dot autopilot__dot--y" />
            <span className="autopilot__dot autopilot__dot--g" />
          </span>

          <span className="autopilot__titlebar-label">
            Automation Workflow
          </span>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Canvas                                                         */}
        {/* ------------------------------------------------------------ */}

        <div className="autopilot__canvas">
          <p className="autopilot__caption">
            From lead capture to follow-up and conversion.
          </p>

          <div
            className="autopilot__board"
            aria-hidden="true"
          >
            <div
              className="autopilot__fit"
              ref={fitRef}
            >
              <div
                className="autopilot__flow"
                ref={flowRef}
                style={{
                  width: DESIGN_W,
                  height: DESIGN_H,
                }}
              >
                {/* SVG cables */}
                <svg
                  className="autopilot__cables"
                  ref={cablesRef}
                  aria-hidden="true"
                />

                {/* Animated signals */}
                <svg
                  className="autopilot__signals"
                  ref={signalsRef}
                  aria-hidden="true"
                />

                {/* Nodes */}
                {NODES.map(
                  (node) => (
                    <Node
                      key={node.id}
                      node={node}
                    />
                  ),
                )}
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* Tools                                                        */}
          {/* ---------------------------------------------------------- */}

          <ul
            className="autopilot__tools"
            role="list"
            aria-label="Tools that power this automation"
          >
            {TOOLS.map(
              ({
                Icon: ToolIcon,
                label,
              }) => (
                <li
                  key={label}
                  className="autopilot__tool"
                >
                  <ToolIcon
                    size={14}
                    weight="duotone"
                    aria-hidden="true"
                  />

                  <span>
                    {label}
                  </span>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}