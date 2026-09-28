import {
  Key,
  Browser,
  ArrowUpRight,
  type Icon,
} from '@/components/slab'

import {
  mobileApps,
  type AppProject,
} from '@/data/projects'

import AIStack from '@/components/AIStack'
import Flagship from '@/components/Flagship'


/* ============================================================
   LIVE PROJECT LINKS
   ============================================================ */

/*
 * These links are assigned by project order.
 *
 * Project #1 → Clock
 * Project #2 → Clock
 * Project #3 → Chair
 * Project #4 → Bike
 * Project #5 → ID Card
 *
 * If the order of your projects in mobileApps changes,
 * just move the URLs here to match the new order.
 */

const LIVE_PROJECTS = [
  'https://chair-psi.vercel.app/',
  'https://id-card-sable-eight.vercel.app/',
  'https://bike-five-pi.vercel.app/',
  
] as const


/* ============================================================
   BROWSER EXTENSIONS
   ============================================================ */

type Extension = {
  name: string
  desc: string
  imageSrc: string
  imageAlt: string
  Icon: Icon
  url?: string
}


/* ============================================================
   EXTENSION DATA
   ============================================================ */

const EXTENSIONS: Extension[] = [
  {
    name: 'Lamp',

    desc:
      'A lightweight browser tool designed to simplify everyday web tasks and improve productivity.',

    imageSrc:
      '/placeholders/extension-1.jpg',

    imageAlt:
      'Smart Web Assistant browser extension preview',

    Icon: Key,

    url: 'https://clock-7mq4.vercel.app/',
  },

  {
    name: 'Clock',

    desc:
      'A custom browser utility for accessing and managing web-based tools and digital workflows.',

    imageSrc:
      '/placeholders/extension-2.jpg',

    imageAlt:
      'Portfolio Web Tool browser extension preview',

    Icon: Browser,

    url: 'https://clock-rho-ruby.vercel.app/',
  },
]


/* ============================================================
   HELPERS
   ============================================================ */

/**
 * Open a live project in a new browser tab.
 */
function openExternal(url?: string) {
  if (!url) return

  window.open(
    url,
    '_blank',
    'noopener,noreferrer',
  )
}


/**
 * Get live URL based on project position.
 */
function getProjectUrl(index: number) {
  return LIVE_PROJECTS[index] ?? ''
}


/* ============================================================
   EXTENSION CARD
   ============================================================ */

