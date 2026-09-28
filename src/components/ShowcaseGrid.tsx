import Flagship from '@/components/Flagship'
import { ArrowUpRight } from '@/components/slab'

/**
 * ============================================================
 * FEATURED / FLAGSHIP PROJECT
 * ============================================================
 *
 * Palitan lamang ang URL na ito kung ibang project ang gusto
 * mong gawing main / flagship project.
 *
 * Current:
 * Smart Mirror
 */
const FEATURED_PROJECT = {
  name: 'Portfolio',
  description:
    'An interactive smart display project that combines a modern interface with connected hardware and web-based controls.',
  url: 'https://updateport-seven.vercel.app/',
  image: '/placeholders/profile.png',
  imageAlt: 'My Portfolio',
}


/**
 * ============================================================
 * SHOWCASE GRID
 * ============================================================
 *
 * The /showcase view.
 *
 * Contains:
 * - Showcase heading
 * - Featured project card
 * - Flagship project section
 * - External live-project link
 */
export default function ShowcaseGrid() {
  return (
    <section
      className="pgrid ktools"
      aria-labelledby="showcase-title"
    >

      {/* ======================================================
          PAGE HEADER
          ====================================================== */}

      <header className="pgrid__head ktools__head">

        <div className="ktools__head-copy">

          <span className="pgrid__eyebrow">
            Showcase
          </span>

          <h1
            className="pgrid__title"
            id="showcase-title"
          >
            Featured projects and real-world builds.
          </h1>

          <p className="pgrid__lede">
            Explore selected projects, applications, and
            interactive builds created for practical digital
            experiences.
          </p>

        </div>


        {/* ====================================================
            FEATURED PROJECT
            ==================================================== */}

        <div className="ktools__vote">

          <p className="ktools__vote-label">
            Featured project

            <span
              aria-hidden="true"
              className="ktools__vote-dot"
            />

            <span className="ktools__vote-ask">
              Live
            </span>
          </p>


          <a
            className="ktools__vote-frame ktools__vote-card"
            href={FEATURED_PROJECT.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${FEATURED_PROJECT.name} live project`}
          >

            {/* Project image / badge */}

            <img
              src={FEATURED_PROJECT.image}
              alt={FEATURED_PROJECT.imageAlt}
              width="48"
              height="48"
              loading="lazy"
              decoding="async"
            />


            {/* Project information */}

            <span className="ktools__vote-text">

              <strong>
                {FEATURED_PROJECT.name}
              </strong>

              <span>
                Open live project
              </span>

            </span>


            {/* External link icon */}

            <ArrowUpRight
              size={18}
              weight="bold"
              aria-hidden="true"
            />

          </a>

        </div>

      </header>


      {/* ======================================================
          MAIN SHOWCASE
          ====================================================== */}

      <div className="home__glass ktools__glass">

        <Flagship
          eyebrow="Flagship build"
        />

      </div>


      {/* ======================================================
          LIVE PROJECT CTA
          ====================================================== */}

      <div className="ktools__cta">

        <div className="ktools__cta-copy">

          <span className="ktools__cta-label">
            Live Project
          </span>

          <h2 className="ktools__cta-title">
            Try {FEATURED_PROJECT.name}
          </h2>

          <p className="ktools__cta-desc">
            Open the live version of this project in a new
            browser tab and explore the interface yourself.
          </p>

        </div>


        <a
          className="ktools__cta-link"
          href={FEATURED_PROJECT.url}
          target="_blank"
          rel="noopener noreferrer"
        >

          Open Live Project

          <ArrowUpRight
            size={18}
            weight="bold"
            aria-hidden="true"
          />

        </a>

      </div>

    </section>
  )
}