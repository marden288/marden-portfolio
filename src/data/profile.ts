/**
 * MARDEN C. BARANGAN
 * Personal profile / identity data
 *
 * This file contains the information used by:
 * - Home page
 * - Profile sidebar
 * - Hero section
 * - About section
 * - Contact section
 * - Social links
 */

import {
  Briefcase,
  SealCheck,
  Clock,
  type Icon,
} from '@/components/slab'

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type SocialLink = {
  label: string
  href: string
  iconPath: string
}

export type Stat = {
  value: string
  label: string
  Icon: Icon
}

export type Profile = {
  name: string
  firstName: string
  handle: string
  role: string
  avatarSrc: string
  verifiedLabel: string
  email: string
  location: string
  stats: Stat[]
  displayName: {
    line1: string
    line2: string
  }
  hero: {
    body: string
    portraitSrc: string
    portraitAlt: string
  }
  socials: SocialLink[]
}

/* -------------------------------------------------------------------------- */
/* Profile                                                                    */
/* -------------------------------------------------------------------------- */

export const profile: Profile = {
  /*
   * Full name
   */
  name: 'Den.dev',

  /*
   * First name used by the About/Home sections.
   */
  firstName: 'Marden',

  /*
   * Handle displayed below the name.
   */
  handle: 'mardenbarangan0728@gmail.com',

  /*
   * Main professional title.
   */
  role: 'Software Developer / Web Developer / Computer Engineer',

  /*
   * IMPORTANT:
   *
   * Put your image here:
   *
   * public/avatar.jpg
   *
   * Then use:
   * /avatar.jpg
   */
  avatarSrc: '/avatar.jpg',

  /*
   * Tooltip/accessibility text for the verification icon.
   */
  verifiedLabel: 'Computer Engineering graduate',

  /*
   * Contact email.
   */
  email: 'mardenbarangan0728@gmail.com',

  /*
   * Location.
   */
  location: 'Laoag City, Ilocos Norte, Philippines',

  /*
   * Quick facts displayed around the profile.
   */
  stats: [
    {
      value: '4+',
      label: 'Tech Focus Areas',
      Icon: Briefcase,
    },
    {
      value: 'BSCOE',
      label: 'Computer Engineering',
      Icon: SealCheck,
    },
    {
      value: 'PH',
      label: 'Philippines',
      Icon: Clock,
    },
  ],

  /*
   * Intro animation text.
   */
  displayName: {
    line1: 'Welcome',
    line2: 'To My Website.',
  },

  /*
   * Main hero information.
   */
  hero: {
    body:
      'I’m Marden C. Barangan, a Computer Engineering graduate focused on software development, web development, embedded systems, AI, and modern technology.',

    /*
     * Use the same image in the hero.
     *
     * File:
     * public/avatar.jpg
     */
    portraitSrc: '/avatar.jpg',

    portraitAlt: 'Portrait of Marden C. Barangan',
  },

  /*
   * Social media.
   *
   * Make sure these files exist:
   *
   * public/icons/facebook.svg
   * public/icons/linkedin.svg
   * public/icons/instagram.svg
   */
  socials: [
    {
      label: 'Facebook profile',
      href: 'https://www.facebook.com/mardenbarangan03',
      iconPath: '/icons/facebook.svg',
    },

    {
      label: 'LinkedIn profile',
      href: 'https://www.linkedin.com/in/marden-barangan-821a21366',
      iconPath: '/icons/linkedin.svg',
    },

    {
      label: 'Instagram profile',
      href: 'https://www.instagram.com/engr_marden/?hl=en',
      iconPath: '/icons/instagram.svg',
    },
  ],
}