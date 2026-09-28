import type React from 'react'
import { Link } from 'react-router-dom'

import {
  ArrowUpRight,
  FolderOpen,
  User,
  Robot,
  Medal,
  Stack,
  Quotes,
  FunnelSimple,
  Gear,
  AddressBook,
  Globe,
  AppWindow,
  SealCheck,
} from '@/components/slab'

import {
  gymFunnel,
  bookingFunnel,
  websiteFunnel,
  type Funnel,
} from '@/data/funnels'

import {
  aiStack,
  type StackNode,
} from '@/data/ai-stack'

import { profile } from '@/data/profile'


/* ============================================================
   IMAGE HELPER
   ============================================================ */

const thumbSrc = (f: Funnel) =>
  `/home/${f.dir ?? 'funnels'}-${f.file.replace('.html', '.jpeg')}`


/* ============================================================
   PROJECT IMAGES
   ============================================================ */

const PROJECT_SHOTS = [
  gymFunnel[0],
  bookingFunnel[0],
  websiteFunnel[0],
  gymFunnel[1],
].filter(Boolean)


/* ============================================================
   SERVICES
   ============================================================ */

const OFFERS = [
  {
    Icon: FunnelSimple,
    title: 'Web Development',
    note: 'Modern websites and web applications.',
  },
  {
    Icon: Gear,
    title: 'Technical Support',
    note: 'Troubleshooting and technology support.',
  },
  {
    Icon: AddressBook,
    title: 'Automation',
    note: 'Digital workflows and business automation.',
  },
  {
    Icon: Globe,
    title: 'Deployment',
    note: 'Hosting, domains, and deployment setup.',
  },
  {
    Icon: AppWindow,
    title: 'Custom Systems',
    note: 'Practical software and digital solutions.',
  },
] as const


/* ============================================================
   CLIENTS / TESTIMONIALS
   ============================================================ */

const CLIENTS = [
  {
    name: 'Keyl Forks',
    role: 'Client',
    work: 'Web Development · Tech Support',
    logo: '/placeholders/client2.jpg',
  },
  {
    name: 'Mr. Mon Lu',
    role: 'Client',
    work: 'Website Support · Automation',
    logo: '/placeholders/client3.jpg',
  },
  {
    name: 'Ramon Melchor',
    role: 'Client',
    work: 'Software Development · IT Support',
    logo: '/placeholders/client4.jpg',
  },
] as const


/* ============================================================
   ABOUT PHOTOS
   ============================================================ */

const PHOTOS = [
  profile.avatarSrc,
  '/placeholders/bar.jpg',
  '/placeholders/new.jpg',
]


/* ============================================================
   AI BUILD TREE
   ============================================================ */

const leaves = (node: StackNode): StackNode[] =>
  node.children?.length
    ? node.children.flatMap(leaves)
    : [node]

const AI_BUILDS = leaves(aiStack)


/* ============================================================
   CARD HEADER
   ============================================================ */

function CardHead({
  Icon,
  title,
  desc,
}: {
  Icon: typeof FolderOpen
  title: string
  desc: string
}) {
  return (
    <header className="bento__head">
      <span className="bento__label">
        <span className="bento__icon">
          <Icon
            size={20}
            weight="fill"
            aria-hidden="true"
          />
        </span>

        <h3 className="bento__title">
          {title}
        </h3>
      </span>

      <p className="bento__desc">
        {desc}
      </p>

      <ArrowUpRight
        size={15}
        weight="bold"
        aria-hidden="true"
        className="bento__arrow"
      />
    </header>
  )
}


/* ============================================================
   SAFE IMAGE
   ============================================================ */

function SafeImage({
  src,
  alt = '',
  width,
  height,
  loading = 'lazy',
  className,
}: {
  src: string
  alt?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  className?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={className}
      onError={(event) => {
        event.currentTarget.style.display = 'none'
      }}
    />
  )
}


/* ============================================================
   HOME BENTO
   ============================================================ */

