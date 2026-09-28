import { profile } from '@/data/profile'

/**
 * Contact submission
 *
 * Two submission modes are supported:
 *
 * 1. Webhook
 *    If VITE_CONTACT_ENDPOINT is configured, the lead is sent as JSON.
 *
 * 2. Mail client
 *    If no endpoint is configured, the visitor's default mail application
 *    opens with the lead information pre-filled.
 *
 * Example .env.production:
 *
 *   VITE_CONTACT_ENDPOINT=https://your-domain.com/api/contact
 *
 * The backend should accept:
 *
 *   POST
 *   Content-Type: application/json
 *
 * with:
 *
 *   {
 *     firstName: string,
 *     lastName: string,
 *     email: string,
 *     message: string,
 *     website: string
 *   }
 */

/* -------------------------------------------------------------------------- */
/* Configuration                                                              */
/* -------------------------------------------------------------------------- */

export const ENDPOINT: string =
  import.meta.env.VITE_CONTACT_ENDPOINT?.trim() ?? ''

export const RECIPIENT = profile.email

/* -------------------------------------------------------------------------- */
/* Validation limits                                                          */
/* -------------------------------------------------------------------------- */

export const MAX_NAME = 80
export const MAX_EMAIL = 254
export const MAX_MESSAGE = 5000

/* -------------------------------------------------------------------------- */
/* Sanitisation                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Control characters excluding the allowed newline characters.
 *
 * Used for:
 * - first name
 * - last name
 * - email
 *
 * These fields should not contain line breaks.
 */
const CTRL_NO_NL = new RegExp(
  '[\\u0000-\\u001F\\u007F]',
  'g',
)

/**
 * Control characters while allowing:
 *
 * - LF  \\n
 * - CR  \\r
 * - TAB \\t
 *
 * Used for the message field.
 */
const CTRL_KEEP_NL = new RegExp(
  '[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]',
  'g',
)

/**
 * Invisible / zero-width / bidirectional control characters.
 *
 * These are removed from all user-provided fields.
 */
const ZERO_WIDTH = new RegExp(
  '[\\u200B-\\u200F\\u202A-\\u202E\\u2060\\uFEFF]',
  'g',
)

/**
 * Remove unsafe control characters from user input.
 *
 * Newlines can optionally be preserved for the message field.
 */
export function sanitize(
  input: string,
  allowNewlines = false,
): string {
  const controls = allowNewlines
    ? CTRL_KEEP_NL
    : CTRL_NO_NL

  return input
    .replace(controls, '')
    .replace(ZERO_WIDTH, '')
}

/* -------------------------------------------------------------------------- */
/* Email validation                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Practical email validation.
 *
 * This intentionally performs basic validation rather than attempting
 * to implement the complete RFC email grammar.
 */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* -------------------------------------------------------------------------- */
/* Lead type                                                                  */
/* -------------------------------------------------------------------------- */

export type Lead = {
  firstName: string
  lastName: string
  email: string
  message: string

  /**
   * Honeypot field.
   *
   * A normal visitor should leave this empty.
   *
   * Your backend should reject/drop submissions where this
   * field contains anything.
   */
  website: string
}

/* -------------------------------------------------------------------------- */
/* Submission result                                                          */
/* -------------------------------------------------------------------------- */

export type SubmitResult =
  | {
      via: 'webhook'
    }
  | {
      via: 'mailto'
    }

/* -------------------------------------------------------------------------- */
/* Errors                                                                     */
/* -------------------------------------------------------------------------- */

export class SubmitError extends Error {
  constructor(message: string) {
    super(message)

    this.name = 'SubmitError'

    /**
     * Restore prototype chain for environments/transpilation
     * where extending Error can otherwise behave unexpectedly.
     */
    Object.setPrototypeOf(this, SubmitError.prototype)
  }
}

/* -------------------------------------------------------------------------- */
/* FormData helpers                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Safely convert a FormData value to a string.
 *
 * FormData can contain:
 *
 * - string
 * - File
 * - null
 *
 * We only accept string values for the contact form.
 */
