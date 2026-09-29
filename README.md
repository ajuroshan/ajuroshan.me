# ajuroshan.me

Personal site. Astro (static) + nginx on the OCI always-free VM.

```bash
npm i
npm run dev        # http://localhost:4321
npm run deploy     # build + rsync to `ssh oci`, atomic symlink swap
```

- Profile, experience, projects, stack: `src/data/profile.ts`
- Posts: `src/content/blog/*.md` (frontmatter: title, description, date, tags, draft)
- Server: `/var/www/ajuroshan.me/{releases,current}`, nginx site `/etc/nginx/sites-available/ajuroshan.me`
- Rollback: `ssh oci 'cd /var/www/ajuroshan.me && ls releases && ln -sfn releases/<old> current'`
