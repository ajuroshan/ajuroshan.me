// Single source of truth for profile content. Edit here, not in the pages.

export const profile = {
  name: 'Ajmal Roshan',
  handle: 'ajuroshan',
  role: 'Backend & DevOps Engineer',
  location: 'Kochi, India',
  email: 'ajuaju0483@gmail.com',
  summary:
    'Backend & DevOps engineer. I design, ship and operate the systems behind university admissions, hostel allotment and campus billing — used by thousands of people every day.',
  education: {
    degree: 'B.Tech, Electronics & Communication',
    school: 'Cochin University of Science and Technology',
    year: '2026',
  },
  links: [
    { label: 'GitHub', href: 'https://github.com/ajuroshan' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/ajuroshan' },
    { label: 'Email', href: 'mailto:ajuaju0483@gmail.com' },
    { label: 'RSS', href: '/rss.xml' },
  ],
};

export const stats = [
  { value: '10k+', label: 'admission applications processed each year' },
  { value: '3k+', label: 'students allotted hostel seats automatically' },
  { value: '2k+', label: 'active users on hostel mess billing' },
  { value: '8+', label: 'university departments off paper workflows' },
];

export const experience = [
  {
    role: 'App Developer',
    org: 'Lascade Co',
    from: 'Jan 2025',
    to: 'Present',
    notes: [
      'Shipped and optimised two iOS apps with real-time analytics and BI tooling.',
      'Reduced load and network cost by reworking caching and replacing API polling.',
    ],
    stack: ['Swift', 'SwiftUI', 'UIKit', 'Combine', 'Firebase'],
  },
  {
    role: 'Full Stack Engineer, Intern',
    org: 'Lamsta',
    from: 'May 2023',
    to: 'Aug 2023',
    notes: ['Built the frontend of an event-management platform, turning Figma designs into reusable production components.'],
    stack: ['Next.js', 'REST'],
  },
];

export type Project = {
  name: string;
  title: string;
  url?: string;
  repo?: string;
  desc: string;
  metric?: string;
  stack: string[];
  kind: 'prod' | 'oss' | 'lab';
};

export const projects: Project[] = [
  {
    name: 'cusat-fyugp',
    title: 'CUSAT Admissions Platform',
    url: 'https://fyugp.cusat.ac.in',
    desc: 'University-wide admission system for the five-year integrated MSc programmes. Replaced paper workflows across more than eight departments.',
    metric: '10k+ applications / year',
    stack: ['Django', 'DRF', 'Docker'],
    kind: 'prod',
  },
  {
    name: 'cusat-hostels',
    title: 'Hostel Allotment System',
    url: 'https://hostels.cusat.ac.in',
    desc: 'Automated hostel seat allocation driven by a location-priority algorithm, with live dashboards for wardens and administrators.',
    metric: '3k+ students',
    stack: ['PostgreSQL', 'DRF', 'Nginx'],
    kind: 'prod',
  },
  {
    name: 'messy',
    title: 'Messy — Mess Management',
    url: 'https://messy.cusat.xyz',
    repo: 'https://github.com/ajuroshan/messy',
    desc: 'Meal attendance tracking and automated monthly bill generation for hostel food services, scaled across multiple hostels.',
    metric: '2k+ active users',
    stack: ['Django', 'SQLite', 'Metabase'],
    kind: 'prod',
  },
  {
    name: 'sargam',
    title: 'Sargam Fest Platform',
    url: 'https://sargamcusat.com',
    desc: 'Registration and event management for the university cultural festival, load-balanced behind Nginx for peak-hour traffic.',
    metric: '200+ concurrent users',
    stack: ['Django', 'PostgreSQL', 'AWS'],
    kind: 'prod',
  },
  {
    name: 'rideloop',
    title: 'RideLoop',
    repo: 'https://github.com/ajuroshan/rideloop',
    desc: 'Motorcycle telemetry: an ESP32-S3 logger with GPS and IMU streaming a live WebSocket dashboard to a handlebar-mounted phone.',
    stack: ['C++', 'ESP32', 'WebSocket'],
    kind: 'oss',
  },
  {
    name: 'dev-container',
    title: 'Dev Container',
    repo: 'https://github.com/ajuroshan/dev-container',
    desc: 'A reusable devcontainer with common developer tools, cloud CLIs, AI CLIs and an optional GUI browser session.',
    stack: ['Docker'],
    kind: 'oss',
  },
  {
    name: 'aerial-pulse',
    title: 'Aerial Pulse',
    repo: 'https://github.com/ajuroshan/aerial-pulse',
    desc: 'A Three.js globe visualising public flight routes with animated arcs.',
    stack: ['Three.js', 'JavaScript'],
    kind: 'lab',
  },
  {
    name: 'homelab',
    title: 'Homelab',
    desc: 'Self-hosted server for databases and web apps with Dockerised deploys and remote access over Tailscale.',
    stack: ['Ubuntu', 'Docker', 'Tailscale'],
    kind: 'lab',
  },
];

export const capabilities = [
  {
    title: 'Backend',
    body: 'APIs and business logic that stay correct under real admission-season load.',
    tools: ['Python', 'Django', 'DRF', 'Celery', 'Redis'],
  },
  {
    title: 'Infrastructure',
    body: 'Containers, reverse proxies, CI/CD and monitoring on cloud and bare metal.',
    tools: ['Docker', 'Linux', 'Nginx', 'GitHub Actions', 'Grafana', 'AWS', 'OCI'],
  },
  {
    title: 'Data',
    body: 'Relational schemas, reporting and dashboards that non-engineers can use.',
    tools: ['PostgreSQL', 'SQLite', 'Firebase', 'Metabase'],
  },
  {
    title: 'Mobile',
    body: 'Native iOS apps with analytics, caching and efficient networking.',
    tools: ['Swift', 'SwiftUI', 'UIKit', 'Combine'],
  },
];
