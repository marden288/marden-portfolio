import { useState, type FormEvent } from 'react'

import {
  PaperPlaneTilt,
  CheckCircle,
  WarningCircle,
  EnvelopeSimple,
  ArrowUpRight,
  CaretDown,
} from '@/components/slab'

import { FAQS } from '@/data/faqs'
import { profile } from '@/data/profile'

import {
  readLead,
  submitLead,
  SubmitError,
  MAX_NAME,
  MAX_EMAIL,
  MAX_MESSAGE,
  type SubmitResult,
} from '@/lib/contact'

/**
 * ContactGrid
 *
 * Contact section for the portfolio.
 *
 * Layout:
 * - Left side: FAQs + direct contact + social links
 * - Right side: contact form
 *
 * Form:
 * - Uses readLead() for validation
 * - Uses submitLead() for delivery
 * - Supports webhook or mail-client fallback
 * - Shows loading, success and error states
 * - Includes honeypot spam protection
 */

type Status =
  | {
      kind: 'idle'
    }
  | {
      kind: 'sending'
    }
  | {
      kind: 'error'
      note: string
    }
  | {
      kind: 'sent'
      via: SubmitResult['via']
    }

/**
 * Keeps the submit animation visible even when
 * the backend responds immediately.
 */
const FLIGHT_MS = 650

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function ContactGrid() {
  const [status, setStatus] = useState<Status>({
    kind: 'idle',
  })

  /**
   * Changes this value whenever validation/submission fails.
   * The button uses the key to replay its shake animation.
   */
  const [shake, setShake] = useState(0)

  /**
   * Only one FAQ is open at a time.
   */
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                   */
  /* ------------------------------------------------------------------------ */

  const onSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    /**
     * Prevent duplicate submits.
     */
    if (status.kind === 'sending') {
      return
    }

    const form = event.currentTarget

    /**
     * Convert form data into the contact lead.
     */
    const lead = readLead(
      new FormData(form),
    )

    /**
     * Client-side validation.
     */
    if (!lead) {
      setStatus({
        kind: 'error',
        note:
          'Please add your name, a valid email address, and a short message.',
      })

      setShake((value) => value + 1)

      return
    }

    /**
     * Sending state.
     */
    setStatus({
      kind: 'sending',
    })

    try {
      /**
       * Run the submit and animation timer together.
       *
       * This means the success state does not appear
       * instantly if the submission is very fast.
       */
      const [result] = await Promise.all([
        submitLead(lead),
        wait(FLIGHT_MS),
      ])

      setStatus({
        kind: 'sent',
        via: result.via,
      })

      /**
       * Clear the form after successful submission.
       *
       * Since the form is replaced by the success screen,
       * this is mainly useful if the component is changed
       * to keep the form mounted in the future.
       */
      form.reset()
    } catch (error) {
      const note =
        error instanceof SubmitError
          ? error.message
          : 'That did not go through. Please email me directly instead.'

      setStatus({
        kind: 'error',
        note,
      })

      setShake((value) => value + 1)
    }
  }

  const busy =
    status.kind === 'sending'

  /* ------------------------------------------------------------------------ */
  /* FAQ                                                                      */
  /* ------------------------------------------------------------------------ */

  const toggleFaq = (index: number) => {
    setOpenFaq((current) =>
      current === index
        ? null
        : index,
    )
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <section
      className="pgrid cgrid"
      aria-labelledby="contact-title"
    >
      {/* ================================================================== */}
      {/* Header                                                             */}
      {/* ================================================================== */}

      <header className="pgrid__head">
        <span className="pgrid__eyebrow">
          FAQs / Contact
        </span>

        <h1
          className="pgrid__title"
          id="contact-title"
        >
          Let&apos;s build something useful.
        </h1>

        <p className="pgrid__lede">
          Have a website, web app, automation, or
          technology project in mind? Send me a message
          with a few details and I&apos;ll get back to you
          with the next steps.
        </p>
      </header>

      {/* ================================================================== */}
      {/* Glass container                                                     */}
      {/* ================================================================== */}

      <div className="home__glass cgrid__glass">
        {/* ================================================================ */}
        {/* LEFT — FAQ                                                        */}
        {/* ================================================================ */}

        <aside
          className="cgrid__aside"
          aria-labelledby="contact-faq"
        >
          <div className="cgrid__aside-head">
            <span className="cgrid__eyebrow">
              FAQs
            </span>

            <h2
              className="cgrid__aside-title"
              id="contact-faq"
            >
              Quick answers.
              <br />

              <span>
                Still have a question?
                Write below.
              </span>
            </h2>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* FAQ list                                                        */}
          {/* -------------------------------------------------------------- */}

          {FAQS.length > 0 ? (
            <ul
              className="cgrid__faqs"
              role="list"
            >
              {FAQS.map((faq, index) => {
                const isOpen =
                  openFaq === index

                const answerId =
                  `cfaq-${index}`

                return (
                  <li
                    key={faq.q}
                    className={
                      `cgrid__faq${
                        isOpen
                          ? ' is-open'
                          : ''
                      }`
                    }
                  >
                    <button
                      type="button"
                      className="cgrid__faq-q"
                      onClick={() =>
                        toggleFaq(index)
                      }
                      aria-expanded={
                        isOpen
                      }
                      aria-controls={
                        answerId
                      }
                    >
                      <span
                        className="cgrid__step-index"
                        aria-hidden="true"
                      >
                        {String(
                          index + 1,
                        ).padStart(2, '0')}
                      </span>

                      <span className="cgrid__faq-text">
                        {faq.q}
                      </span>

                      <CaretDown
                        size={14}
                        weight="bold"
                        className="cgrid__faq-caret"
                        aria-hidden="true"
                      />
                    </button>

                    <div
                      className="cgrid__faq-a"
                      id={answerId}
                      hidden={!isOpen}
                    >
                      <p>
                        {faq.a}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="cgrid__empty">
              Have a question? Send me a message
              and I&apos;ll be happy to help.
            </p>
          )}

          {/* -------------------------------------------------------------- */}
          {/* Direct contact                                                  */}
          {/* -------------------------------------------------------------- */}

          <div className="cgrid__direct">
            <a
              className="cgrid__mail"
              href={`mailto:${profile.email}`}
            >
              <EnvelopeSimple
                size={16}
                weight="fill"
                aria-hidden="true"
              />

              <span>
                {profile.email}
              </span>
            </a>

            {profile.socials?.length > 0 && (
              <ul
                className="cgrid__socials"
                role="list"
              >
                {profile.socials.map(
                  (social) => (
                    <li
                      key={social.label}
                    >
                      <a
                        className="cgrid__social"
                        href={
                          social.href
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={
                          social.label
                        }
                      >
                        <img
                          src={
                            social.iconPath
                          }
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      </a>
                    </li>
                  ),
                )}
              </ul>
            )}
          </div>
        </aside>

        {/* ================================================================ */}
        {/* RIGHT — FORM                                                      */}
        {/* ================================================================ */}

        <div className="cgrid__panel">
          {/* ============================================================ */}
          {/* SUCCESS                                                        */}
          {/* ============================================================ */}

          {status.kind === 'sent' ? (
            <div
              className="cgrid__done"
              role="status"
              aria-live="polite"
            >
              <span
                className="cgrid__done-mark"
                aria-hidden="true"
              >
                <CheckCircle
                  size={30}
                  weight="fill"
                />
              </span>

              <h2 className="cgrid__done-title">
                {status.via === 'webhook'
                  ? 'Message received.'
                  : 'Your mail app has it.'}
              </h2>

              <p className="cgrid__done-body">
                {status.via ===
                'webhook'
                  ? 'Your message has been received. I will review it and get back to you as soon as possible.'
                  : 'The message has been prepared in your email app. Press Send there and I will get back to you as soon as possible.'}
              </p>

              <button
                type="button"
                className="cgrid__again"
                onClick={() =>
                  setStatus({
                    kind: 'idle',
                  })
                }
              >
                Write another message
              </button>
            </div>
          ) : (
            /* ============================================================ */
            /* FORM                                                          */
            /* ============================================================ */

            <form
              className={
                `cgrid__form${
                  busy
                    ? ' is-sending'
                    : ''
                }`
              }
              onSubmit={onSubmit}
              noValidate
            >
              {/* ====================================================== */}
              {/* Honeypot                                                  */}
              {/* ====================================================== */}

              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="cgrid__trap"
              />

              {/* ====================================================== */}
              {/* Name                                                       */}
              {/* ====================================================== */}

              <div className="cgrid__row">
                <label className="cgrid__field">
                  <span className="cgrid__label">
                    First name
                  </span>

                  <input
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    required
                    maxLength={
                      MAX_NAME
                    }
                    placeholder="Marden"
                    disabled={busy}
                  />
                </label>

                <label className="cgrid__field">
                  <span className="cgrid__label">
                    Last name
                  </span>

                  <input
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    required
                    maxLength={
                      MAX_NAME
                    }
                    placeholder="Barangan"
                    disabled={busy}
                  />
                </label>
              </div>

              {/* ====================================================== */}
              {/* Email                                                      */}
              {/* ====================================================== */}

              <label className="cgrid__field">
                <span className="cgrid__label">
                  Email
                </span>

                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  maxLength={
                    MAX_EMAIL
                  }
                  placeholder="mardenbarangan@gmail.com"
                  disabled={busy}
                />
              </label>

              {/* ====================================================== */}
              {/* Message                                                    */}
              {/* ====================================================== */}

              <label className="cgrid__field cgrid__field--grow">
                <span className="cgrid__label">
                  Tell me about your project
                </span>

                <textarea
                  name="message"
                  required
                  maxLength={
                    MAX_MESSAGE
                  }
                  placeholder="What are you building? What do you need help with?"
                  disabled={busy}
                />
              </label>

              {/* ====================================================== */}
              {/* Actions                                                    */}
              {/* ====================================================== */}

              <div className="cgrid__actions">
                <button
                  key={shake}
                  type="submit"
                  className={
                    `cgrid__submit${
                      busy
                        ? ' is-sending'
                        : ''
                    }${
                      status.kind ===
                      'error'
                        ? ' is-shaking'
                        : ''
                    }`
                  }
                  disabled={busy}
                  aria-busy={busy}
                >
                  <span
                    className="cgrid__submit-plane"
                    aria-hidden="true"
                  >
                    <PaperPlaneTilt
                      size={17}
                      weight="fill"
                    />
                  </span>

                  <span className="cgrid__submit-label">
                    {busy
                      ? 'Sending...'
                      : 'Send message'}
                  </span>

                  <ArrowUpRight
                    className="cgrid__submit-arrow"
                    size={15}
                    weight="bold"
                    aria-hidden="true"
                  />
                </button>

                {/* ---------------------------------------------------- */}
                {/* Error                                                   */}
                {/* ---------------------------------------------------- */}

                {status.kind ===
                'error' ? (
                  <span
                    className="cgrid__status"
                    role="alert"
                  >
                    <WarningCircle
                      size={16}
                      weight="fill"
                      aria-hidden="true"
                    />

                    <span>
                      {status.note}
                    </span>
                  </span>
                ) : (
                  /* -------------------------------------------------- */
                  /* Normal hint                                         */
                  /* -------------------------------------------------- */

                  <span className="cgrid__hint">
                    I&apos;ll review your message
                    and get back to you as soon
                    as possible.
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}