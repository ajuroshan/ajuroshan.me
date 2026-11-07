// Everything the pages say about me. Edit here, not in the pages.
import admissions from '../assets/img/admissions.png';
import hostels from '../assets/img/hostels.png';
import apex from '../assets/img/apex.png';
import esp32 from '../assets/img/esp32.jpg';
import type { ImageMetadata } from 'astro';

export const site = {
  name: 'Ajmal Roshan',
  domain: 'ajmalroshan.dev',
  url: 'https://ajmalroshan.dev',
  email: 'ajuaju0483@gmail.com',
  github: 'ajuroshan',
  linkedin: 'ajuroshan',
  city: 'Kochi',
  country: 'India',
  description:
    'Ajmal Roshan is an engineer in Kochi. He writes the software a university runs on, logs his motorcycle with an ESP32, and keeps one small ARM server doing his chores every morning.',
  tagline: 'Engineer in Kochi. Software a university runs on, hardware for the bike, one small server that runs the rest.',
};

export const box = {
  host: 'arm-free-01',
  place: 'Hyderabad',
  spec: '2 ARM cores, 12 GB, Ubuntu 24.04, Oracle always-free',
};

// What each thing on the box does, in my words. Keyed by the ids that status.json reports.
export const services: Record<string, { label: string; does: string }> = {
  nginx: { label: 'nginx', does: 'serves this page' },
  cloudflared: { label: 'cloudflared', does: 'the tunnel; the only way in from the internet' },
  'hermes-gateway': { label: 'hermes', does: 'my agent, reachable on Telegram' },
  'hermes-dashboard': { label: 'hermes dashboard', does: 'its console, behind Cloudflare Access' },
  'wacli-sync': { label: 'wacli', does: 'mirrors my WhatsApp so the brief can read it' },
  'habit-tracker': { label: 'habit tracker', does: 'a small Django app I check every day' },
  tailscaled: { label: 'tailscale', does: 'the private network between my machines' },
  'actions-runner': { label: 'github runner', does: 'deploys the habit tracker on a release tag' },
  fail2ban: { label: 'fail2ban', does: 'bans anyone who guesses at SSH' },
  'morning-brief': { label: 'morning brief', does: 'cron at 07:00 IST: calendar, mail, WhatsApp, habits, one message' },
};

export type Project = {
  slug: string;
  name: string;
  kind: string;
  year: number;
  group: 'University' | 'Motorcycle' | 'Tools and toys';
  url?: string;
  repo?: string;
  summary: string;
  body: string[];
  stack: string[];
  image?: ImageMetadata;
  imageAlt?: string;
  imageCredit?: string;
};