function ExtensionCard({
  ext,
}: {
  ext: Extension
}) {
  const ExtIcon = ext.Icon

  const hasLink =
    Boolean(ext.url)

  return (
    <li className="ext-card">

      {/* ======================================================
          BROWSER WINDOW
          ====================================================== */}

      <div
        className={[
          'ext-card__window',
          hasLink
            ? 'ext-card__window--clickable'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >

        {/* Browser top bar */}

        <div
          className="ext-card__chrome"
          aria-hidden="true"
        >

          <span className="ext-card__dots">

            <span className="ext-card__dot" />
            <span className="ext-card__dot" />
            <span className="ext-card__dot" />

          </span>


          <span className="ext-card__urlbar">

            <ExtIcon
              size={12}
              weight="bold"
            />

            chrome-extension

          </span>

        </div>


        {/* Extension preview */}

        <div
          className="ext-card__stage"
          onClick={() => {
            if (ext.url) {
              openExternal(ext.url)
            }
          }}
          role={hasLink ? 'link' : undefined}
          tabIndex={hasLink ? 0 : undefined}
          onKeyDown={(event) => {

            if (
              hasLink &&
              (
                event.key === 'Enter' ||
                event.key === ' '
              )
            ) {
              event.preventDefault()
              openExternal(ext.url)
            }

          }}
        >

          <img
            className="ext-card__img"
            src={ext.imageSrc}
            alt={ext.imageAlt}
            loading="lazy"
            decoding="async"

            onError={(event) => {
              event.currentTarget.style.display =
                'none'
            }}
          />


          {/* Open icon */}

          {hasLink && (

            <span
              className="ext-card__open"
              aria-hidden="true"
            >

              <ArrowUpRight
                size={18}
                weight="bold"
              />

            </span>

          )}

        </div>

      </div>


      {/* ======================================================
          EXTENSION INFORMATION
          ====================================================== */}

      <div className="ext-card__body">

        <span className="ext-card__badge">

          <ExtIcon
            size={14}
            weight="bold"
            aria-hidden="true"
          />

          Browser Tool

        </span>


        <h4 className="ext-card__name">
          {ext.name}
        </h4>


        <p className="ext-card__desc">
          {ext.desc}
        </p>


        {/* Project button */}

        {hasLink ? (

          <a
            className="ext-card__link"
            href={ext.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >

            Open Project

            <ArrowUpRight
              size={15}
              weight="bold"
              aria-hidden="true"
            />

          </a>

        ) : (

          <span
            className={[
              'ext-card__link',
              'ext-card__link--disabled',
            ].join(' ')}
          >
            Demo coming soon
          </span>

        )}

      </div>

    </li>
  )
}


/* ============================================================
   APP CARD
   ============================================================ */

function AppCard({
  app,
  index,
}: {
  app: AppProject
  index: number
}) {

  /*
   * Get the live URL based on the app's position
   * inside mobileApps.
   */
  const url =
    getProjectUrl(index)

  const hasLink =
    Boolean(url)


  return (
    <li
      className={[
        'app-card',
        hasLink
          ? 'app-card--clickable'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        ['--app-color' as string]:
          app.accentColor,
      }}
    >

      {/* ======================================================
          APP IMAGE
          ====================================================== */}

      <div
        className="app-card__img-wrap"

        onClick={() => {
          if (url) {
            openExternal(url)
          }
        }}

        role={hasLink ? 'link' : undefined}

        tabIndex={
          hasLink
            ? 0
            : undefined
        }

        onKeyDown={(event) => {

          if (
            hasLink &&
            (
              event.key === 'Enter' ||
              event.key === ' '
            )
          ) {
            event.preventDefault()
            openExternal(url)
          }

        }}
      >

        {app.imageSrc ? (

          <img
            className="app-card__img"
            src={app.imageSrc}
            alt={`${app.name} screenshot`}
            loading="lazy"
            decoding="async"

            onError={(event) => {
              event.currentTarget.style.display =
                'none'
            }}
          />

        ) : (

          <div
            className="app-card__img-placeholder"
            aria-hidden="true"
          >

            <span className="app-card__img-initials">

              {app.name
                .split(' ')
                .map(
                  (word) =>
                    word[0],
                )
                .join('')
                .slice(0, 2)}

            </span>

          </div>

        )}


        {/* App badge */}

        <span className="app-card__badge">
          {app.badge}
        </span>


        {/* Image fade */}

        <span
          className="app-card__img-fade"
          aria-hidden="true"
        />


        {/* Open icon */}

        {hasLink && (

          <span
            className="app-card__open"
            aria-hidden="true"
          >

            <ArrowUpRight
              size={20}
              weight="bold"
            />

          </span>

        )}

      </div>


      {/* ======================================================
          APP INFORMATION
          ====================================================== */}

      <div className="app-card__body">

        <div className="app-card__title-row">

          <h3 className="app-card__name">
            {app.name}
          </h3>


          {hasLink && (

            <span
              className="app-card__live"
              aria-label="Live project"
            >
              Live
            </span>

          )}

        </div>


        <p className="app-card__tagline">
          {app.tagline}
        </p>


        <p className="app-card__desc">
          {app.description}
        </p>


        {/* ==================================================
            APP STATS
            ================================================== */}

        <ul
          className="app-card__stats"
          role="list"
        >

          {app.stats.map(
            (stat) => (

              <li
                key={stat.label}
                className="app-card__stat"
              >

                <span className="app-card__stat-value">
                  {stat.value}
                </span>

                <span className="app-card__stat-label">
                  {stat.label}
                </span>

              </li>

            ),
          )}

        </ul>


        {/* ==================================================
            LIVE PROJECT BUTTON
            ================================================== */}

        {hasLink ? (

          <a
            className="app-card__link"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >

            View Live Project

            <ArrowUpRight
              size={16}
              weight="bold"
              aria-hidden="true"
            />

          </a>

        ) : (

          <span
            className={[
              'app-card__link',
              'app-card__link--disabled',
            ].join(' ')}
          >
            Project link coming soon
          </span>

        )}

      </div>

    </li>
  )
}


/* ============================================================
   AI STACK SECTION
   ============================================================ */

export function AIStackSection() {

  return (
    <section
      className="projects projects--ai"
      id="projects"
      aria-labelledby="projects-heading"
      data-reveal
    >

      {/* ======================================================
          HEADER
          ====================================================== */}

      <header className="projects__header">

        <span className="projects__eyebrow">
          AI & Automation
        </span>


        <h2
          className="projects__headline"
          id="projects-heading"
        >
          AI-powered systems and workflows.
        </h2>


        <p className="projects__subhead">
          Explore the tools, automation workflows,
          software, and AI systems used across my
          projects.
        </p>

      </header>


      {/* ======================================================
          AI STACK
          ====================================================== */}

      <div
        className="projects__panel"
        id="projects-panel"
      >

        <AIStack />

      </div>

    </section>
  )
}


/* ============================================================
   APPS SECTION
   ============================================================ */

export function AppsSection() {

  return (
    <section
      className="projects projects--apps"
      aria-label="Apps and browser tools"
      data-reveal
    >

      <div className="projects__panel">


        {/* ====================================================
            APPS HEADER
            ==================================================== */}

        <header className="projects__apps-head">

          <span className="projects__ext-eyebrow">
            Apps & Tools
          </span>


          <h2 className="projects__apps-title">
            Digital tools and applications.
          </h2>


          <p className="projects__apps-desc">
            Explore live applications, websites,
            utilities, and digital tools that you
            can open and use.
          </p>

        </header>


        {/* ====================================================
            WEB / MOBILE APPS
            ==================================================== */}

        <ul
          className="projects__apps"
          role="list"
        >

          {mobileApps.map(
            (app, index) => (

              <AppCard
                key={`${app.name}-${index}`}
                app={app}
                index={index}
              />

            ),
          )}

        </ul>


        {/* ====================================================
            BROWSER EXTENSIONS
            ==================================================== */}

        <div className="projects__ext">

          <header className="projects__ext-head">

            <span className="projects__ext-eyebrow">
              Browser Tools
            </span>


            <h3 className="projects__ext-title">
              Browser extensions and utilities.
            </h3>


            <p className="projects__ext-desc">
              Open the available tools and explore
              how they work.
            </p>

          </header>


          {/* Extension cards */}

          <ul
            className="ext-grid"
            role="list"
          >

            {EXTENSIONS.map(
              (ext) => (

                <ExtensionCard
                  key={ext.name}
                  ext={ext}
                />

              ),
            )}

          </ul>

        </div>

      </div>

    </section>
  )
}


/* ============================================================
   PROJECTS PAGE
   ============================================================ */

export default function Projects() {

  return (
    <>

      {/* AI systems */}

      <AIStackSection />


      {/* Apps + browser tools */}

      <AppsSection />


      {/* Flagship project */}

      <Flagship />

    </>
  )
}