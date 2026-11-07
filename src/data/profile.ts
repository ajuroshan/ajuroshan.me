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
    "Ajmal Roshan's corner of the internet. Backend code, a motorcycle with too many sensors, and one tiny server that runs his mornings.",
  tagline: 'Backend code, a bike with too many sensors, and one tiny server that runs my mornings.',
};

export const box = {
  host: 'arm-free-01',
  place: 'Hyderabad',
  spec: '2 ARM cores, 12 GB, Ubuntu 24.04, Oracle always-free',
};

// What each thing on the box does, in my words. Keyed by the ids that status.json reports.
// What the System Monitor shows. Only these ids are displayed, in this order; the rest of status.json is ignored.
export const services: Record<string, { label: string; does: string }> = {
  nginx: { label: 'web server', does: 'serving you this page right now' },
  'hermes-gateway': { label: 'my assistant', does: 'answers me on Telegram, mostly about my calendar' },
  'habit-tracker': { label: 'habit tracker', does: 'quietly judging my gym attendance' },
  'morning-brief': { label: 'morning brief', does: 'texts me my whole day at 7 am' },
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
    summary: `The site ten thousand students fight with every admission season.`,
    body: `This used to be paper forms in eight different departments. Now it's one site, and I'm the guy who gets the call when results drop and everyone logs in at the same minute.`,
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
    summary: `Decides who gets which hostel room. An algorithm does it now, not whoever reached the office first.`,
    body: `Three thousand students, and distance from home decides who goes first. The wardens still argue, but at least they argue with the same numbers.`,
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
    summary: `Counts every meal in the hostel mess and sends the bill at the end of the month.`,
    body: `I built it for my own hostel. Then the other hostels wanted it too, and that's how I ended up maintaining it.`,
    stack: ['Django', 'SQLite'],
  },
  {
    slug: 'rideloop',
    name: 'rideloop',
    kind: 'Telemetry logger',
    year: 2026,
    group: 'Motorcycle',
    repo: 'https://github.com/ajuroshan/rideloop',
    summary: `A little ESP32 strapped to my bike that logs GPS, speed and lean angle.`,
    body: `It keeps writing to the SD card even when my phone dies, which is the whole point. And yes, I check my lean angle after every ride.`,
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
    summary: `Turns my phone into a dark, nerdy speedometer on the handlebars.`,
    body: `Speed, lean angle with the session maximum on the dial, and a g-force circle. It also filters out engine buzz and reports it as a vibration number.`,
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
    summary: `A tiny Windows app that nags me to look away from the screen every twenty minutes.`,
    body: `300 KB of Rust that shows me a far-away mountain so my eyes get a break. I hit Skip more often than I should.`,
    stack: ['Rust'],
  },
];
