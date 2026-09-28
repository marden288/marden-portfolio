import { Link } from 'react-router-dom'

import {
  SealCheck,
  CaretRight,
  Play,
  Stack,
  Coffee,
} from '@/components/slab'

import { profile } from '@/data/profile'
import QuickMenu from './QuickMenu'
/**
 * ============================================================
 * HOME MOBILE / PHONE SECTIONS
 * ============================================================
 *
 * HomeProfile
 * - Profile image
 * - Name
 * - Verified mark
 * - Email/handle
 * - Role
 * - Quick menu
 *
 * HomeStats
 * - Profile statistics
 *
 * HomeExplore
 * - Mobile navigation cards
 * - Projects
 * - Services
 * - Showcase
 * - Testimonials
 * - About
 *
 * HomeProof
 * - Featured testimonial preview
 */


/* ============================================================
   SAFE IMAGE
   ============================================================ */

/**
 * Prevents broken-image icons from appearing if an asset
 * cannot be loaded.
 *
 * All images inside /public are referenced WITHOUT /public.
 *
 * Example:
 *
 * public/placeholders/project-1.jpg
 *
 * becomes:
 *
 * /placeholders/project-1.jpg
 */

function SafeImage({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
}: {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      onError={(event) => {
        const image = event.currentTarget

        /*
         * Hide the broken image instead of displaying
         * the browser's broken-image icon.
         */
        image.style.display = 'none'
      }}
    />
  )
}


/* ============================================================
   HOME PROFILE
   ============================================================ */

export function HomeProfile() {
  return (
    <header className="hprofile">

      {/* Profile picture */}
      <SafeImage
        className="hprofile__avatar"
        src={profile.avatarSrc}
        alt={`${profile.name} profile`}
        width={56}
        height={56}
        loading="eager"
      />

      {/* Name + account information */}
      <div className="hprofile__who">

        <span className="hprofile__name">
          {profile.name}

          <SealCheck
            size={16}
            weight="fill"
            className="hprofile__verified"
            aria-label={profile.verifiedLabel}
          />
        </span>

        <span className="hprofile__handle">
          {profile.handle}
          {' · '}
          {profile.role}
        </span>

      </div>

      {/* Theme + accessibility menu */}
      <QuickMenu className="hprofile__menu" />

    </header>
  )
}


/* ============================================================
   HOME STATS
   ============================================================ */

export function HomeStats() {
  return (
    <ul
      className="hstats"
      role="list"
    >
      {profile.stats.map(
        (
          {
            value,
            label,
            Icon,
          },
          index,
        ) => (
          <li
            key={`${label}-${index}`}
          >

            <Icon
              className="hstats__icon"
              size={18}
              weight="duotone"
              aria-hidden="true"
            />

            <b className="hstats__value">
              {value}
            </b>

            <span className="hstats__label">
              {label}
            </span>

          </li>
        ),
      )}
    </ul>
  )
}


/* ============================================================
   EXPLORE TILES
   ============================================================ */

type ImageTile = {
  n: string
  label: string
  to: string
  title: string
  desc: string
  img: string
  accent?: boolean
}

type IconTile = {
  n: string
  label: string
  to: string
  title: string
  desc: string
  Icon: typeof Stack
  accent?: boolean
}

type Tile = ImageTile | IconTile


