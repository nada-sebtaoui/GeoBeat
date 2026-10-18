# Field Agent Map

**Interactive field-ops map for commercial agents** — plan a day of client visits on an OpenStreetMap canvas, then compute an optimized driving route from the agent’s live (or simulated) position.

> Built as a frontend case study: maps, geolocation, third-party routing APIs, and a real operational workflow — not a CRUD tutorial.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com)
[![Zustand](https://img.shields.io/badge/Zustand-4-black)](https://github.com/pmndrs/zustand)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)

The product UI is in **French**, with sample clients around **Tunis**. Source and this README are written so a recruiter can clone, run, and judge the code in a few minutes.

---

## Why this project

Field sales and support agents often visit several clients in one day with no shared view of *where* they are, *in which order* to go, or *how long* the loop will take.

This app models that job on a single screen:

| Without it | With Field Agent Map |
| --- | --- |
| Addresses in a spreadsheet | Clients pinned on a dark OSM map |
| Visits in whatever order they were typed | Optimized stop order + road geometry |
| No sense of remaining work | Distance, duration, and visit progress |

It is a **frontend prototype** (no backend): clients live in `localStorage`, GPS can be simulated for demos, and routing goes through [OpenRouteService](https://openrouteservice.org).

---

## What you can do in the UI

- **Interactive map** (Leaflet + OpenStreetMap) centered on Tunis, with a dark cartographic theme
- **Agent marker** with a live pulse; recenter on the agent in one click
- **GPS** — browser `watchPosition` in production, or a Tunis simulation in development (`VITE_SIMULATE_GPS`)
- **Client portfolio** — 8 mock B2B accounts (priority, status, notes, phone)
- **Add a client** — form + address geocoding (Tunisia / `TN` boundary)
- **Visit workflow** — pending → visited / skipped, with matching marker colors
- **Optimize my day** — Vehicle Routing Problem via OpenRouteService, then a driving directions polyline
- **Day stats** — km, minutes, visited/total, progress bar
- **Graceful fallback** — without an ORS key, stops are ordered by priority (high → medium → low)

---

## Tech stack

| Layer | Choice | Role |
| --- | --- | --- |
| UI | React 18, TypeScript, Vite | SPA, strict types, fast DX |
| Map | Leaflet, react-leaflet, OSM tiles | Markers, popups, polylines |
| Routing / geocoding | OpenRouteService REST API (axios) | VRP optimization, driving directions, search |
| Client state | Zustand | Agent position, clients, route geometry |
| Server state | TanStack Query | Optimization mutation, loading & error |
| Persistence | `localStorage` | Clients survive a refresh |
| Styling | Tailwind CSS + custom dark theme | Sidebar, badges, map overlays |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  App                                                    │
│  ├── Sidebar (list, actions, stats)                     │
│  └── MapView (OSM + markers + route)                    │
└──────────────┬──────────────────────────┬───────────────┘
               │                          │
               ▼                          ▼
     Zustand stores                Custom hooks
     • clientStore                 • useGeolocation
     • agentStore                  • useOptimizeRoute
               │                   • useClients
               ▼                          │
     storage.service ◄────────────────────┤
     (localStorage)                       ▼
                                   ors.service (axios)
                                          │
                                          ▼
                              OpenRouteService
                              /optimization
                              /v2/directions/driving-car
                              /geocode/search
```

**Routing pipeline** when the agent clicks *Optimiser ma journée*:

1. Keep only **pending** clients.
2. Build an ORS **optimization** job (one vehicle, `driving-car`, start/end = agent GPS, 15 min service time per stop).
3. Read the ordered job steps and write `visitOrder` on each client.
4. Call **directions** on that sequence to get real road coordinates, distance, and duration.
5. Draw the polyline and update the stats footer.

If the API key is missing, the same button runs a **priority sort** so the demo still works.

---

## Skills this repo is meant to show

- Typed React architecture (stores, hooks, services, presentational components)
- Integrating a geo stack: tiles, markers, geolocation, geocoding, VRP, directions
- Handling third-party API constraints (key, quotas, degraded mode)
- UX for an operational tool (status colors, visit order, day KPIs)
- Demo-friendly GPS simulation so the app is usable without going into the field

---

## Project structure

```
src/
├── components/
│   ├── map/          Map, markers, route, recenter
│   ├── sidebar/      Client list, stats, optimize CTA
│   ├── modals/       Add client, client sheet
│   └── ui/           Button, Badge, Spinner
├── hooks/            Geolocation, clients, optimize
├── services/         ORS API + localStorage
├── store/            Zustand (agent + clients)
├── types/            Shared TypeScript contracts
└── data/             Mock clients (Tunis)
```

---

## Quick start

**Requirements:** Node.js 18+, npm.

```bash
npm install
```

Copy the env file and add a free [OpenRouteService](https://openrouteservice.org/dev/#/signup) key (2 000 requests/day on the free tier):

```bash
cp .env.example .env
```

```env
VITE_ORS_API_KEY=your_openrouteservice_api_key_here
VITE_SIMULATE_GPS=true
VITE_DEFAULT_LAT=36.8065
VITE_DEFAULT_LNG=10.1815
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Without a key, the map, clients, GPS simulation, and priority-based ordering still work. Road geometry and true ETAs need ORS.

| Script | Command |
| --- | --- |
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Preview build | `npm run preview` |

---

## Design notes (worth opening in a review)

- **Dev vs prod GPS** — `import.meta.env.DEV` + `VITE_SIMULATE_GPS` so demos stay in Tunis; production uses the browser Geolocation API and falls back to simulation if the user denies permission.
- **Coordinate order** — ORS expects `[lng, lat]`; Leaflet expects `[lat, lng]`. The polyline layer converts explicitly.
- **Persistence** — Zustand writes the client list to `localStorage` after every add/update/delete so a refresh does not reset the day.
- **No fake “full CRUD” in the UI** — the store supports update/delete; the interface currently adds clients and updates visit status (visited / skipped). That is intentional for a field-day loop.

---

## Possible next steps

- REST backend + auth (today everything is client-side)
- Edit / delete client from the sheet
- Multi-agent fleet and live GPS from a mobile companion
- Offline cache of tiles and last known route
- Automated tests around the optimization mapping (job id ↔ client)

---

## License

MIT — feel free to fork, demo, and discuss in interviews.