export const projects: Project[] = [
  {
    slug: 'admissions',
    name: 'CUSAT admissions',
    kind: 'University system',
    year: 2024,
    group: 'University',
    url: 'https://fyugp.cusat.ac.in',
    summary: 'The admission system for the five-year integrated MSc programmes at Cochin University of Science and Technology.',
    body: [
      'Before this, admission to the integrated programmes was a paper form, a counter and a ledger, repeated in more than eight departments. Now it is one site: applicants register, upload documents, pay and track their application; departments rank, verify and publish lists from the same database.',
      'It handles more than ten thousand applications a year and the peak comes all at once, in the two weeks after results. Django and Django REST Framework behind nginx, in Docker, on PostgreSQL.',
    ],
    stack: ['Django', 'DRF', 'PostgreSQL', 'Docker', 'nginx'],
    image: admissions,
    imageAlt: 'The admissions site: the university crest, "Integrated MSc Programmes", and the Apply for Admission button',
  },
  {
    slug: 'hostels',
    name: 'Hostel allotment',
    kind: 'University system',
    year: 2024,
    group: 'University',
    url: 'https://hostels.cusat.ac.in',
    summary: 'Seat allocation for the university hostels, run by a location-priority algorithm instead of a spreadsheet.',
    body: [
      'Three thousand students, a dozen hostels, and rules about who gets priority: distance from home, year of study, programme. The allotment used to take the hostel office weeks. The algorithm does it in a run, with live dashboards so wardens and the central office see the same numbers.',
      'The public site, applications, allotment and the admin side all live in one Django project on PostgreSQL, served by nginx.',
    ],
    stack: ['Django', 'DRF', 'PostgreSQL', 'nginx'],
    image: hostels,
    imageAlt: 'The Central Office for University Hostels site, with its 50 years banner',
  },
  {
    slug: 'messy',
    name: 'Messy',
    kind: 'Mess billing',
    year: 2024,
    group: 'University',
    repo: 'https://github.com/ajuroshan/messy',
    summary: 'Meal attendance and the monthly mess bill for the hostel kitchens, for about two thousand students.',
    body: [
      'Every meal is a check-in. At the end of the month the bill writes itself per student, per hostel, with the reductions the rules allow. It started in one hostel and spread to the others because the wardens asked for it.',
      'Django on SQLite, which is enough; Metabase on top for the reports the office wanted.',
    ],
    stack: ['Django', 'SQLite', 'Metabase'],
  },
  {
    slug: 'sargam',
    name: 'Sargam',
    kind: 'Fest registrations',
    year: 2025,
    group: 'University',
    summary: 'Registration and event management for the university cultural festival.',
    body: [
      'A few hundred people registering at the same minute, on the night registrations open. Django on PostgreSQL on AWS, load-balanced behind nginx for the one week a year it matters.',
    ],
    stack: ['Django', 'PostgreSQL', 'AWS', 'nginx'],
  },
  {
    slug: 'rideloop',
    name: 'rideloop',
    kind: 'Telemetry logger',
    year: 2026,
    group: 'Motorcycle',
    repo: 'https://github.com/ajuroshan/rideloop',
    summary: 'An ESP32-S3 on the bike reads GPS and an IMU, logs everything to an SD card, and serves a live dashboard to the phone on the bars.',
    body: [
      'The logger is the mission; the dashboard is a consumer that is allowed to fail. One core runs the sensor task in hard real time, the IMU at up to 200 Hz and the GPS at 10 Hz, into a ring buffer. The other core drains it to the SD card and serves the WebSocket. If the phone drops off, logging does not notice.',
      'At boot it tries the phone hotspot for eight seconds, then becomes its own access point. Either way the dashboard is at rideloop.local.',
    ],
    stack: ['C++', 'ESP32-S3', 'u-blox GPS', 'BNO085', 'WebSocket'],
    image: esp32,
    imageAlt: 'An ESP32 development board, close up',
    imageCredit: '"ESP32 Dev Board" by Edwiyanto, CC BY-SA 4.0, via Wikimedia Commons',
  },
  {
    slug: 'apex',
    name: 'APEX',
    kind: 'Monochrome bike dashboard',
    year: 2026,
    group: 'Motorcycle',
    repo: 'https://github.com/ajuroshan/apexdash',
    summary: 'An Android dashboard for the handlebars: speed, lean angle and g-force on one black screen.',
    body: [
      'GPS speed with 0–60 and 0–100 timers; lean to sixty degrees each side with the session maxima kept on the dial; a traction circle that plots lateral against longitudinal g with a fading trail; attitude, trip and a ride history drawn to scale.',
      'A bar mount passes engine buzz straight into the phone, and a 50 Hz sensor aliases it into the signal. A one-pole low pass takes it out; the rejected energy is reported as vibration in g RMS, which tells you how rough the mount is.',
    ],
    stack: ['Kotlin', 'Android', 'Sensors'],
    image: apex,
    imageAlt: 'The APEX dashboard: a speed dial, a lean-angle dial reading 15 degrees left, and a g-force circle, white on black',
  },
  {
    slug: 'arm-free-01',
    name: 'arm-free-01',
    kind: 'The box',
    year: 2026,
    group: 'Tools and toys',
    url: '/now/',
    summary: 'One always-free ARM VM in Hyderabad that runs this site, my agent, my morning brief, my habit tracker and a WhatsApp mirror.',
    body: [
      'Two ARM cores and twelve gigabytes, which is more than enough for everything I actually use. Nothing is exposed except a Cloudflare tunnel; everything I need to log in to sits behind Cloudflare Access. Deploys are a symlink swap. The whole thing is on the Now page, read live.',
    ],
    stack: ['Ubuntu', 'systemd', 'Docker', 'Cloudflare', 'Tailscale'],
  },
  {
    slug: 'breaktime',
    name: 'BreakTime',
    kind: 'Windows tray app',
    year: 2026,
    group: 'Tools and toys',
    repo: 'https://github.com/ajuroshan/breaktime',
    summary: 'A 300 KB Rust tray app that makes you look at something far away every twenty minutes.',
    body: [
      'Pure Win32 through windows-sys, no runtime. Every twenty minutes it covers every monitor with a distant landscape whose sky follows your local time; every hour it walks you through a stretch. It notices when you were away or a game is fullscreen, and waits.',
    ],
    stack: ['Rust', 'Win32'],
  },
  {
    slug: 'idea-brain',
    name: 'Idea Brain',
    kind: 'Offline-first journal',
    year: 2026,
    group: 'Tools and toys',
    summary: 'A Flutter idea journal that syncs revisions through Django and publishes linked memories to gbrain.',
    body: [
      'Capture offline, sync when you can, resolve conflicts by keeping both. A graph view of the notes that share a topic. The server side is a durable outbox worker that pushes raw notes and AI interpretations into a personal memory graph.',
    ],
    stack: ['Flutter', 'BLoC', 'Drift', 'Django', 'gbrain'],
  },
  {
    slug: 'not-python',
    name: '!Python',
    kind: 'A tiny compiled language',
    year: 2023,
    group: 'Tools and toys',
    repo: 'https://github.com/ajuroshan/not-python',
    summary: 'A small language and compiler, written in plain Python with no dependencies, to learn how compilers do their magic.',
    body: [
      'LET, PRINT, INPUT, IF, WHILE, RETURN. The compiler emits C++ and hands it to g++. It supports very little, on purpose: the point was to write every stage once.',
    ],
    stack: ['Python', 'C++'],
  },
];

export const tools = {
  Backend: ['Python', 'Django', 'DRF', 'Celery', 'Redis'],
  Infrastructure: ['Linux', 'Docker', 'nginx', 'systemd', 'GitHub Actions', 'Cloudflare', 'OCI', 'AWS'],
  Data: ['PostgreSQL', 'SQLite', 'Metabase'],
  Hardware: ['ESP32', 'C++', 'GPS and IMUs'],
  Apps: ['Swift', 'SwiftUI', 'Kotlin', 'Flutter', 'Rust'],
};
