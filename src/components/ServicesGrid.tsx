import type { CSSProperties } from 'react'
import { MagnetStraight, Timer, Trophy, CheckCircle } from '@/components/slab'
import type { Icon } from '@/components/slab'
import Autopilot, { TOOLS } from '@/components/Autopilot'

/**
 * ServicesGrid
 *
 * Services section for the Marden portfolio.
 * Structure:
 * 01. Three-step development method
 * 02. Five service cards
 * 03. Live automation workflow
 */

/* =========================================================
   METHOD / PROCESS
   ========================================================= */

type Stage = {
  index: string
  label: string
  body: string
  Icon: Icon
  chips: string[]
}

const STAGES: Stage[] = [
  {
    index: '01',
    label: 'Discover',
    body: 'We define the goal, requirements, features, and technical direction before development starts.',
    Icon: MagnetStraight,
    chips: ['Requirements', 'Planning', 'Strategy', 'Scope'],
  },
  {
    index: '02',
    label: 'Build',
    body: 'The website, application, automation, or system is developed with a clean and responsive experience.',
    Icon: Timer,
    chips: ['Development', 'UI / UX', 'Testing'],
  },
  {
    index: '03',
    label: 'Launch',
    body: 'The finished project is tested, deployed, documented, and prepared for continued use.',
    Icon: Trophy,
    chips: ['Deployment', 'Optimization', 'Support'],
  },
]

/* =========================================================
   SERVICE TOOLS / LOGOS
   ========================================================= */

const GHL = '/icons/gohighlevel.png'
const REACT = '/icons/ai/react.svg'
const TAILWIND = '/icons/ai/tailwindcss.svg'
const VITE = '/icons/ai/vite.svg'
const CLOUDFLARE = '/icons/ai/cloudflare.svg'
const N8N = '/icons/ai/n8n.svg'
const OPENAI = '/icons/openai.svg'
const GWS = '/icons/googleworkspace.svg'
const SLACK = '/icons/slack.svg'
const CLAUDE_CODE = '/icons/claude-code-logo.png'
const EXPO = '/icons/ai/expo.svg'
const CHROME = '/icons/ai/googlechrome.svg'

type Service = {
  index: string
  title: string
  description: string
  chip: string
  logos: string[]
  bullets: string[]
}

const SERVICES: Service[] = [
  {
    index: '01',
    title: 'Website Development',
    description:
      'Modern responsive websites for personal brands, businesses, schools, portfolios, and organizations.',
    chip: 'Web Development',
    logos: [REACT, TAILWIND, VITE],
    bullets: [
      'Responsive desktop and mobile layouts',
      'Modern UI with clean interactions',
      'Deployment and basic optimization',
    ],
  },
  {
    index: '02',
    title: 'AI & Automation',
    description:
      'AI-powered workflows and automations that reduce repetitive tasks and connect the tools you already use.',
    chip: 'AI / Automation',
    logos: [N8N, OPENAI, GHL],
    bullets: [
      'Workflow automation',
      'AI-assisted processes',
      'API and service integrations',
    ],
  },
  {
    index: '03',
    title: 'Business Systems',
    description:
      'Custom web-based systems designed to organize records, users, workflows, and everyday business operations.',
    chip: 'Custom Systems',
    logos: [GHL, GWS, SLACK],
    bullets: [
      'Admin and dashboard interfaces',
      'Forms and data workflows',
      'System-focused user experience',
    ],
  },
  {
    index: '04',
    title: 'Frontend & UI Development',
    description:
      'Fast and polished frontend interfaces built with modern development tools and reusable components.',
    chip: 'Frontend',
    logos: [REACT, VITE, CLOUDFLARE],
    bullets: [
      'Component-based development',
      'Responsive layouts',
      'Performance-conscious frontend',
    ],
  },
  {
    index: '05',
    title: 'Tech & App Solutions',
    description:
      'Technical solutions for web apps, prototypes, mobile experiences, integrations, and digital projects.',
    chip: 'Technical Solutions',
    logos: [CLAUDE_CODE, EXPO, CHROME],
    bullets: [
      'Prototype and MVP development',
      'Technical troubleshooting',
      'Integration and deployment support',
    ],
  },
]

/* =========================================================
   TOOL MARKS
   ========================================================= */

function Marks({ logos }: { logos: string[] }) {
  return (
    <span className="bento__logos" aria-hidden="true">
      {logos.map((src, index) => (
        <span
          key={`${src}-${index}`}
          className="bento__logo"
        >
          <img
            src={src}
            alt=""
            width={22}
            height={22}
            loading="lazy"
            decoding="async"
          />
        </span>
      ))}
    </span>
  )
}

/* =========================================================
   PAGE
   ========================================================= */

