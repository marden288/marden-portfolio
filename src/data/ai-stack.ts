/**
 * AI / SYSTEMS STACK
 *
 * This file is the single source of truth for the systems tree used by:
 *
 * - Projects systems pop-up
 * - Home systems chips
 * - Projects bento card
 * - AIStack.tsx
 * - AIStackGrid.tsx
 *
 * The root represents Marden.
 * Categories group related systems.
 * Projects represent individual systems or tools.
 *
 * IMPORTANT:
 * Keep the exported names and node IDs stable because other components
 * use these IDs to display logos and project information.
 */

import {
  Sparkle,
  Coffee,
  Robot,
  Article,
  FilmSlate,
  UsersThree,
  Database,
  SlackLogo,
  MagnifyingGlass,
  ChatCircleDots,
  FlowArrow,
  PhoneCall,
  Browser,
  Broadcast,
  Timer,
} from '@/components/slab'

import type { Icon } from '@/components/slab'
import { profile } from '@/data/profile'

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type StackStatus = 'Live' | 'Internal' | 'Beta'

/**
 * Brand/vendor logo used by the systems UI.
 */
export type StackLogo = {
  src: string
  name: string
}

/**
 * A single node in the systems tree.
 */
export type StackNode = {
  id: string
  name: string

  /**
   * One simple sentence describing what the system does.
   */
  what: string

  /**
   * Technology, platform, model, or runtime used by the system.
   */
  stack?: string

  /**
   * Current project status.
   */
  status?: StackStatus

  /**
   * Icon displayed on the system card.
   */
  Icon: Icon

  /**
   * Optional technology/vendor logos.
   */
  logos?: StackLogo[]

  /**
   * Child systems.
   */
  children?: StackNode[]
}

/* -------------------------------------------------------------------------- */
/* Technology / vendor marks                                                  */
/* -------------------------------------------------------------------------- */

const ANTHROPIC: StackLogo = {
  src: '/icons/anthropic.svg',
  name: 'Anthropic',
}

const OPENAI: StackLogo = {
  src: '/icons/openai.svg',
  name: 'OpenAI',
}

const SLACK: StackLogo = {
  src: '/icons/slack.svg',
  name: 'Slack',
}

const NOUS: StackLogo = {
  src: '/icons/nousresearch.svg',
  name: 'Nous Research',
}

/* -------------------------------------------------------------------------- */
/* AI / Systems Stack                                                          */
/* -------------------------------------------------------------------------- */

