export type QA = {
  q: string
  a: string
}

/**
 * Frequently asked questions for the Contact page.
 *
 * These answers are written for Marden's personal portfolio and cover:
 * - services
 * - project timelines
 * - pricing
 * - location
 * - contact process
 */
export const FAQS: QA[] = [
  {
    q: 'What do you do?',
    a:
      'I work on software development, web development, responsive websites, automation, and technology projects. I also have experience with embedded systems, Arduino, Raspberry Pi, AI-related projects, and technical support.',
  },

  {
    q: 'What kind of projects can you work on?',
    a:
      'I can work on personal portfolios, business websites, web applications, school or organization systems, e-commerce projects, automation workflows, and selected embedded or IoT projects. The exact scope depends on the features, technologies, and requirements of the project.',
  },

  {
    q: 'How much do you charge?',
    a:
      'Pricing depends on the project scope, features, design requirements, integrations, and development time. After reviewing your requirements, I can provide a project-based estimate based on what needs to be built.',
  },

  {
    q: 'Where are you based?',
    a:
      'I am based in the Philippines and can work remotely with clients and teams in different locations. Most communication, project coordination, and development work can be handled online.',
  },

  {
    q: 'What happens after I send a message?',
    a:
      'I review the project details and respond with the next steps or any questions needed to understand the requirements. For larger projects, we can discuss the scope, features, timeline, technology stack, and estimated cost before development begins.',
  },
]