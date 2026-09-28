import { useState } from 'react'

import {
  Play,
  Gauge,
  Robot,
  Code,
} from '@/components/slab'

import type { Icon } from '@/components/slab'

/**
 * ============================================================
 * TESTIMONIALS GRID
 * ============================================================
 *
 * LEFT
 * - Client testimonial videos
 * - Poster image
 * - Play button
 * - Video selector
 *
 * RIGHT
 * - Client list
 * - Client image
 * - Role
 * - Daily work description
 * - Work tags
 */


/* ============================================================
   TYPES
   ============================================================ */

type Clip = {
  id: string
  index: string
  src: string
  poster: string
  duration: string
  kicker: string
  width: number
  height: number
}


/* ============================================================
   TESTIMONIAL VIDEOS
   ============================================================ */

const CLIPS: Clip[] = [
  {
    id: 'clip-1',
    index: '01',

    src: '/testimonials/client-1.mp4',

    poster: '/placeholders/client2.jpg',

    duration: '0:00',

    kicker: 'Client testimonial',

    width: 720,
    height: 1080,
  },

  {
    id: 'clip-2',
    index: '02',

    src: '/testimonials/client-2.mp4',

    poster: '/placeholders/client3.jpg',

    duration: '0:00',

    kicker: 'Client testimonial',

    width: 720,
    height: 1080,
  },
]


/* ============================================================
   CLIENT TYPES
   ============================================================ */

type Client = {
  index: string
  name: string
  role: string
  daily: string
  work: string[]
  logoSrc?: string
  Icon: Icon
}


/* ============================================================
   CLIENT DATA
   ============================================================ */

const CLIENTS: Client[] = [
  {
    index: '01',

    name: 'Keyl Forks',

    role: 'Client',

    daily:
      'Website development, technical support, and digital improvements focused on making the client’s online presence easier to manage and use.',

    work: [
      'Web Development',
      'Technical Support',
      'Digital Solutions',
    ],

    logoSrc:
      '/placeholders/client2.jpg',

    Icon: Gauge,
  },

  {
    index: '02',

    name: 'Mr. Mon Lu',

    role: 'Client',

    daily:
      'Support with website updates, digital tools, and practical technology solutions designed to simplify everyday online tasks and workflows.',

    work: [
      'Website Support',
      'Automation',
      'Tech Support',
    ],

    logoSrc:
      '/placeholders/client3.jpg',

    Icon: Robot,
  },

  {
    index: '03',

    name: 'Ramon Melchor',

    role: 'Client',

    daily:
      'Development and technical assistance for digital projects, including website improvements, troubleshooting, and implementation of new features.',

    work: [
      'Software Development',
      'Web Development',
      'IT Support',
    ],

    logoSrc:
      '/placeholders/client4.jpg',

    Icon: Code,
  },
]


/* ============================================================
   SAFE IMAGE
   ============================================================ */

function SafeImage({
  src,
  alt,
  className,
  loading = 'lazy',
}: {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={(event) => {
        event.currentTarget.style.display = 'none'
      }}
    />
  )
}