function getStringField(
  data: FormData,
  name: string,
): string {
  const value = data.get(name)

  if (typeof value !== 'string') {
    return ''
  }

  return value
}

/**
 * Read, trim, limit and sanitise the contact form.
 *
 * Returns:
 *
 *   Lead   -> valid form
 *   null   -> invalid form
 *
 * Required fields:
 *
 * - firstName
 * - lastName
 * - email
 * - message
 *
 * The honeypot is returned untouched except for being converted
 * to a string. The backend is responsible for rejecting a filled
 * honeypot.
 */
export function readLead(
  data: FormData,
): Lead | null {
  const firstName = sanitize(
    getStringField(data, 'firstName').trim(),
  ).slice(0, MAX_NAME)

  const lastName = sanitize(
    getStringField(data, 'lastName').trim(),
  ).slice(0, MAX_NAME)

  const email = sanitize(
    getStringField(data, 'email').trim(),
  )
    .slice(0, MAX_EMAIL)
    .toLowerCase()

  const message = sanitize(
    getStringField(data, 'message').trim(),
    true,
  ).slice(0, MAX_MESSAGE)

  /**
   * Honeypot:
   *
   * Keep the original behavior where the backend can inspect
   * whether the hidden "website" field was filled.
   */
  const website = getStringField(data, 'website').trim()

  if (
    !firstName ||
    !lastName ||
    !email ||
    !message
  ) {
    return null
  }

  if (!EMAIL_RE.test(email)) {
    return null
  }

  return {
    firstName,
    lastName,
    email,
    message,
    website,
  }
}

/* -------------------------------------------------------------------------- */
/* Webhook submission                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Submit a lead to the configured webhook endpoint.
 */
async function submitToWebhook(
  lead: Lead,
): Promise<SubmitResult> {
  let response: Response

  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(lead),
    })
  } catch {
    throw new SubmitError(
      'Unable to connect to the contact server. Please try again.',
    )
  }

  if (!response.ok) {
    /**
     * The backend may return:
     *
     * { "error": "Your custom error message." }
     *
     * If it does not, use a generic HTTP error.
     */
    const body = await response
      .json()
      .catch(() => null)

    const serverMessage =
      body &&
      typeof body === 'object' &&
      'error' in body &&
      typeof body.error === 'string'
        ? body.error.trim()
        : ''

    throw new SubmitError(
      serverMessage ||
        `The server answered ${response.status}.`,
    )
  }

  return {
    via: 'webhook',
  }
}

/* -------------------------------------------------------------------------- */
/* Mailto submission                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Open the visitor's default email client.
 *
 * encodeURIComponent() is used for every parameter to prevent
 * CR/LF header injection and URL parameter smuggling.
 */
function submitByMailto(
  lead: Lead,
): SubmitResult {
  const subject =
    `Project inquiry from ${lead.firstName} ${lead.lastName}`

  const body = [
    `Name: ${lead.firstName} ${lead.lastName}`,
    `Email: ${lead.email}`,
    '',
    lead.message,
  ].join('\n')

  const mailto = [
    `mailto:${encodeURIComponent(RECIPIENT)}`,
    `?subject=${encodeURIComponent(subject)}`,
    `&body=${encodeURIComponent(body)}`,
  ].join('')

  window.location.href = mailto

  return {
    via: 'mailto',
  }
}

/* -------------------------------------------------------------------------- */
/* Public submission function                                                */
/* -------------------------------------------------------------------------- */

/**
 * Submit a contact lead.
 *
 * If VITE_CONTACT_ENDPOINT exists:
 *
 *   Lead → JSON POST → webhook
 *
 * Otherwise:
 *
 *   Lead → mailto → visitor's email client
 */
export async function submitLead(
  lead: Lead,
): Promise<SubmitResult> {
  /**
   * Webhook mode.
   */
  if (ENDPOINT) {
    return submitToWebhook(lead)
  }

  /**
   * Mail client fallback.
   */
  return submitByMailto(lead)
}