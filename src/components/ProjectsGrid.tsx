import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react'

import { createPortal } from 'react-dom'

import {
  ArrowUpRight,
  X,
  Ticket,
  Robot,
  FlowArrow,
  CursorClick,
} from '@/components/slab'

import {
  FlowIcon,
  PlanIcon,
  GlobeIcon,
  SparkIcon,
  DeviceIcon,
} from './ProjectIcons'

import {
  AutomationsPanel,
  PlanPanel,
  TicketingPanel,
  FrameworkPanel,
  WorkflowPanel,
  BarrelPanel,
  AIWindow,
  AppsWindow,
} from './ProjectPanels'

import {
  gymFunnel,
  bookingFunnel,
  websiteFunnel,
  type Funnel,
} from '@/data/funnels'

import { mobileApps } from '@/data/projects'
import { aiStack, type StackNode } from '@/data/ai-stack'
import { useIsPhone } from '@/hooks/useMediaQuery'


/* ============================================================
   PROJECT TYPE
   ============================================================ */

type Project = {
  id: string
  index: string
  title: string
  desc: string
  Icon: ComponentType<{ size?: number }>
  eyebrow: string
  Section: ComponentType
  span?: 2
  kicker?: string
  logos?: string[]
  Preview: ComponentType
  cat: Cat
}


/* ============================================================
   FILTER
   ============================================================ */

type Cat = 'work' | 'sites' | 'apps' | 'ai'

const FILTERS: {
  key: Cat | 'all'
  label: string
}[] = [
  {
    key: 'all',
    label: 'All',
  },
  {
    key: 'work',
    label: 'Work',
  },
  {
    key: 'sites',
    label: 'Sites',
  },
  {
    key: 'apps',
    label: 'Apps',
  },
  {
    key: 'ai',
    label: 'AI',
  },
]


/* ============================================================
   TOOL LOGOS
   ============================================================ */

const GHL = '/icons/gohighlevel.png'

const CLAUDE_CODE =
  '/icons/claude-code-logo.png'

const CODEX =
  '/icons/ai/codex.svg'

const HERMES =
  '/icons/ai/hermes.svg'

const PLAY =
  '/icons/ai/googleplay.svg'

const CHROME =
  '/icons/ai/googlechrome.svg'

const EXPO =
  '/icons/ai/expo.svg'


/* ============================================================
   WORKFLOW SCREENSHOTS
   ============================================================ */

const WF_SHOTS = [
  'project-1.jpg',
  'project-2.jpg',
  'project-3.jpg',
  'project-4.jpg',
].map(
  (file) => `/placeholders/${file}`,
)


/* ============================================================
   FUNNEL SCREENSHOTS
   ============================================================ */

const FUNNEL_SHOTS = [
  gymFunnel[0],
  bookingFunnel[0],
  websiteFunnel[0],
].filter(Boolean)


const thumbSrc = (f: Funnel) =>
  `/${f.dir ?? 'funnels'}/thumbs/${f.file.replace(
    '.html',
    '.jpeg',
  )}`


/* ============================================================
   APP SCREENSHOTS
   ============================================================ */

const APP_SHOTS = [
  ...mobileApps
    .map((app) => app.imageSrc)
    .filter(
      (src): src is string =>
        Boolean(src),
    ),

  '/placeholders/extension-1.jpg',

  '/placeholders/extension-2.jpg',
]


/* ============================================================
   LIVE PROJECT LINKS
   ============================================================ */

/**
 * These are your actual live Vercel projects.
 *
 * They open in a new browser tab so visitors can directly
 * use / view the deployed projects.
 */

type LiveProject = {
  name: string
  url: string
  description: string
}