export default function ServicesGrid() {
  return (
    <section
      className="pgrid sgrid"
      aria-labelledby="services-title"
    >
      {/* =====================================================
          HEADER
         ===================================================== */}

      <header className="pgrid__head">
        <span className="pgrid__eyebrow">
          Services
        </span>

        <h1
          className="pgrid__title"
          id="services-title"
        >
          Digital products built to work.
        </h1>

        <p className="pgrid__lede">
          I build responsive websites, custom web systems,
          AI-powered workflows, and practical digital
          solutions designed around real project needs.
        </p>
      </header>

      <div className="home__glass sgrid__glass">

        {/* ===================================================
            METHOD
           =================================================== */}

        <div
          className="sgrid__method"
          aria-labelledby="method-title"
        >
          <div className="sgrid__method-copy">

            <span className="sgrid__method-eyebrow">
              How I Work
            </span>

            <h2
              className="sgrid__method-title"
              id="method-title"
            >
              From idea.
              <br />
              <span>To working product.</span>
            </h2>

            <p className="sgrid__method-sub">
              A simple three-step process keeps the project
              focused from the first idea to the final launch.
            </p>

          </div>

          <ol
            className="sgrid__stages"
            role="list"
          >
            {STAGES.map((stage, index) => {
              const StageIcon = stage.Icon

              return (
                <li
                  key={stage.index}
                  className="sgrid__stage"
                  style={
                    {
                      '--i': index,
                    } as CSSProperties
                  }
                >

                  <span
                    className="sgrid__stage-ghost"
                    aria-hidden="true"
                  >
                    {stage.index}
                  </span>

                  <span
                    className="sgrid__stage-icon"
                    aria-hidden="true"
                  >
                    <StageIcon
                      size={22}
                      weight="duotone"
                    />
                  </span>

                  <h3 className="sgrid__stage-label">
                    {stage.label}.
                  </h3>

                  <p className="sgrid__stage-body">
                    {stage.body}
                  </p>

                  <ul
                    className="sgrid__stage-chips"
                    role="list"
                    aria-label={`${stage.label} details`}
                  >
                    {stage.chips.map((chip) => (
                      <li
                        key={chip}
                        className="sgrid__stage-chip"
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>

                </li>
              )
            })}
          </ol>
        </div>

        {/* ===================================================
            SERVICES
           =================================================== */}

        <div className="sgrid__offers">

          <div className="sgrid__offers-head">

            <div>
              <span className="sgrid__flow-eyebrow">
                What I Build
              </span>

              <h2 className="sgrid__offers-title">
                Services for modern digital projects.
              </h2>
            </div>

            <p className="sgrid__offers-sub">
              Choose a focused service or combine multiple
              capabilities into one complete project.
            </p>

          </div>

          <ul
            className="bento sgrid__services"
            role="list"
          >
            {SERVICES.map((service) => (
              <li
                key={service.title}
                className="bento__card sgrid__service"
              >

                <span className="bento__head">

                  <span className="sgrid__service-top">

                    <Marks
                      logos={service.logos}
                    />

                    <span
                      className="sgrid__service-index"
                      aria-hidden="true"
                    >
                      {service.index} / 05
                    </span>

                  </span>

                  <span className="bento__title">
                    {service.title}
                  </span>

                  <span className="bento__desc">
                    {service.description}
                  </span>

                </span>

                <span
                  className="sgrid__chip"
                  aria-hidden="true"
                >
                  {service.chip}
                </span>

                <ul
                  className="sgrid__bullets"
                  role="list"
                >
                  {service.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="sgrid__bullet"
                    >
                      <CheckCircle
                        size={15}
                        weight="duotone"
                        aria-hidden="true"
                      />

                      <span>
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>

              </li>
            ))}
          </ul>
        </div>

        {/* ===================================================
            LIVE AUTOMATION
           =================================================== */}

        <div className="sgrid__flow">

          <header className="sgrid__flow-head">

            <div className="sgrid__flow-copy">

              <span className="sgrid__flow-eyebrow">
                Live Automation
              </span>

              <h2 className="sgrid__flow-title">
                Let repetitive work run itself.
              </h2>

              <p className="sgrid__flow-sub">
                This workflow demonstrates how connected
                tools can move information between steps,
                trigger actions, and reduce repetitive
                manual work.
              </p>

            </div>

            <ul
              className="sgrid__flow-tools"
              role="list"
              aria-label="Tools that power this workflow"
            >
              {TOOLS.map(
                ({ Icon: ToolIcon, label }) => (
                  <li
                    key={label}
                    className="sgrid__flow-tool"
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

          </header>

          <div className="sgrid__flow-main">
            <Autopilot
              compact
              maxScale={1.08}
            />
          </div>

        </div>

      </div>
    </section>
  )
}