export const aiStack: StackNode = {
  id: 'root',

  Icon: Sparkle,

  name: profile.name,

  what:
    'Software, web, automation, AI, and technology systems built to solve practical problems and improve digital workflows.',

  stack:
    'React, Vite, TypeScript, Python, Node.js, AI APIs, databases, and automation tools',

  children: [
    /* ---------------------------------------------------------------------- */
    /* Project A                                                             */
    /* ---------------------------------------------------------------------- */

    {
      id: 'project-a',

      Icon: Coffee,

      logos: [ANTHROPIC],

      name: 'AI Development Assistant',

      what:
        'An AI-assisted development workflow used to research ideas, generate code, troubleshoot projects, and improve development productivity.',

      stack:
        'Claude, AI-assisted development, VS Code, Git, GitHub',

      status: 'Internal',
    },

    /* ---------------------------------------------------------------------- */
    /* AI & Development                                                       */
    /* ---------------------------------------------------------------------- */

    {
      id: 'category-one',

      Icon: Robot,

      name: 'AI & Development',

      what:
        'AI-assisted development systems for building, testing, researching, and improving software projects.',

      children: [
        {
          id: 'project-b',

          Icon: Article,

          logos: [ANTHROPIC],

          name: 'AI Project Assistant',

          what:
            'An AI workflow for organizing project requirements, writing technical content, and assisting with software development tasks.',

          stack:
            'Claude, TypeScript, React, VS Code, GitHub',

          status: 'Internal',
        },

        {
          id: 'project-c',

          Icon: FilmSlate,

          logos: [OPENAI],

          name: 'AI Media Assistant',

          what:
            'A media-focused AI workflow for working with images, audio, video concepts, and content generation tasks.',

          stack:
            'OpenAI APIs, Python, JavaScript, media processing',

          status: 'Internal',
        },

        {
          id: 'project-d',

          Icon: UsersThree,

          logos: [ANTHROPIC],

          name: 'AI Support Assistant',

          what:
            'An AI-assisted support workflow for answering questions, organizing information, and helping users solve technical problems.',

          stack:
            'Claude, web applications, structured prompts, knowledge workflows',

          status: 'Internal',
        },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* Data & Integrations                                                    */
    /* ---------------------------------------------------------------------- */

    {
      id: 'category-two',

      Icon: Database,

      name: 'Data & Integrations',

      what:
        'Systems that connect applications, databases, communication tools, and external services.',

      children: [
        {
          id: 'project-e',

          Icon: SlackLogo,

          logos: [ANTHROPIC, SLACK],

          name: 'Team Communication Automation',

          what:
            'A workflow concept that connects AI assistance with team communication for notifications, information sharing, and productivity.',

          stack:
            'Claude, Slack, webhooks, Node.js, automation',

          status: 'Internal',
        },

        {
          id: 'project-f',

          Icon: MagnifyingGlass,

          logos: [ANTHROPIC],

          name: 'Knowledge Search',

          what:
            'A searchable knowledge workflow designed to help users find relevant project information quickly.',

          stack:
            'Claude, structured data, search, embeddings, databases',

          status: 'Internal',
        },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* Communication & Automation                                             */
    /* ---------------------------------------------------------------------- */

    {
      id: 'category-three',

      Icon: ChatCircleDots,

      name: 'Communication & Automation',

      what:
        'Digital workflows for communication, lead handling, notifications, and automated business processes.',

      children: [
        {
          id: 'project-g',

          Icon: FlowArrow,

          logos: [ANTHROPIC],

          name: 'Lead Automation',

          what:
            'An automation workflow that helps capture, organize, and process incoming leads and customer requests.',

          stack:
            'Claude, web forms, webhooks, APIs, automation',

          status: 'Internal',
        },

        {
          id: 'project-h',

          Icon: PhoneCall,

          logos: [ANTHROPIC],

          name: 'AI Customer Assistant',

          what:
            'An AI-assisted customer communication concept for handling common questions and directing users to the right information.',

          stack:
            'Claude, conversational workflows, APIs',

          status: 'Beta',
        },

        {
          id: 'project-i',

          Icon: Browser,

          logos: [ANTHROPIC],

          name: 'Web Workflow Assistant',

          what:
            'A browser-based assistant concept for automating repetitive web tasks and organizing information across online workflows.',

          stack:
            'Claude, browser workflows, JavaScript, APIs',

          status: 'Internal',
        },
      ],
    },

    /* ---------------------------------------------------------------------- */
    /* Embedded / IoT Systems                                                 */
    /* ---------------------------------------------------------------------- */

    {
      id: 'project-j',

      Icon: Broadcast,

      logos: [NOUS],

      name: 'Embedded & IoT Systems',

      what:
        'Connected hardware projects combining microcontrollers, sensors, displays, networking, and software.',

      stack:
        'Arduino, ESP32, Raspberry Pi, sensors, APIs, embedded software',

      status: 'Internal',

      children: [
        {
          id: 'project-k',

          Icon: Timer,

          name: 'Smart Device Automation',

          what:
            'Embedded automation systems that connect sensors and hardware components to perform scheduled or event-based actions.',

          stack:
            'Arduino, ESP32, Raspberry Pi, sensors, relays, embedded C/C++',

          status: 'Internal',
        },
      ],
    },
  ],
}