import { aiStack, type StackNode } from '@/data/ai-stack'

/**
 * AIStackGrid
 *
 * Logo-first overview of the AI systems in the portfolio.
 *
 * The actual system names, descriptions, status, and stack
 * come from /src/data/ai-stack.ts.
 *
 * This file controls:
 * - Tool/logo mapping
 * - Harness information
 * - Grid layout
 * - Card presentation
 */

type Tool = {
  name: string
  src: string
}

/* -------------------------------------------------------------------------- */
/* TOOL / TECHNOLOGY LOGOS                                                    */
/* -------------------------------------------------------------------------- */

const T = {
  claude: {
    name: 'Claude',
    src: '/icons/ai/claude-color.svg',
  },

  claudeCode: {
    name: 'Claude Code',
    src: '/icons/claude-code-logo.png',
  },

  openai: {
    name: 'OpenAI Whisper',
    src: '/icons/openai.svg',
  },

  elevenlabs: {
    name: 'ElevenLabs',
    src: '/icons/ai/elevenlabs.svg',
  },

  node: {
    name: 'Node.js',
    src: '/icons/ai/nodedotjs.svg',
  },

  telegram: {
    name: 'Telegram',
    src: '/icons/ai/telegram.svg',
  },

  slack: {
    name: 'Slack',
    src: '/icons/slack.svg',
  },

  postgres: {
    name: 'PostgreSQL + pgvector',
    src: '/icons/ai/postgresql.svg',
  },

  sqlite: {
    name: 'SQLite FTS5',
    src: '/icons/ai/sqlite.svg',
  },

  nous: {
    name: 'Nous Hermes',
    src: '/icons/ai/hermes.svg',
  },

  docker: {
    name: 'Docker',
    src: '/icons/ai/docker.svg',
  },

  ghl: {
    name: 'GoHighLevel',
    src: '/icons/gohighlevel.png',
  },

  codex: {
    name: 'Codex',
    src: '/icons/ai/codex.svg',
  },

  cursor: {
    name: 'Cursor',
    src: '/icons/ai/cursor.svg',
  },
} satisfies Record<string, Tool>

/* -------------------------------------------------------------------------- */
/* PROJECT / SYSTEM TOOL MAPPING                                              */
/* -------------------------------------------------------------------------- */

/**
 * The tools used by each AI system.
 *
 * The keys MUST match the IDs inside:
 *
 * src/data/ai-stack.ts
 */
const TOOLS: Record<string, Tool[]> = {
  'project-a': [
    T.claude,
  ],

  'project-b': [
    T.claude,
    T.claudeCode,
  ],

  'project-c': [
    T.node,
    T.elevenlabs,
    T.openai,
    T.telegram,
  ],

  'project-d': [
    T.claude,
    T.claudeCode,
  ],

  'project-e': [
    T.claude,
    T.postgres,
    T.slack,
  ],

  'project-f': [
    T.claude,
    T.sqlite,
  ],

  'project-g': [
    T.claude,
    T.ghl,
  ],

  'project-h': [
    T.claude,
    T.elevenlabs,
  ],

  'project-i': [
    T.claude,
  ],

  'project-j': [
    T.nous,
    T.telegram,
    T.docker,
  ],

  'project-k': [
    T.nous,
    T.telegram,
  ],
}

/* -------------------------------------------------------------------------- */
/* AI DEVELOPMENT HARNESS                                                     */
/* -------------------------------------------------------------------------- */

const HARNESS: Tool[] = [
  {
    name: 'Claude Code',
    src: '/icons/claude-code-logo.png',
  },

  {
    name: 'Codex',
    src: '/icons/ai/codex.svg',
  },

  {
    name: 'Cursor',
    src: '/icons/ai/cursor.svg',
  },

  {
    name: 'Hermes',
    src: '/icons/ai/hermes.svg',
  },
]

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type Group = {
  title: string
  what: string
  systems: StackNode[]
}

/* -------------------------------------------------------------------------- */
/* GROUP TREE                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Converts the nested AI stack into display groups.
 *
 * Example:
 *
 * AI Stack
 * ├── Automation
 * │   ├── System A
 * │   └── System B
 * │
 * └── Development
 *     ├── System C
 *     └── System D
 */
function groups(root: StackNode): Group[] {
  return (root.children ?? []).map(
    (branch) => {
      const children =
        branch.children ?? []

      /**
       * If the branch itself has a status,
       * it is also a system and should appear
       * inside its own group.
       */
      const systems =
        branch.status
          ? [branch, ...children]
          : children

      return {
        title: branch.name,
        what: branch.what,
        systems,
      }
    },
  )
}