const TILES: Tile[] = [

  /* ----------------------------------------------------------
     01 — PROJECTS
     ---------------------------------------------------------- */

  {
    n: '01',
    label: 'Projects',
    to: '/projects',
    title: 'My Projects',
    desc: 'Explore my software, web development, and technical projects.',
    img: '/placeholders/project-1.jpg',
  },

  /* ----------------------------------------------------------
     02 — SERVICES
     ---------------------------------------------------------- */

  {
    n: '02',
    label: 'Services',
    to: '/services',
    title: 'Development & Technical Services',
    desc: 'Web development, software solutions, and technical support.',
    Icon: Stack,
  },

  /* ----------------------------------------------------------
     03 — SHOWCASE
     ---------------------------------------------------------- */

  {
    n: '03',
    label: 'Showcase',
    to: '/showcase',
    title: 'Featured Work',
    desc: 'Selected work, experiments, and creative builds.',
    Icon: Coffee,
    accent: true,
  },

  /* ----------------------------------------------------------
     04 — TESTIMONIALS
     ---------------------------------------------------------- */

  {
    n: '04',
    label: 'Testimonials',
    to: '/testimonials',
    title: 'What Clients Say',
    desc: 'Feedback and experiences from projects and collaborations.',
    img: '/placeholders/client2.jpg',
  },

  /* ----------------------------------------------------------
     05 — ABOUT
     ---------------------------------------------------------- */

  {
    n: '05',
    label: 'About',
    to: '/about',
    title: `Hi, I'm ${profile.firstName}.`,
    desc: 'Learn more about my background, skills, and technology journey.',
    img: profile.avatarSrc,
  },
]


/* ============================================================
   HOME EXPLORE
   ============================================================ */

export function HomeExplore() {
  return (
    <>
      {/* ======================================================
          EXPLORE HEADER
          ====================================================== */}

      <div className="hsec">
        <h2 className="hsec__title">
          Explore
        </h2>
      </div>


      {/* ======================================================
          EXPLORE TILES
          ====================================================== */}

      <ul
        className="htiles"
        role="list"
      >

        {TILES.map((tile) => {

          const isImageTile =
            'img' in tile

          const isIconTile =
            'Icon' in tile

          return (
            <li
              key={tile.to}
            >

              <Link
                to={tile.to}
                className={[
                  'htile',
                  tile.accent
                    ? 'htile--accent'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >

                {/* ------------------------------------------------
                    IMAGE TILE
                    ------------------------------------------------ */}

                {isImageTile ? (
                  <span className="htile__media">

                    <SafeImage
                      className="htile__img"
                      src={tile.img}
                      alt=""
                      loading="lazy"
                    />

                  </span>
                ) : null}


                {/* ------------------------------------------------
                    ICON TILE
                    ------------------------------------------------ */}

                {isIconTile ? (
                  <span className="htile__media htile__glyph">

                    <tile.Icon
                      size={52}
                      weight="duotone"
                      aria-hidden="true"
                    />

                  </span>
                ) : null}


                {/* ------------------------------------------------
                    TILE CONTENT
                    ------------------------------------------------ */}

                <span className="htile__body">

                  <span className="htile__n">
                    {tile.n}{' '}
                    {tile.label}
                  </span>

                  <span className="htile__title">
                    {tile.title}
                  </span>

                  <span className="htile__desc">
                    {tile.desc}
                  </span>

                </span>

              </Link>

            </li>
          )
        })}

      </ul>


      {/* ======================================================
          TESTIMONIAL HEADER
          ====================================================== */}

      <div className="hsec">

        <h2 className="hsec__title">

          <Link
            to="/testimonials"
            className="hsec__link"
          >

            What clients say

            <CaretRight
              size={16}
              weight="bold"
              aria-hidden="true"
            />

          </Link>

        </h2>

      </div>


      {/* ======================================================
          TESTIMONIAL FEATURE
          ====================================================== */}

      <Link
        to="/testimonials"
        className="hproof"
        aria-label="View client testimonials"
      >

        {/* ----------------------------------------------------
            VIDEO / IMAGE STAGE
            ---------------------------------------------------- */}

        <span className="hproof__stage">

          <SafeImage
            src="/placeholders/client2.jpg"
            alt=""
            loading="lazy"
          />

          {/* Play button */}
          <span
            className="hproof__play"
            aria-hidden="true"
          >
            <Play
              size={20}
              weight="fill"
            />
          </span>

          {/* Duration */}
          <span
            className="hproof__dur"
            aria-hidden="true"
          >
            0:00
          </span>

        </span>


        {/* ----------------------------------------------------
            TESTIMONIAL COPY
            ---------------------------------------------------- */}

        <span className="hproof__copy">

          <span className="hproof__title">
            Client testimonials and feedback from completed projects.
          </span>

          <span className="hproof__meta">
            Client feedback
          </span>

        </span>

      </Link>

    </>
  )
}