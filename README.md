# ajuroshan.me

Personal site. Astro (static) + nginx on the OCI always-free VM.

```bash
npm i
npm run dev        # http://localhost:4321
npm run deploy     # hotfix: build + deploy the working tree directly
```

- Profile, experience, projects, stack: `src/data/profile.ts`
- Posts: `src/content/blog/*.md` (frontmatter: title, description, date, tags, draft)
- Server: `/var/www/ajuroshan.me/{releases,current}`, nginx site `/etc/nginx/sites-available/ajuroshan.me`
- Rollback: `ssh oci 'cd /var/www/ajuroshan.me && ls releases && ln -sfn releases/<old> current'`

## Releases

Deploys to production happen **only from tags**. `main` pushes and PRs just build (`ci.yml`).

```bash
npm run release:patch   # 0.1.0 -> 0.1.1  (content / fixes)
npm run release:minor   # 0.1.x -> 0.2.0  (new sections / features)
npm run release:major   # breaking redesigns
```

Each runs `npm version`, which bumps `package.json`, commits `release vX.Y.Z` and tags `vX.Y.Z`,
then pushes with `--follow-tags`. The tag triggers `release.yml`:

1. build (fails if the tag and `package.json` disagree)
2. GitHub Release with auto-generated notes + `ajuroshan.me-vX.Y.Z.tar.gz`
3. deploy that exact tarball to the OCI box, then smoke-test that the version is live

The running version is shown in the status bar and links to its release.
Redeploy an older release: Actions → release → Run workflow → `vX.Y.Z`.
Tags matching `v*` are protected: they can't be deleted or moved.
