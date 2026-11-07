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
    'Ajmal Roshan, an engineer in Kochi. Software a university runs on, gadgets for his motorcycle, and notes on keeping small systems running.',
  tagline: 'Engineer in Kochi. Software a university runs on, gadgets for the bike, one small server for the rest.',
};

export const box = {
  host: 'arm-free-01',
  place: 'Hyderabad',
  spec: '2 ARM cores, 12 GB, Ubuntu 24.04, Oracle always-free',
};

// What each thing on the box does, in my words. Keyed by the ids that status.json reports.
// What the System Monitor shows. Only these ids are displayed, in this order; the rest of status.json is ignored.
export const services: Record<string, { label: string; does: string }> = {
  nginx: { label: 'web server', does: 'serves this site' },
  'hermes-gateway': { label: 'assistant', does: 'my agent on Telegram' },
  'habit-tracker': { label: 'habit tracker', does: 'the app I check every day' },
  'morning-brief': { label: 'morning brief', does: 'one message at 07:00' },
};

export type Project = {
  slug: string;
  name: string;
  kind: string;
  year: number;
  group: 'University' | 'Motorcycle' | 'Tools';
  url?: string;
  repo?: string;
  summary: string;
  body: string;
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
    summary: 'Admissions for the integrated MSc programmes at CUSAT.',
    body: 'It replaced paper forms in more than eight departments. Over ten thousand applications a year, most of them in the two weeks after results.',
    stack: ['Django', 'PostgreSQL', 'Docker'],
    image: admissions,
    imageAlt: 'The admissions site with the university crest and an Apply for Admission button',
  },
  {
    slug: 'hostels',
    name: 'Hostel allotment',
    kind: 'University system',
    year: 2024,
    group: 'University',
    url: 'https://hostels.cusat.ac.in',
    summary: 'Hostel seats for three thousand students, allotted by an algorithm instead of a spreadsheet.',
    body: 'What took the hostel office weeks now takes one run, and wardens see the same numbers the office does.',
    stack: ['Django', 'PostgreSQL'],
    image: hostels,
    imageAlt: 'The Central Office for University Hostels site',
  },
  {
    slug: 'messy',
    name: 'Messy',
    kind: 'Mess billing',
    year: 2024,
    group: 'University',
    repo: 'https://github.com/ajuroshan/messy',
    summary: 'Meal check-ins and the monthly mess bill for about two thousand students.',
    body: 'It started in one hostel and spread to the others because the wardens asked for it.',
    stack: ['Django', 'SQLite'],
  },
  {
    slug: 'rideloop',
    name: 'rideloop',
    kind: 'Telemetry logger',
    year: 2026,
    group: 'Motorcycle',
    repo: 'https://github.com/ajuroshan/rideloop',
    summary: 'An ESP32 on the bike logs GPS and motion to an SD card and streams a live view to the phone on the bars.',
    body: 'Logging comes first. If the phone drops off, the logger does not notice.',
    stack: ['C++', 'ESP32-S3'],
    image: esp32,
    imageAlt: 'An ESP32 development board, close up',
    imageCredit: '"ESP32 Dev Board" by Edwiyanto, CC BY-SA 4.0, via Wikimedia Commons',
  },
  {
    slug: 'apex',
    name: 'APEX',
    kind: 'Bike dashboard',
    year: 2026,
    group: 'Motorcycle',
    repo: 'https://github.com/ajuroshan/apexdash',
    summary: 'A black-and-white Android dashboard: speed, lean angle and g-force on one screen.',
    body: 'Its vibration filter has its own note: <a href="/blog/handlebar-vibration/">engine buzz on a handlebar phone</a>.',
    stack: ['Android'],
    image: apex,
    imageAlt: 'The APEX dashboard: speed dial, lean angle of 15 degrees left, and a g-force circle',
  },
  {
    slug: 'breaktime',
    name: 'BreakTime',
    kind: 'Windows app',
    year: 2026,
    group: 'Tools',
    repo: 'https://github.com/ajuroshan/breaktime',
    summary: 'A 300 KB Rust tray app that makes you look at something far away every twenty minutes.',
    body: 'Every break shows a distant landscape whose sky follows your local time.',
    stack: ['Rust'],
  },
];