/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function TestimonialsGrid() {
  const [active, setActive] = useState(0)

  const [playing, setPlaying] = useState(false)

  const clip = CLIPS[active]

  const hasVideo = Boolean(clip?.src)


  /* ==========================================================
     SELECT TESTIMONIAL
     ========================================================== */

  const pick = (index: number) => {
    setActive(index)

    // Stop the currently playing video
    setPlaying(false)
  }


  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <section
      className="pgrid tgrid"
      aria-labelledby="testimonials-title"
    >

      {/* ======================================================
          HEADER
          ====================================================== */}

      <header className="pgrid__head">

        <span className="pgrid__eyebrow">
          Testimonials
        </span>

        <h1
          className="pgrid__title"
          id="testimonials-title"
        >
          Client Testimonials
        </h1>

        <p className="pgrid__lede">
          A look at the people, projects, and
          digital solutions I have worked on.
        </p>

      </header>


      {/* ======================================================
          MAIN GLASS PANEL
          ====================================================== */}

      <div className="home__glass tgrid__glass">


        {/* ====================================================
            LEFT — VIDEO TESTIMONIAL
            ==================================================== */}

        <div className="tgrid__reel">

          {/* --------------------------------------------------
              VIDEO STAGE
              -------------------------------------------------- */}

          <div className="tgrid__stage">

            {playing && hasVideo ? (

              <video
                key={clip.id}
                className="tgrid__video"
                src={clip.src}
                poster={clip.poster}
                width={clip.width}
                height={clip.height}
                controls
                autoPlay
                playsInline
                preload="metadata"
                aria-label={
                  `Video testimonial ${clip.index}`
                }
                onEnded={() => {
                  setPlaying(false)
                }}
              />

            ) : (

              <button
                type="button"
                className="tgrid__cover"

                onClick={() => {
                  if (hasVideo) {
                    setPlaying(true)
                  }
                }}

                disabled={!hasVideo}

                aria-label={
                  hasVideo
                    ? `Play client testimonial ${clip.index}`
                    : `Video testimonial ${clip.index} is unavailable`
                }
              >

                {/* Poster */}

                <SafeImage
                  key={clip.id}
                  className="tgrid__cover-img"
                  src={clip.poster}
                  alt=""
                  loading="eager"
                />


                {/* Dark overlay */}

                <span
                  className="tgrid__cover-shade"
                  aria-hidden="true"
                />


                {/* Play button */}

                {hasVideo && (
                  <span
                    className="tgrid__cover-play"
                    aria-hidden="true"
                  >
                    <Play
                      size={26}
                      weight="fill"
                    />
                  </span>
                )}


                {/* Video information */}

                <span
                  className="tgrid__cover-meta"
                  aria-hidden="true"
                >

                  <span className="tgrid__cover-kicker">
                    {clip.kicker} {clip.index}
                  </span>

                  <span className="tgrid__cover-sub">
                    {hasVideo
                      ? `${clip.duration} · Tap to play`
                      : 'Video not available'}
                  </span>

                </span>

              </button>
            )}

          </div>


          {/* ==================================================
              VIDEO SELECTOR
              ================================================== */}

          <div
            className="tgrid__picker"
            role="group"
            aria-label="Choose a testimonial"
          >

            {CLIPS.map((item, index) => (

              <button
                key={item.id}
                type="button"

                className={[
                  'tgrid__pick',
                  index === active
                    ? 'is-active'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}

                onClick={() => pick(index)}

                aria-pressed={
                  index === active
                }
              >

                {/* Thumbnail */}

                <span
                  className="tgrid__pick-thumb"
                  aria-hidden="true"
                >
                  <SafeImage
                    src={item.poster}
                    alt=""
                    loading="lazy"
                  />
                </span>


                {/* Video information */}

                <span className="tgrid__pick-copy">

                  <span className="tgrid__pick-kicker">
                    Testimonial {item.index}
                  </span>

                  <span className="tgrid__pick-meta">
                    {item.duration}
                  </span>

                </span>

              </button>

            ))}

          </div>

        </div>


        {/* ====================================================
            RIGHT — CLIENT LEDGER
            ==================================================== */}

        <div className="tgrid__ledger">

          {/* --------------------------------------------------
              LEDGER HEADER
              -------------------------------------------------- */}

          <div className="tgrid__ledger-head">

            <h2 className="tgrid__ledger-title">
              Clients & Collaborations
            </h2>

            <p className="tgrid__ledger-sub">
              People and projects I have supported
              through technology and digital solutions.
            </p>

          </div>


          {/* --------------------------------------------------
              CLIENT LIST
              -------------------------------------------------- */}

          <ul
            className="tgrid__clients"
            role="list"
          >

            {CLIENTS.map((client) => {

              const FallbackIcon = client.Icon

              return (
                <li
                  key={client.index}
                  className="tgrid__client"
                >

                  {/* Large number */}

                  <span
                    className="tgrid__client-ghost"
                    aria-hidden="true"
                  >
                    {client.index}
                  </span>


                  {/* Client image */}

                  <span
                    className="tgrid__client-mark"
                    aria-hidden="true"
                  >

                    {client.logoSrc ? (

                      <SafeImage
                        src={client.logoSrc}
                        alt=""
                        loading="lazy"
                      />

                    ) : (

                      <FallbackIcon
                        size={22}
                        weight="duotone"
                      />

                    )}

                  </span>


                  {/* Client information */}

                  <span className="tgrid__client-body">

                    {/* Name + role */}

                    <span className="tgrid__client-head">

                      <span className="tgrid__client-name">
                        {client.name}
                      </span>

                      <span className="tgrid__client-role">
                        {client.role}
                      </span>

                    </span>


                    {/* Daily work */}

                    <span className="tgrid__client-daily">
                      {client.daily}
                    </span>


                    {/* Tags */}

                    <ul
                      className="tgrid__client-tags"
                      role="list"
                    >

                      {client.work.map(
                        (work, index) => (

                          <li
                            key={`${work}-${index}`}
                            className="tgrid__client-tag"
                          >
                            {work}
                          </li>

                        ),
                      )}

                    </ul>

                  </span>

                </li>
              )
            })}

          </ul>

        </div>

      </div>

    </section>
  )
}