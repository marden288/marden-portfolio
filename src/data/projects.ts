/**
 * PROJECT DATA
 *
 * Projects shown on the Apps / Projects sections of the website.
 *
 * Image files should be placed inside:
 *
 * public/placeholders/
 *
 * Example:
 * public/placeholders/smart-mirror.jpg
 * public/placeholders/ecommerce.jpg
 */

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type AppStat = {
  value: string
  label: string
}

export type AppProject = {
  name: string
  tagline: string
  description: string

  /**
   * Optional project screenshot.
   * If omitted, the component can render its gradient placeholder.
   */
  imageSrc?: string

  /**
   * CSS object-position override.
   * Defaults to top center in the project component.
   */
  imagePosition?: string

  /**
   * Project-specific accent color.
   */
  accentColor: string

  /**
   * Small project statistics.
   */
  stats: AppStat[]

  /**
   * Short category/badge.
   */
  badge: string
}

/**
 * @deprecated
 * Use AppProject instead.
 */
export type MobileApp = AppProject

/* -------------------------------------------------------------------------- */
/* Mobile / Interactive Projects                                              */
/* -------------------------------------------------------------------------- */

export const mobileApps: MobileApp[] = [
  {
    name: 'Animation Chair',

    tagline: 'Interactive 3D chair visualization.',

    description:
      'An interactive 3D visualization project focused on presenting a chair model through animation, movement, and modern web-based visual effects.',

    imageSrc: '/placeholders/app-1.jpg',

    imagePosition: '50% 30%',

    accentColor: '#2563EB',

    stats: [
      {
        value: '3D',
        label: 'Visualization',
      },
      {
        value: 'Web',
        label: 'Interactive',
      },
      {
        value: 'UI',
        label: 'Experience',
      },
    ],

    badge: '3D',
  },

  {
    name: 'ID Card 3D',

    tagline: 'Interactive 3D identification card concept.',

    description:
      'A 3D ID card interface concept designed to demonstrate interactive presentation, visual effects, and a modern digital identity experience.',

    imageSrc: '/placeholders/app-2.jpg',

    imagePosition: '50% 30%',

    accentColor: '#7C3AED',

    stats: [
      {
        value: '3D',
        label: 'Design',
      },
      {
        value: 'ID',
        label: 'Identity',
      },
      {
        value: 'UI',
        label: 'Interface',
      },
    ],

    badge: 'ID',
  },

  {
    name: 'Animation 3D Bike',

    tagline: 'Animated 3D motorcycle visualization.',

    description:
      'An interactive 3D motorcycle visualization project combining animation, web graphics, and a modern interface for presenting a dynamic vehicle concept.',

    imageSrc: '/placeholders/app-3.jpg',

    imagePosition: '50% 30%',

    accentColor: '#16A34A',

    stats: [
      {
        value: '3D',
        label: 'Graphics',
      },
      {
        value: 'Web',
        label: 'Interactive',
      },
      {
        value: 'Motion',
        label: 'Animation',
      },
    ],

    badge: 'Bike',
  },
]

/* -------------------------------------------------------------------------- */
/* Web Projects                                                               */
/* -------------------------------------------------------------------------- */

export const webApps: AppProject[] = [
  {
    name: 'Smart Mirror',

    tagline: 'A Raspberry Pi powered smart display system.',

    description:
      'A smart mirror interface built around a Raspberry Pi with a web-based control system, weather information, administrator controls, and a customized university-themed display.',

    imageSrc: '/placeholders/smart-mirror.jpg',

    imagePosition: '50% 20%',

    accentColor: '#0EA5E9',

    stats: [
      {
        value: 'RPI',
        label: 'Platform',
      },
      {
        value: 'Web',
        label: 'Interface',
      },
      {
        value: 'API',
        label: 'Integration',
      },
    ],

    badge: 'IoT',
  },

  {
    name: 'E-Commerce Website',

    tagline: 'Modern online shopping platform.',

    description:
      'A full-stack e-commerce project featuring product browsing, shopping functionality, authentication, backend services, database integration, and deployment-ready architecture.',

    imageSrc: '/placeholders/ecommerce.jpg',

    imagePosition: '50% 15%',

    accentColor: '#EF4444',

    stats: [
      {
        value: 'Full',
        label: 'Stack',
      },
      {
        value: 'DB',
        label: 'Database',
      },
      {
        value: 'Auth',
        label: 'Authentication',
      },
    ],

    badge: 'E-Commerce',
  },

  {
    name: 'Marden Portfolio',

    tagline: 'Personal portfolio for software and engineering projects.',

    description:
      'A responsive personal portfolio showcasing software development, web development, embedded systems, AI projects, certifications, and professional work.',

    imageSrc: '/placeholders/project-3.jpg',

    imagePosition: '50% 20%',

    accentColor: '#0891B2',

    stats: [
      {
        value: 'React',
        label: 'Frontend',
      },
      {
        value: 'Vite',
        label: 'Build',
      },
      {
        value: '100%',
        label: 'Responsive',
      },
    ],

    badge: 'Portfolio',
  },

  {
    name: 'School Management System',

    tagline: 'Digital tools for schools, teachers, and students.',

    description:
      'A school management concept designed to organize student records, administration workflows, QR-based student identification, reports, and data export.',

    imageSrc: '/placeholders/project-4.jpg',

    imagePosition: '50% 20%',

    accentColor: '#F59E0B',

    stats: [
      {
        value: 'QR',
        label: 'Student ID',
      },
      {
        value: 'PDF',
        label: 'Reports',
      },
      {
        value: 'Excel',
        label: 'Export',
      },
    ],

    badge: 'Education',
  },
]