const LIVE_PROJECTS: LiveProject[] = [
  {
    name: 'Clock Project',
    url: 'https://clock-7mq4.vercel.app/',
    description:
      'Live clock web application.',
  },

  {
    name: 'Clock Project II',
    url: 'https://clock-rho-ruby.vercel.app/',
    description:
      'Another live clock application.',
  },

  {
    name: 'Chair Project',
    url: 'https://chair-psi.vercel.app/',
    description:
      'Interactive chair web project.',
  },

  {
    name: 'Bike Project',
    url: 'https://bike-five-pi.vercel.app/',
    description:
      'Interactive bike web project.',
  },

  {
    name: 'ID Card Project',
    url: 'https://id-card-sable-eight.vercel.app/',
    description:
      'Live ID card web application.',
  },
]


/* ============================================================
   PLACEHOLDER BUILD DESCRIPTION
   ============================================================ */

const BUILD_DESC =
  'Featured project and workflow built as part of my software, automation, and AI development work.'


/* ============================================================
   FEATURED BUILDS
   ============================================================ */

const BUILDS: Project[] = [
  {
    id: 'ticketing',
    cat: 'work',
    index: '03',
    kicker: 'Featured build',
    title: 'Ticketing System',
    desc: BUILD_DESC,
    Icon: () => (
      <Ticket
        size={20}
        weight="duotone"
      />
    ),
    logos: [GHL],
    eyebrow: 'Featured build',
    Section: TicketingPanel,
    Preview: () => null,
  },

  {
    id: 'framework',
    cat: 'ai',
    index: '04',
    kicker: 'AI development',
    title: 'AI Framework',
    desc: BUILD_DESC,
    Icon: () => (
      <Robot
        size={20}
        weight="duotone"
      />
    ),
    logos: [CLAUDE_CODE],
    eyebrow: 'Featured build',
    Section: FrameworkPanel,
    Preview: () => null,
  },

  {
    id: 'workflow',
    cat: 'ai',
    index: '05',
    kicker: 'Automation workflow',
    title: 'AI Workflow',
    desc: BUILD_DESC,
    Icon: () => (
      <FlowArrow
        size={20}
        weight="duotone"
      />
    ),
    logos: [
      CLAUDE_CODE,
      CODEX,
      HERMES,
    ],
    eyebrow: 'Featured build',
    Section: WorkflowPanel,
    Preview: () => null,
  },
]


/* ============================================================
   AI STACK
   ============================================================ */

const leaves = (
  node: StackNode,
): StackNode[] =>
  node.children?.length
    ? node.children.flatMap(leaves)
    : [node]


const AI_LEAVES = leaves(aiStack)


/* ============================================================
   PREVIEW — WORKFLOWS
   ============================================================ */

function WorkflowsPreview() {
  return (
    <div
      className="bento__media bento__reel"
      aria-hidden="true"
    >
      <div className="bento__reel-track">
        {[
          ...WF_SHOTS,
          ...WF_SHOTS,
        ].map((src, index) => (
          <span
            key={index}
            className="bento__shot"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </span>
        ))}
      </div>
    </div>
  )
}


/* ============================================================
   PREVIEW — PLAN
   ============================================================ */

function PlanPreview() {
  return (
    <div
      className="bento__media bento__doc"
      aria-hidden="true"
    >
      <span className="bento__doc-eyebrow">
        Project document
      </span>

      <span className="bento__doc-title">
        Project documentation
      </span>

      <span className="bento__doc-flow">
        <i>Plan</i>
        <i>Build</i>
        <i>Test</i>
        <i className="is-on">
          Result
        </i>
      </span>

      <span className="bento__doc-line" />

      <span className="bento__doc-line bento__doc-line--short" />
    </div>
  )
}


/* ============================================================
   PREVIEW — FUNNELS
   ============================================================ */

function FunnelsPreview() {
  return (
    <div
      className="bento__media bento__fan"
      aria-hidden="true"
    >
      {FUNNEL_SHOTS.map(
        (f, index) => (
          <span
            key={f.file}
            className="bento__photo bento__photo--page"
            style={
              {
                ['--i' as string]:
                  index,
              }
            }
          >
            <img
              src={thumbSrc(f)}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </span>
        ),
      )}
    </div>
  )
}


/* ============================================================
   PREVIEW — AI
   ============================================================ */

