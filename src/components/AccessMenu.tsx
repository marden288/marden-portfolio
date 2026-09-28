import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  PersonArmsSpread,
  X,
  ArrowCounterClockwise,
} from '@/components/slab'

import {
  DEFAULT_PREFS,
  readPrefs,
  savePrefs,
  type A11yPrefs,
  type TextSize,
} from '@/lib/a11y'

import {
  useDismiss,
  type DismissReason,
} from '@/hooks/useDismiss'

/**
 * Accessibility menu
 *
 * Features:
 * - Text size: default / large / largest
 * - High contrast
 * - Reduce motion
 * - Underline links
 * - Reset preferences
 * - Keyboard accessible
 * - Escape closes the panel
 * - Focus returns to the opener
 * - Preferences are saved locally
 */

const SIZES: {
  value: TextSize
  label: string
  hint: string
}[] = [
  {
    value: 'md',
    label: 'A',
    hint: 'Default text size',
  },
  {
    value: 'lg',
    label: 'A+',
    hint: 'Larger text',
  },
  {
    value: 'xl',
    label: 'A++',
    hint: 'Largest text',
  },
]

const SWITCHES: {
  key: 'contrast' | 'motion' | 'links'
  label: string
  desc: string
}[] = [
  {
    key: 'contrast',
    label: 'High contrast',
    desc: 'Darker text, stronger edges',
  },
  {
    key: 'motion',
    label: 'Reduce motion',
    desc: 'No animation or drifting',
  },
  {
    key: 'links',
    label: 'Underline links',
    desc: 'Every link gets a line',
  },
]

/**
 * Custom event used by other components.
 *
 * Example:
 *
 * window.dispatchEvent(
 *   new CustomEvent(A11Y_OPEN_EVENT, {
 *     detail: buttonElement,
 *   })
 * )
 */
export const A11Y_OPEN_EVENT = 'a11y:open'

export default function AccessMenu() {
  const [open, setOpen] = useState(false)

  const [prefs, setPrefs] = useState<A11yPrefs>(() => {
    return readPrefs()
  })

  const rootRef = useRef<HTMLDivElement>(null)

  const panelRef = useRef<HTMLDivElement>(null)

  const buttonRef = useRef<HTMLButtonElement>(null)

  /**
   * Stores the element that opened the accessibility panel.
   *
   * This is useful when the panel is opened from the mobile menu.
   */
  const returnRef = useRef<HTMLElement | null>(null)

  /**
   * Close accessibility menu.
   */
  const close = useCallback(
    (reason: DismissReason | 'button') => {
      setOpen(false)

      /**
       * When closing normally, return keyboard focus
       * to the element that opened the menu.
       */
      if (reason !== 'outside') {
        const opener = returnRef.current

        const focusTarget =
          opener?.isConnected
            ? opener
            : buttonRef.current

        focusTarget?.focus()
      }

      returnRef.current = null
    },
    [],
  )

  /**
   * Detect outside click and Escape.
   */
  useDismiss(
    open,
    rootRef,
    close,
  )

  /**
   * Move focus inside the dialog after opening.
   */
  useEffect(() => {
    if (!open) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      panelRef.current?.focus()
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [open])

  /**
   * Allow other components to open the accessibility menu.
   */
  useEffect(() => {
    const onOpen = (event: Event) => {
      const customEvent =
        event as CustomEvent<HTMLElement | null>

      returnRef.current = customEvent.detail ?? null

      setOpen(true)
    }

    window.addEventListener(
      A11Y_OPEN_EVENT,
      onOpen,
    )

    return () => {
      window.removeEventListener(
        A11Y_OPEN_EVENT,
        onOpen,
      )
    }
  }, [])

  /**
   * Update and persist accessibility preferences.
   */
  const update = useCallback(
    (next: A11yPrefs) => {
      setPrefs(next)
      savePrefs(next)
    },
    [],
  )

  /**
   * Determine whether the user changed
   * any accessibility preference.
   */
  const changed =
    prefs.text !== 'md' ||
    prefs.contrast ||
    prefs.motion ||
    prefs.links

  /**
   * Toggle the accessibility panel.
   */
  const toggleMenu = () => {
    if (open) {
      close('button')
      return
    }

    returnRef.current = null
    setOpen(true)
  }

  /**
   * Reset all accessibility preferences.
   */
  const resetPreferences = () => {
    update({
      ...DEFAULT_PREFS,
    })
  }

  return (
    <div
      className={`a11y${open ? ' is-open' : ''}`}
      data-widget="a11y"
      ref={rootRef}
    >
      {/* Accessibility panel */}
      <div
        className="a11y__panel"
        role="dialog"
        aria-modal="false"
        aria-label="Accessibility options"
        tabIndex={-1}
        ref={panelRef}
        inert={!open || undefined}
      >
        {/* Header */}
        <header className="a11y__head">
          <span className="a11y__title">
            Accessibility
          </span>

          <button
            type="button"
            className="a11y__close"
            onClick={() => close('button')}
            aria-label="Close accessibility options"
          >
            <X
              size={16}
              weight="bold"
              aria-hidden="true"
            />
          </button>
        </header>

        {/* Text size */}
        <div
          className="a11y__group"
          role="group"
          aria-label="Text size"
        >
          <span className="a11y__label">
            Text size
          </span>

          <div className="a11y__sizes">
            {SIZES.map((size) => {
              const active =
                prefs.text === size.value

              return (
                <button
                  key={size.value}
                  type="button"
                  className={`a11y__size${
                    active ? ' is-on' : ''
                  }`}
                  aria-pressed={active}
                  aria-label={size.hint}
                  title={size.hint}
                  onClick={() =>
                    update({
                      ...prefs,
                      text: size.value,
                    })
                  }
                >
                  {size.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Accessibility switches */}
        <ul
          className="a11y__list"
          role="list"
        >
          {SWITCHES.map((item) => {
            const active = prefs[item.key]

            return (
              <li key={item.key}>
                <button
                  type="button"
                  className={`a11y__switch${
                    active ? ' is-on' : ''
                  }`}
                  aria-pressed={active}
                  onClick={() =>
                    update({
                      ...prefs,
                      [item.key]: !active,
                    })
                  }
                >
                  <span className="a11y__switch-text">
                    <span className="a11y__switch-label">
                      {item.label}
                    </span>

                    <span className="a11y__switch-desc">
                      {item.desc}
                    </span>
                  </span>

                  <span
                    className="a11y__toggle"
                    aria-hidden="true"
                  />
                </button>
              </li>
            )
          })}
        </ul>

        {/* Reset */}
        <button
          type="button"
          className="a11y__reset"
          onClick={resetPreferences}
          disabled={!changed}
        >
          <ArrowCounterClockwise
            size={14}
            weight="bold"
            aria-hidden="true"
          />

          <span>
            Reset to default
          </span>
        </button>
      </div>

      {/* Floating accessibility button */}
      <button
        type="button"
        className="a11y__button"
        ref={buttonRef}
        onClick={toggleMenu}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={
          open
            ? 'Close accessibility options'
            : 'Accessibility options'
        }
        title="Accessibility options"
      >
        {open ? (
          <X
            size={22}
            weight="bold"
            aria-hidden="true"
          />
        ) : (
          <PersonArmsSpread
            size={22}
            weight="fill"
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  )
}