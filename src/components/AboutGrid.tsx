import React, {
  useEffect,
  useRef,
  type MouseEvent,
} from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import {
  ArrowUpRight,
  MapPin,
} from '@/components/slab'

import { profile } from '@/data/profile'

gsap.registerPlugin(ScrollTrigger)

/* ============================================================
   ABOUT GRID
   ------------------------------------------------------------
   Base:
   /marden.jpg

   Spotlight:
   /marden-spiderman.png

   The two images occupy exactly the same portrait frame.
   The Spider-Man image is slightly enlarged so the subject
   matches the scale of the normal Marden portrait.
   ============================================================ */

export default function AboutGrid() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const portraitRef = useRef<HTMLDivElement | null>(null)
  const colorLayerRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)

  const target = useRef({
    x: 50,
    y: 50,
  })

  const current = useRef({
    x: 50,
    y: 50,
  })

  const hovered = useRef(false)

  /* ==========================================================
     ENTRANCE ANIMATION
     ========================================================== */

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const portrait = portraitRef.current

      const revealElements =
        sectionRef.current?.querySelectorAll(
          '.agrid__animate',
        )

      if (portrait) {
        gsap.fromTo(
          portrait,
          {
            opacity: 0,
            y: 40,
            scale: 0.94,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 78%',
              toggleActions:
                'play none none reverse',
            },
          },
        )
      }

      if (revealElements?.length) {
        gsap.fromTo(
          revealElements,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 78%',
              toggleActions:
                'play none none reverse',
            },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  /* ==========================================================
     SMOOTH MOUSE FOLLOW
     ========================================================== */

  useEffect(() => {
    const portrait = portraitRef.current

    if (!portrait) return

    let animationFrame = 0

    const render = () => {
      current.current.x +=
        (target.current.x - current.current.x) *
        0.12

      current.current.y +=
        (target.current.y - current.current.y) *
        0.12

      const x = current.current.x
      const y = current.current.y

      if (colorLayerRef.current) {
        colorLayerRef.current.style.clipPath =
          `circle(85px at ${x}% ${y}%)`
      }

      if (ringRef.current) {
        ringRef.current.style.left =
          `${x}%`

        ringRef.current.style.top =
          `${y}%`
      }

      animationFrame =
        requestAnimationFrame(render)
    }

    animationFrame =
      requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  /* ==========================================================
     MOUSE MOVE
     ========================================================== */

  const handleMouseMove = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    const element = portraitRef.current

    if (!element) return

    const rect =
      element.getBoundingClientRect()

    const x =
      ((event.clientX - rect.left) /
        rect.width) *
      100

    const y =
      ((event.clientY - rect.top) /
        rect.height) *
      100

    target.current = {
      x: Math.max(
        0,
        Math.min(100, x),
      ),
      y: Math.max(
        0,
        Math.min(100, y),
      ),
    }

    if (!hovered.current) {
      hovered.current = true

      if (ringRef.current) {
        gsap.to(
          ringRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          },
        )
      }
    }
  }

  /* ==========================================================
     MOUSE LEAVE
     ========================================================== */

  const handleMouseLeave = () => {
    target.current = {
      x: 50,
      y: 50,
    }

    hovered.current = false

    if (ringRef.current) {
      gsap.to(
        ringRef.current,
        {
          opacity: 0,
          scale: 0.75,
          duration: 0.35,
          ease: 'power2.out',
        },
      )
    }
  }

  /* ==========================================================
     IMAGE PATHS
     ========================================================== */

  const baseImage =
    '/marden.jpg'

  const spotlightImage =
    '/marden-spiderman.png'

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <section
      ref={sectionRef}
      className="agrid"
      id="about"
      aria-labelledby="about-title"
    >

      {/* ======================================================
          HEADER
          ====================================================== */}

      <header className="agrid__head">
      </header>

      {/* ======================================================
          GLASS
          ====================================================== */}

      <div className="home__glass agrid__glass">

        {/* ====================================================
            LEFT SIDE
            ==================================================== */}

        <div className="agrid__copy">

          <p className="agrid__lead agrid__animate">
            I build digital experiences that
            <span>
              {' '}
              combine engineering,
              creativity, and technology.
            </span>
          </p>

          <p className="agrid__note agrid__animate">
            <strong>
              {profile.name}
            </strong>{' '}
            is a Computer Engineering graduate
            focused on software development,
            web development, embedded systems,
            AI, and practical technology
            solutions.
          </p>

          {/* ==================================================
              CAPABILITIES
              ================================================== */}

          <ul
            className="agrid__caps"
            role="list"
          >

            {/* WEB DEVELOPMENT */}

            <li className="agrid__cap agrid__animate">

              <span className="agrid__cap-marks">

                <span
                  className="agrid__mark"
                  style={
                    {
                      '--i': 5,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src="/icons/ai/github.svg"
                    alt=""
                  />
                </span>

                <span
                  className="agrid__mark"
                  style={
                    {
                      '--i': 4,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src="/icons/ai/cloudflare.svg"
                    alt=""
                  />
                </span>

                <span
                  className="agrid__mark"
                  style={
                    {
                      '--i': 3,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src="/icons/ai/namecheap.svg"
                    alt=""
                  />
                </span>

              </span>

              <span className="agrid__cap-title">
                Web Development
              </span>

              <span className="agrid__cap-index">
                01
              </span>

            </li>

            {/* AI */}

            <li className="agrid__cap agrid__animate">

              <span className="agrid__cap-marks">

                <span
                  className="agrid__mark"
                  style={
                    {
                      '--i': 5,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src="/icons/ai/claude-color.svg"
                    alt=""
                  />
                </span>

                <span
                  className="agrid__mark"
                  style={
                    {
                      '--i': 4,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src="/icons/ai/codex.svg"
                    alt=""
                  />
                </span>

                <span
                  className="agrid__mark"
                  style={
                    {
                      '--i': 3,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src="/icons/ai/qwen.svg"
                    alt=""
                  />
                </span>

              </span>

              <span className="agrid__cap-title">
                AI & Automation
              </span>

              <span className="agrid__cap-index">
                02
              </span>

            </li>

            {/* SOFTWARE */}

            <li className="agrid__cap agrid__animate">

              <span className="agrid__cap-marks">

                <span
                  className="agrid__mark"
                  style={
                    {
                      '--i': 5,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src="/icons/ai/github.svg"
                    alt=""
                  />
                </span>

                <span
                  className="agrid__mark"
                  style={
                    {
                      '--i': 4,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src="/icons/ai/docker.svg"
                    alt=""
                  />
                </span>

                <span
                  className="agrid__mark"
                  style={
                    {
                      '--i': 3,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src="/icons/ai/zapier.svg"
                    alt=""
                  />
                </span>

              </span>

              <span className="agrid__cap-title">
                Software & Deployment
              </span>

              <span className="agrid__cap-index">
                03
              </span>

            </li>

            {/* TECH SUPPORT */}

            <li className="agrid__cap agrid__animate">

              <span className="agrid__cap-marks">

                <span
                  className="agrid__mark"
                  style={
                    {
                      '--i': 5,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src="/icons/ai/googleplay.svg"
                    alt=""
                  />
                </span>

                <span
                  className="agrid__mark"
                  style={
                    {
                      '--i': 4,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src="/icons/slack.svg"
                    alt=""
                  />
                </span>

                <span
                  className="agrid__mark"
                  style={
                    {
                      '--i': 3,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src="/icons/ai/fireflies.png"
                    alt=""
                  />
                </span>

              </span>

              <span className="agrid__cap-title">
                Technical Support
              </span>

              <span className="agrid__cap-index">
                04
              </span>

            </li>

          </ul>

          {/* ==================================================
              CREDENTIAL BAR
              ================================================== */}

          <div className="agrid__bar agrid__animate">

            <div className="agrid__cell">

              <span className="agrid__cell-mark agrid__cell-mark--img">

                <img
                  src="/placeholders/nwu logo.jpg"
                  alt="Northwestern University"
                />

              </span>

              <span className="agrid__cell-copy">

                <strong className="agrid__cell-title">
                  BS Computer Engineering
                </strong>

                <span className="agrid__cell-meta">
                  Northwestern University
                </span>

              </span>

            </div>

            <div className="agrid__cell">

              <span className="agrid__cell-mark">

                <MapPin
                  size={19}
                  weight="duotone"
                />

              </span>

              <span className="agrid__cell-copy">

                <strong className="agrid__cell-title">
                  Laoag City, Ilocos Norte
                </strong>

                <span className="agrid__cell-meta">
                  Philippines
                </span>

              </span>

            </div>

            <a
              className="agrid__cell agrid__cell--wide"
              href="https://github.com/marden288"
              target="_blank"
              rel="noopener noreferrer"
            >

              <span className="agrid__cell-mark">

                <img
                  src="/icons/ai/github.svg"
                  alt=""
                />

              </span>

              <span className="agrid__cell-copy">

                <strong className="agrid__cell-title">
                  github.com/marden288
                </strong>

                <span className="agrid__cell-meta">
                  Projects & source code
                </span>

              </span>

              <ArrowUpRight
                className="agrid__cell-go"
                size={16}
                weight="bold"
                aria-hidden="true"
              />

            </a>

          </div>

        </div>

        {/* ====================================================
            RIGHT — ANIMATED PROFILE
            ==================================================== */}

        <div
          ref={portraitRef}
          className="agrid__portrait agrid__portrait--animated"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >

          {/* ==================================================
              GLOW
              ================================================== */}

          <div
            className="agrid__portrait-glow"
            aria-hidden="true"
          />

          {/* ==================================================
              BASE IMAGE
              marden.jpg
              ================================================== */}

          <img
            className="agrid__portrait-base"
            src={baseImage}
            alt="Marden C. Barangan"
            loading="eager"
            decoding="async"
            width={600}
            height={700}
          />

          {/* ==================================================
              SPOTLIGHT IMAGE
              marden-spiderman.png

              IMPORTANT:
              Same 100% width/height as base.
              CSS below enlarges it slightly.
              ================================================== */}

          <div
            ref={colorLayerRef}
            className="agrid__portrait-reveal"
            aria-hidden="true"
          >

            <img
              className="agrid__portrait-spiderman"
              src={spotlightImage}
              alt=""
              loading="eager"
              decoding="async"
              width={600}
              height={700}
            />

          </div>

          {/* ==================================================
              LIGHT RING
              ================================================== */}

          <div
            ref={ringRef}
            className="agrid__portrait-ring"
            aria-hidden="true"
          />

          {/* ==================================================
              LABEL
              ================================================== */}

          <div
            className="agrid__portrait-hint"
            aria-hidden="true"
          >

            <span className="agrid__portrait-dot" />

            <span>
              Hover to explore
            </span>

          </div>

        </div>

      </div>
    </section>
  )
}