function AIPreview() {
  const half = Math.ceil(
    AI_LEAVES.length / 2,
  )

  const rows = [
    AI_LEAVES.slice(0, half),
    AI_LEAVES.slice(half),
  ]

  return (
    <div
      className="bento__media bento__chips"
      aria-hidden="true"
    >
      {rows.map(
        (row, rowIndex) => (
          <div
            key={rowIndex}
            className="bento__chip-row"
            data-dir={
              rowIndex
                ? 'right'
                : 'left'
            }
          >
            <div className="bento__chip-track">
              {[
                ...row,
                ...row,
              ].map(
                (node, index) => (
                  <span
                    key={`${node.id}-${index}`}
                    className="bento__chip"
                    data-status={
                      node.status
                    }
                  >
                    <node.Icon
                      size={15}
                      weight="duotone"
                    />

                    {node.name}
                  </span>
                ),
              )}
            </div>
          </div>
        ),
      )}
    </div>
  )
}


/* ============================================================
   PREVIEW — APPS
   ============================================================ */

function AppsPreview() {
  return (
    <div
      className="bento__media bento__reel bento__reel--row"
      aria-hidden="true"
    >
      <div className="bento__reel-track">
        {[
          ...APP_SHOTS,
          ...APP_SHOTS,
        ].map(
          (src, index) => (
            <span
              key={index}
              className="bento__shot bento__shot--app"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </span>
          ),
        )}
      </div>
    </div>
  )
}


/* ============================================================
   LIVE PROJECT LINKS UI
   ============================================================ */

function LiveProjectsLinks() {
  const openProject = (
    url: string,
  ) => {
    window.open(
      url,
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <div
      className="bento__live-projects"
      aria-label="Live projects"
    >
      <div className="bento__live-projects-head">
        <span>
          Live projects
        </span>

        <span>
          {LIVE_PROJECTS.length}
        </span>
      </div>

      <div className="bento__live-projects-list">
        {LIVE_PROJECTS.map(
          (project, index) => (
            <button
              key={project.url}
              type="button"
              className="bento__live-project"
              onClick={(event) => {
                event.stopPropagation()
                openProject(
                  project.url,
                )
              }}
              title={
                project.description
              }
            >
              <span className="bento__live-project-index">
                {String(
                  index + 1,
                ).padStart(2, '0')}
              </span>

              <span className="bento__live-project-name">
                {project.name}
              </span>

              <ArrowUpRight
                size={14}
                weight="bold"
                aria-hidden="true"
              />
            </button>
          ),
        )}
      </div>
    </div>
  )
}


/* ============================================================
   PROJECTS
   ============================================================ */

const PROJECTS: Project[] = [
  {
    id: 'workflows',
    cat: 'work',
    index: '01',
    title: 'Automation Workflows',
    desc:
      'Workflow screens, automations, and digital processes.',
    Icon: FlowIcon,
    logos: [GHL],
    eyebrow: 'Screenshots',
    Section: AutomationsPanel,
    span: 2,
    Preview: WorkflowsPreview,
  },

  {
    id: 'plan',
    cat: 'work',
    index: '02',
    title: 'Project Documents',
    desc:
      'Planning documents and project workflows.',
    Icon: PlanIcon,
    logos: [GHL],
    eyebrow: 'Project document',
    Section: PlanPanel,
    Preview: PlanPreview,
  },

  {
    id: 'funnels',
    cat: 'sites',
    index: '06',
    title: 'Pages and Sites',
    desc:
      'Website pages, funnels, and web experiences.',
    Icon: GlobeIcon,
    logos: [GHL],
    eyebrow: 'Pages and sites',
    Section: BarrelPanel,
    Preview: FunnelsPreview,
  },

  {
    id: 'ai',
    cat: 'ai',
    index: '07',
    title: 'AI Systems',
    desc:
      'AI tools, automation systems, and development workflows.',
    Icon: SparkIcon,
    logos: [
      CLAUDE_CODE,
      CODEX,
      HERMES,
    ],
    eyebrow: 'AI systems',
    Section: AIWindow,
    Preview: AIPreview,
  },

  {
    id: 'apps',
    cat: 'apps',
    index: '08',
    title: 'Apps and Tools',
    desc:
      'Live applications, websites, utilities, and digital tools you can open and use.',
    Icon: DeviceIcon,
    logos: [
      PLAY,
      EXPO,
      CHROME,
    ],
    eyebrow: 'Your apps',
    Section: AppsWindow,
    span: 2,
    Preview: AppsPreview,
  },
]


/* ============================================================
   MARKS
   ============================================================ */

function Marks({
  p,
  size = 22,
}: {
  p: Project
  size?: number
}) {
  if (!p.logos?.length) {
    return (
      <span className="bento__icon">
        <p.Icon
          size={size}
        />
      </span>
    )
  }

  return (
    <span
      className="bento__logos"
      aria-hidden="true"
    >
      {p.logos.map(
        (src) => (
          <span
            key={src}
            className="bento__logo"
          >
            <img
              src={src}
              alt=""
              width={22}
              height={22}
              decoding="async"
            />
          </span>
        ),
      )}
    </span>
  )
}


/* ============================================================
   PROJECT MODAL
   ============================================================ */

function ProjectModal({
  project,
  onClose,
  children,
}: {
  project: Project
  onClose: () => void
  children: ReactNode
}) {
  const closeRef =
    useRef<HTMLButtonElement>(
      null,
    )

  useEffect(() => {
    const onKey = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        'Escape'
      ) {
        onClose()
      }
    }

    document.addEventListener(
      'keydown',
      onKey,
    )

    const previousOverflow =
      document.body.style
        .overflow

    document.body.style.overflow =
      'hidden'

    requestAnimationFrame(
      () => {
        closeRef.current?.focus()
      },
    )

    return () => {
      document.removeEventListener(
        'keydown',
        onKey,
      )

      document.body.style.overflow =
        previousOverflow
    }
  }, [onClose])

  return createPortal(
    <div
      className="pmodal"
      role="dialog"
      aria-modal="true"
      aria-label={
        project.title
      }
      onClick={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose()
        }
      }}
    >
      <button
        ref={closeRef}
        type="button"
        className="pmodal__close"
        onClick={onClose}
        aria-label="Close"
      >
        <X
          size={18}
          weight="bold"
        />
      </button>

      <div className="pmodal__stage">
        {children}
      </div>
    </div>,
    document.body,
  )
}


