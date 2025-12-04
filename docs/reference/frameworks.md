# Supported Frameworks

Tafil automatically detects these frameworks and configurations.

## Frontend Frameworks

| Framework | Detection | Default Port |
|-----------|-----------|--------------|
| React | `react` in dependencies | 3000 |
| Vue | `vue` in dependencies | 8080 |
| Angular | `@angular/core` in dependencies | 4200 |
| Svelte | `svelte` in dependencies | 5000 |
| Solid | `solid-js` in dependencies | 3000 |

## Meta Frameworks

| Framework | Detection | Default Port |
|-----------|-----------|--------------|
| Next.js | `next` in dependencies | 3000 |
| Nuxt | `nuxt` in dependencies | 3000 |
| Remix | `@remix-run` in dependencies | 3000 |
| Gatsby | `gatsby` in dependencies | 8000 |
| Astro | `astro` in dependencies | 3000 |

## Build Tools

| Tool | Detection | Default Port |
|------|-----------|--------------|
| Vite | `vite` in dependencies | 5173 |
| Webpack | `webpack` in dependencies | 8080 |
| Parcel | `parcel` in dependencies | 1234 |

## Backend Frameworks

| Framework | Detection | Default Port |
|-----------|-----------|--------------|
| Express | `express` in dependencies | 3000 |
| NestJS | `@nestjs/core` in dependencies | 3000 |
| Fastify | `fastify` in dependencies | 3000 |
| Koa | `koa` in dependencies | 3000 |
| Hapi | `@hapi/hapi` in dependencies | 3000 |

## Start Scripts

Tafil looks for these scripts in `package.json`:

1. `dev` - Development server
2. `start` - Production/dev server
3. `serve` - Static server

Priority order: `dev` > `start` > `serve`

## Custom Detection

If your project uses a framework not listed, Tafil will:
1. Show it as "Node.js"
2. Still detect and run npm scripts
3. Work with any valid package.json

