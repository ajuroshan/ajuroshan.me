// Single source of truth for profile content. Edit here, not in the pages.

export const profile = {
  name: 'Ajmal Roshan',
  handle: 'ajuroshan',
  host: 'ajuroshan.me',
  role: 'Backend & DevOps Engineer',
  location: 'Kochi, Kerala, IN',
  summary:
    'I build production systems that real people depend on — admission portals, allotment engines, billing pipelines — and the infrastructure that keeps them up.',
  education: 'B.Tech, Electronics & Communication — Cochin University of Science and Technology (2026)',
  links: [
    { label: 'github', href: 'https://github.com/ajuroshan' },
    { label: 'linkedin', href: 'https://linkedin.com/in/ajuroshan' },
    { label: 'email', href: 'mailto:ajuaju0483@gmail.com' },
    { label: 'rss', href: '/rss.xml' },
  ],
};

export const experience = [
  {
    role: 'App Developer',
    org: 'Lascade Co',
    from: '2025-01',
    to: 'present',
    notes: [
      'Shipped and optimised 2 iOS apps with real-time analytics and BI tooling.',
      'Cut load and network cost by reworking caching and replacing API polling.',
    ],
    stack: ['Swift', 'SwiftUI', 'UIKit', 'Combine', 'Firebase'],
  },
  {
    role: 'Full Stack Engineer (Intern)',
    org: 'Lamsta',
    from: '2023-05',
    to: '2023-08',
    notes: ['Built the frontend of an event-management platform from Figma into reusable components.'],
    stack: ['Next.js', 'REST'],
  },
];

export type Project = {
  name: string;
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
    url: 'https://fyugp.cusat.ac.in',
    desc: 'University-wide admission platform for the five-year integrated MSc programmes, replacing paper workflows across 8+ departments.',
    metric: '10k+ applications/yr',
    stack: ['Django', 'DRF', 'Docker'],
    kind: 'prod',
  },
  {
    name: 'cusat-hostels',
    url: 'https://hostels.cusat.ac.in',
    desc: 'Automated hostel seat allocation using a location-priority algorithm, with live dashboards for wardens and admins.',
    metric: '3k+ students',
    stack: ['PostgreSQL', 'DRF', 'Nginx'],
    kind: 'prod',
  },
  {
    name: 'messy',
    url: 'https://messy.cusat.xyz',
    repo: 'https://github.com/ajuroshan/messy',
    desc: 'Hostel mess management: meal attendance tracking and automated monthly bill generation.',
    metric: '2k+ active users',
    stack: ['Django', 'SQLite', 'Metabase'],
    kind: 'prod',
  },
  {
    name: 'sargam',
    url: 'https://sargamcusat.com',
    desc: 'Registration and event management for the university cultural fest, load-balanced behind Nginx.',
    metric: '200+ concurrent users',
    stack: ['Django', 'PostgreSQL', 'AWS'],
    kind: 'prod',
  },
  {
    name: 'rideloop',
    repo: 'https://github.com/ajuroshan/rideloop',
    desc: 'Motorcycle telemetry: ESP32-S3 logger with GPS + IMU streaming a live WebSocket dashboard to a handlebar-mounted phone.',
    stack: ['C++', 'ESP32', 'WebSocket'],
    kind: 'oss',
  },
  {
    name: 'dev-container',
    repo: 'https://github.com/ajuroshan/dev-container',
    desc: 'Reusable devcontainer with common dev tools, cloud CLIs, AI CLIs and an optional GUI browser session.',
    stack: ['Docker'],
    kind: 'oss',
  },
  {
    name: 'aerial-pulse',
    repo: 'https://github.com/ajuroshan/aerial-pulse',
    desc: 'Three.js globe with animated public flight routes.',
    stack: ['Three.js', 'JavaScript'],
    kind: 'lab',
  },
  {
    name: 'homelab',
    desc: 'Self-hosted server for databases and web apps: Dockerised deploys, remote access over Tailscale.',
    stack: ['Ubuntu', 'Docker', 'Tailscale'],
    kind: 'lab',
  },
];

export const stack: Record<string, string[]> = {
  backend: ['Python', 'Django', 'DRF', 'Celery', 'Redis'],
  infra: ['Docker', 'Linux', 'Nginx', 'GitHub Actions', 'Grafana', 'AWS', 'OCI'],
  data: ['PostgreSQL', 'SQLite', 'Firebase', 'Metabase'],
  mobile: ['Swift', 'SwiftUI', 'UIKit', 'Combine'],
  tooling: ['n8n', 'NixOS', 'Git'],
};