export default function HomeBento() {

  const half = Math.ceil(
    AI_BUILDS.length / 2,
  )

  const toolRows = [
    AI_BUILDS.slice(0, half),
    AI_BUILDS.slice(half),
  ]


  return (
    <nav
      className="bento"
      aria-label="Explore the portfolio"
    >


      {/* ======================================================
          PROJECTS
          ====================================================== */}

      <Link
        to="/projects"
        className="bento__card bento__card--projects"
      >

        <CardHead
          Icon={FolderOpen}
          title="Projects"
          desc="Websites, applications, and technology projects."
        />

        <div
          className="bento__media bento__reel"
          aria-hidden="true"
        >

          <div className="bento__reel-track">

            {[
              ...PROJECT_SHOTS,
              ...PROJECT_SHOTS,
            ].map((f, i) => (

              <span
                key={i}
                className="bento__shot"
              >

                <img
                  src={thumbSrc(f)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />

              </span>

            ))}

          </div>

        </div>

      </Link>


      {/* ======================================================
          ABOUT
          ====================================================== */}

      <Link
        to="/about"
        className="bento__card bento__card--about"
      >

        <CardHead
          Icon={User}
          title="About"
          desc="Computer Engineering graduate focused on technology."
        />

        <div
          className="bento__media bento__fan"
          aria-hidden="true"
        >

          {PHOTOS.map((src, index) => (

            <span
              key={`${src}-${index}`}
              className="bento__photo"
              style={{
                ['--i' as string]: index,
              }}
            >

              <SafeImage
                src={src}
                alt=""
                loading="lazy"
              />

            </span>

          ))}

        </div>

      </Link>


      {/* ======================================================
          AI BUILDS
          ====================================================== */}

      <Link
        to="/projects"
        className="bento__card bento__card--ai"
      >

        <CardHead
          Icon={Robot}
          title="AI Builds"
          desc="AI tools, automation, and experimental systems."
        />

        <div
          className="bento__media bento__chips"
          aria-hidden="true"
        >

          {toolRows.map((row, rowIndex) => (

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
                ].map((node, index) => (

                  <span
                    key={`${node.id}-${index}`}
                    className="bento__chip"
                    data-status={node.status}
                  >

                    <node.Icon
                      size={15}
                      weight="duotone"
                    />

                    {node.name}

                  </span>

                ))}

              </div>

            </div>

          ))}

        </div>

      </Link>


      {/* ======================================================
          CREDENTIALS
          ====================================================== */}

      <Link
        to="/about"
        className="bento__card bento__card--creds"
      >

        <CardHead
          Icon={Medal}
          title="Credentials"
          desc="Computer Engineering and technology certifications."
        />

        <div
          className="bento__media bento__badge"
          aria-hidden="true"
        >

          {/* ==================================================
              AWARD IMAGE
              ================================================== */}

          <span className="bento__badge-ring">

            <SafeImage
              src="/placeholders/award.png"
              alt="Computer Engineering credential"
              loading="eager"
              className="bento__award-image"
            />

          </span>


          {/* ==================================================
              CREDENTIAL LABEL
              ================================================== */}

          <span className="bento__badge-tag">

            <SealCheck
              size={14}
              weight="fill"
            />

            Computer Engineering

          </span>

        </div>

      </Link>


      {/* ======================================================
          SERVICES
          ====================================================== */}

      <Link
        to="/services"
        className="bento__card bento__card--services"
      >

        <CardHead
          Icon={Stack}
          title="Services"
          desc="Technology services for websites, software, and support."
        />

        <ul
          className="bento__media bento__offers"
          role="list"
        >

          {OFFERS.map(
            (
              {
                Icon,
                title,
                note,
              },
              index,
            ) => (

              <li
                key={title}
                className="bento__offer"
                style={
                  {
                    '--i': index,
                  } as React.CSSProperties
                }
              >

                <span className="bento__offer-tile">

                  <Icon
                    size={15}
                    weight="duotone"
                    aria-hidden="true"
                  />

                </span>

                <span className="bento__offer-text">

                  <span className="bento__offer-title">
                    {title}
                  </span>

                  <span className="bento__offer-note">
                    {note}
                  </span>

                </span>

                <span
                  className="bento__offer-num"
                  aria-hidden="true"
                >
                  0{index + 1}
                </span>

              </li>

            ),
          )}

        </ul>

      </Link>


      {/* ======================================================
          TESTIMONIALS
          ====================================================== */}

      <Link
        to="/testimonials"
        className="bento__card bento__card--quotes"
      >

        <CardHead
          Icon={Quotes}
          title="Testimonials"
          desc="What clients say about working with me."
        />

        <div
          className="bento__media bento__reviews"
          aria-hidden="true"
        >

          <div className="bento__reviews-track">

            {[
              ...CLIENTS,
              ...CLIENTS,
            ].map((client, index) => (

              <span
                key={`${client.name}-${index}`}
                className="bento__review"
              >

                <span className="bento__review-top">

                  {client.logo ? (

                    <SafeImage
                      src={client.logo}
                      alt=""
                      width={18}
                      height={18}
                      loading="lazy"
                    />

                  ) : (

                    <Quotes
                      size={14}
                      weight="fill"
                    />

                  )}

                  <b>
                    {client.name}
                  </b>

                </span>

                <span className="bento__review-role">
                  {client.role}
                </span>

                <span className="bento__review-work">
                  {client.work}
                </span>

              </span>

            ))}

          </div>

        </div>

      </Link>

    </nav>
  )
}