/* -------------------------------------------------------------------------- */
/* TOOL MARK                                                                   */
/* -------------------------------------------------------------------------- */

function ToolMark({
  tool,
}: {
  tool: Tool
}) {
  return (
    <span
      className="aig__mark"
      title={tool.name}
      aria-label={tool.name}
    >
      <img
        src={tool.src}
        alt=""
        width={22}
        height={22}
        loading="lazy"
        decoding="async"
      />
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* SYSTEM CARD                                                                 */
/* -------------------------------------------------------------------------- */

function Card({
  n,
}: {
  n: StackNode
}) {
  const tools =
    TOOLS[n.id] ?? []

  const toolNames =
    tools
      .map((tool) => tool.name)
      .join(', ')

  const Icon =
    n.Icon

  return (
    <li className="aig__card">
      {/* Tool / technology logos */}
      <div
        className="aig__marks"
        aria-label={
          tools.length > 0
            ? `Built with ${toolNames}`
            : 'Technology stack'
        }
      >
        {tools.length > 0 ? (
          tools.map((tool) => (
            <ToolMark
              key={`${n.id}-${tool.name}`}
              tool={tool}
            />
          ))
        ) : (
          <span
            className="aig__no-tools"
            aria-hidden="true"
          >
            AI
          </span>
        )}

        {/* Status */}
        {n.status && (
          <span
            className="aig__status"
            data-status={n.status}
          >
            {n.status}
          </span>
        )}
      </div>

      {/* System name */}
      <h4 className="aig__name">
        {Icon && (
          <Icon
            size={16}
            weight="duotone"
            aria-hidden="true"
          />
        )}

        <span>
          {n.name}
        </span>
      </h4>

      {/* Description */}
      <p className="aig__what">
        {n.what}
      </p>

      {/* Technology stack */}
      {n.stack && (
        <p className="aig__stack">
          {n.stack}
        </p>
      )}

      {/* Tool names */}
      {tools.length > 0 && (
        <ul
          className="aig__tools"
          role="list"
          aria-label="Technologies used"
        >
          {tools.map((tool) => (
            <li
              key={`${n.id}-${tool.name}-text`}
            >
              {tool.name}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

/* -------------------------------------------------------------------------- */
/* HARNESS                                                                     */
/* -------------------------------------------------------------------------- */

function Harness() {
  return (
    <div
      className="aig__harness"
      aria-label="Development tools"
    >
      <span className="aig__harness-label">
        Built with
      </span>

      <div className="aig__harness-list">
        {HARNESS.map((tool) => (
          <span
            key={tool.name}
            className="aig__harness-item"
            title={tool.name}
          >
            <img
              src={tool.src}
              alt=""
              width={20}
              height={20}
              loading="lazy"
              decoding="async"
            />

            <span>
              {tool.name}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                              */
/* -------------------------------------------------------------------------- */

export default function AIStackGrid() {
  const groupedSystems =
    groups(aiStack)

  return (
    <div className="aig">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <header className="aig__head">
        <div className="aig__head-text">
          <span className="aig__eyebrow">
            AI Systems
          </span>

          <h3 className="aig__title">
            {aiStack.what}
          </h3>

          <p className="aig__intro">
            A collection of AI-powered systems,
            automations, and development workflows
            built with modern models and tools.
          </p>
        </div>

        <Harness />
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* GROUPS                                                             */}
      {/* ------------------------------------------------------------------ */}

      {groupedSystems.length > 0 ? (
        groupedSystems.map(
          (group) => (
            <section
              key={group.title}
              className="aig__group"
              aria-labelledby={`aig-${group.title
                .toLowerCase()
                .replace(/\s+/g, '-')}`}
            >
              <div className="aig__group-head">
                <h3
                  id={`aig-${group.title
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`}
                  className="aig__group-title"
                >
                  {group.title}
                </h3>

                <p className="aig__group-what">
                  {group.what}
                </p>
              </div>

              {group.systems.length > 0 ? (
                <ul
                  className="aig__cards"
                  role="list"
                >
                  {group.systems.map(
                    (system) => (
                      <Card
                        key={system.id}
                        n={system}
                      />
                    ),
                  )}
                </ul>
              ) : (
                <p className="aig__empty">
                  No systems listed in this
                  category yet.
                </p>
              )}
            </section>
          ),
        )
      ) : (
        <div className="aig__empty">
          No AI systems available.
        </div>
      )}
    </div>
  )
}