/* ============================================================
   PROJECT GRID
   ============================================================ */

export default function ProjectsGrid() {
  const [
    open,
    setOpen,
  ] = useState<Project | null>(
    null,
  )

  const phone =
    useIsPhone()

  const [
    cat,
    setCat,
  ] = useState<
    Cat | 'all'
  >('all')

  const keep = (
    project: Project,
  ) =>
    !phone ||
    cat === 'all' ||
    project.cat === cat

  const projects =
    PROJECTS.filter(keep)

  const builds =
    BUILDS.filter(keep)

  const triggerRef =
    useRef<HTMLElement | null>(
      null,
    )


  /* ==========================================================
     OPEN MODAL
     ========================================================== */

  const show = useCallback(
    (
      project: Project,
      element: HTMLElement,
    ) => {
      triggerRef.current =
        element

      setOpen(project)
    },
    [],
  )


  /* ==========================================================
     CLOSE MODAL
     ========================================================== */

  const close = useCallback(
    () => {
      setOpen(null)

      requestAnimationFrame(
        () => {
          triggerRef.current?.focus()
        },
      )
    },
    [],
  )


  /* ==========================================================
     FEATURED BUILD STACK
     ========================================================== */

  const stack =
    builds.length > 0 ? (
      <div className="bento__stack">
        {builds.map(
          (build) => (
            <button
              key={build.id}
              type="button"
              className="bento__card bento__card--btn bento__card--build"
              onClick={(event) =>
                show(
                  build,
                  event.currentTarget,
                )
              }
              aria-haspopup="dialog"
            >
              <span className="bento__build-plate">
                {build.logos?.length ? (
                  <img
                    src={
                      build.logos[0]
                    }
                    alt=""
                    width={22}
                    height={22}
                  />
                ) : (
                  <build.Icon />
                )}
              </span>

              <span className="bento__build-text">
                <span className="bento__kicker">
                  {build.kicker}
                </span>

                <span className="bento__build-title">
                  {build.title}
                </span>

                <span className="bento__build-desc">
                  {build.desc}
                </span>
              </span>

              <span className="bento__build-arrow">
                <ArrowUpRight
                  size={13}
                  weight="bold"
                  aria-hidden="true"
                />
              </span>
            </button>
          ),
        )}
      </div>
    ) : null


  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <section
      className="pgrid"
      aria-labelledby="projects-title"
    >

      {/* ======================================================
          HEADER
          ====================================================== */}

      <header className="pgrid__head">

        <span className="pgrid__eyebrow">
          Projects
        </span>

        <h1
          className="pgrid__title"
          id="projects-title"
        >
          Software, web apps, AI systems,
          and digital projects.
        </h1>

        <p className="pgrid__lede">
          Explore the projects below.
          Open a card to view the
          project details, or open a
          live project to use it
          directly.
        </p>

      </header>


      {/* ======================================================
          MOBILE FILTER
          ====================================================== */}

      {phone && (
        <div
          className="pfilter"
          role="group"
          aria-label="Filter projects"
        >
          {FILTERS.map(
            (filter) => (
              <button
                key={
                  filter.key
                }
                type="button"
                className="pfilter__btn"
                aria-pressed={
                  cat ===
                  filter.key
                }
                onClick={() =>
                  setCat(
                    filter.key,
                  )
                }
              >
                {filter.label}
              </button>
            ),
          )}
        </div>
      )}


      {/* ======================================================
          GLASS CONTAINER
          ====================================================== */}

      <div className="home__glass pgrid__glass">

        <span
          className="pgrid__hint"
          aria-hidden="true"
        >
          <CursorClick
            size={14}
            weight="duotone"
          />

          Click a card to open it
        </span>


        {/* ====================================================
            BENTO
            ==================================================== */}

        <div className="bento bento--projects">

          {projects.map(
            (project) => (
              <Fragment
                key={
                  project.id
                }
              >

                {/* ==========================================
                    PROJECT CARD
                    ========================================== */}

                <button
                  type="button"
                  className={`bento__card bento__card--btn${
                    project.span ===
                    2
                      ? ' bento__card--wide'
                      : ''
                  }`}
                  data-id={
                    project.id
                  }
                  onClick={(event) =>
                    show(
                      project,
                      event.currentTarget,
                    )
                  }
                  aria-haspopup="dialog"
                >

                  <span className="bento__head">

                    <Marks
                      p={project}
                    />

                    <span className="bento__title">
                      {
                        project.title
                      }
                    </span>

                    <span className="bento__desc">
                      {
                        project.desc
                      }
                    </span>

                    <ArrowUpRight
                      size={15}
                      weight="bold"
                      aria-hidden="true"
                      className="bento__arrow"
                    />

                  </span>


                  {/* ======================================
                      PREVIEW
                      ====================================== */}

                  <project.Preview />


                  {/* ======================================
                      LIVE LINKS INSIDE APPS CARD
                      ====================================== */}

                  {project.id ===
                    'apps' && (
                    <LiveProjectsLinks />
                  )}

                </button>


                {/* ==========================================
                    FEATURED STACK
                    ========================================== */}

                {project.id ===
                  'plan' &&
                  stack}

              </Fragment>
            ),
          )}


          {/* ==================================================
              STACK WHEN PLAN IS FILTERED OUT
              ================================================== */}

          {!projects.some(
            (project) =>
              project.id ===
              'plan',
          ) &&
            stack}

        </div>

      </div>


      {/* ======================================================
          PROJECT MODAL
          ====================================================== */}

      {open && (
        <ProjectModal
          project={open}
          onClose={close}
        >
          <open.Section />
        </ProjectModal>
      )}

    </section>
  )
}