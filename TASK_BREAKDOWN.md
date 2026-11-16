# StreamVerse — Detailed Task Breakdown & Team Assignment

**Project Title:** StreamVerse: A Netflix-Style Video Streaming Platform  
**Course & Section:** Web Programming (Section BDS-7A)  
**Milestone:** Deliverable 1 (Complete React.js Frontend & Core MERN Architecture — 50%+ Project Scope)

---

## 1. Team Members & Overall Split

| Member | Roll Number | GitHub Username | Email | Assigned Share | Total Commits |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Haris Hassaan** | 23L-2642 | `Haris3969` | `harishassaan2004@gmail.com` | **50%** (10 Modules) | **10 Commits** |
| **Hashir Nadeem** | 23L-2544 | `hashnadeem` | `nadeemhashir53@gmail.com` | **50%** (10 Modules) | **10 Commits** |

---

## 2. High-Level Responsibility Matrix

To ensure both members have an equal, end-to-end understanding of the codebase for project evaluation, responsibilities are split across **Frontend UI**, **State Management**, **Core User Flows**, and **Backend API Foundations**:

### Haris Hassaan (`Haris3969`) — 50% Ownership
1. **Global Design System & Theme Architecture** (`variables.css`, `global.css`, `main.jsx`)
2. **Catalogue Seed Data & Subscription Tier Definitions** (`seedCatalog.js`, `subscriptionPlans.js`)
3. **Client Authentication State & Login/Signup Flows** (`AuthContext.jsx`, `LoginPage.jsx`, `SignupPage.jsx`, `auth.css`)
4. **Multi-Profile Management & Kids Mode Restrictions** (`ProfilesPage.jsx`, `profiles.css`)
5. **Hero Banner, Content Row Carousels & Title Cards** (`HeroBanner.jsx`, `ContentRow.jsx`, `TitleCard.jsx`, `home.css`)
6. **Title Details Page, Season/Episode Selector & Trailer Modal** (`TitleDetailsPage.jsx`, `details.css`)
7. **Interactive Star Ratings & Community Reviews System** (`ReviewSection.jsx`)
8. **Personal Watchlist (`My List`) & Resume History Page** (`MyListPage.jsx`)
9. **Role-Based Admin Dashboard (Content CRUD, Episode Manager & User Control)** (`AdminDashboard.jsx`, `admin.css`)
10. **Project Documentation & Setup Guide** (`README.md`)

---

### Hashir Nadeem (`hashnadeem`) — 50% Ownership
1. **Workspace Initialization, Build Tooling & Vite Proxy Configuration** (`.gitignore`, `client/package.json`, `vite.config.js`, `index.html`)
2. **Express Server Setup, MongoDB Connection & Mongoose Data Models** (`server.js`, `User.js`, `Title.js`, `Review.js`)
3. **Backend JWT Authentication Middleware & Auth Controllers** (`authMiddleware.js`, `authController.js`, `authRoutes.js`)
4. **Navigation Chrome, Profile Switcher Dropdown, Footer & Route Guards** (`Navbar.jsx`, `Footer.jsx`, `ProtectedRoute.jsx`, `navbar.css`)
5. **Catalogue Context Provider, Kids Filtering Logic & Home Page Assembly** (`StreamContext.jsx`, `HomePage.jsx`)
6. **Real-Time Search & Multi-Criteria Filter Engine** (`BrowsePage.jsx`, `browse.css`)
7. **Backend HTTP 206 Range-Request Video Streaming & Catalogue API** (`streamController.js`, `catalogController.js`, `catalogRoutes.js`)
8. **Custom HTML5 Video Player (Seek, Speed, Volume, Episode Drawer & Auto-Resume)** (`WatchPage.jsx`, `player.css`)
9. **Simulated Subscription Plans & Mock Checkout Flow** (`PlansPage.jsx`, `plans.css`)
10. **Application Router Wiring & Layout Integration** (`App.jsx`)

---

## 3. Detailed Module-by-Module Breakdown

---

### Part A — Tasks Assigned to Haris Hassaan (`Haris3969`)

#### Task H1: Global Design System & Base Responsive Styling
- **Assigned To:** Haris Hassaan (`harishassaan2004@gmail.com`)
- **Files Created:**
  - `client/src/styles/variables.css`
  - `client/src/styles/global.css`
  - `client/src/main.jsx`
- **What Was Done:**
  - Defined CSS custom properties (`--bg-primary`, `--brand-red`, `--accent-gold`, `--accent-kids`, spacing, border radii, shadows, and transitions).
  - Created reusable utility classes for buttons (`.btn-primary`, `.btn-light`, `.btn-secondary`, `.btn-outline`), maturity/quality badges (`.badge-maturity`, `.badge-hd`, `.badge-kids`), and custom scrollbars.
  - Bootstrapped the React 18 root with `BrowserRouter` in `main.jsx`.

#### Task H2: Catalogue Seed Dataset & Subscription Plan Configuration
- **Assigned To:** Haris Hassaan (`harishassaan2004@gmail.com`)
- **Files Created:**
  - `client/src/data/seedCatalog.js`
  - `client/src/data/subscriptionPlans.js`
- **What Was Done:**
  - Structured 9 movies and multi-episode TV series (`INITIAL_TITLES`) with genres, maturity ratings (`G`, `PG`, `TV-Y`, `PG-13`, `TV-14`, `R`, `TV-MA`), `isKidsSafe` flags, cast lists, posters, backdrops, and MP4 streams.
  - Added multi-season episode lists for TV series (*Chrono Nexus: Eclipse*, *Starlight Academy*, *The Grand Silk Kitchen*, *Checkmate in Vienna*).
  - Defined the 3 subscription plans (**Basic** PKR 450 / 480p / 1 profile, **Standard** PKR 800 / 1080p / 2 profiles, **Premium** PKR 1,100 / 4K HDR / 4 profiles).

#### Task H3: Client Authentication State & Login/Signup Screens
- **Assigned To:** Haris Hassaan (`harishassaan2004@gmail.com`)
- **Files Created:**
  - `client/src/context/AuthContext.jsx`
  - `client/src/pages/LoginPage.jsx`
  - `client/src/pages/SignupPage.jsx`
  - `client/src/styles/auth.css`
- **What Was Done:**
  - Built `AuthContext` to manage user accounts, active sessions, active profiles, subscription plan upgrades, `myList` toggling, and per-profile `continueWatching` timestamps in `localStorage`.
  - Pre-configured default evaluation accounts for **Haris Hassaan (Admin / Premium)** and **Hashir Nadeem (User / Standard)**.
  - Built `LoginPage` (including 1-click quick evaluation login buttons) and `SignupPage` with role and subscription tier selection.

#### Task H4: Multi-Profile Selector & Kids Mode Restrictions
- **Assigned To:** Haris Hassaan (`harishassaan2004@gmail.com`)
- **Files Created:**
  - `client/src/pages/ProfilesPage.jsx`
  - `client/src/styles/profiles.css`
- **What Was Done:**
  - Built the *"Who's watching?"* profile switcher supporting up to 4 profiles per account.
  - Enforced subscription tier profile limits (Basic = 1, Standard = 2, Premium = 4) with an upgrade prompt when the limit is reached.
  - Added profile creation modal with color swatches, emoji avatars, and a **Kids Profile** toggle (`isKids: true`), plus a *Manage Profiles* deletion mode.

#### Task H5: Hero Banner, Horizontal Carousels & Interactive Title Cards
- **Assigned To:** Haris Hassaan (`harishassaan2004@gmail.com`)
- **Files Created:**
  - `client/src/components/HeroBanner.jsx`
  - `client/src/components/ContentRow.jsx`
  - `client/src/components/TitleCard.jsx`
  - `client/src/styles/home.css`
- **What Was Done:**
  - Created `HeroBanner` showcasing the featured title with maturity rating, match percentage, star score, and quick Play / More Info / My List actions.
  - Built `ContentRow` with smooth left/right horizontal scroll buttons.
  - Built `TitleCard` with hover action overlays (Play, Add/Remove My List, Details) and a red bottom progress bar for partially watched titles.

#### Task H6: Title Details Page, Episode Selector & Official Trailer Modal
- **Assigned To:** Haris Hassaan (`harishassaan2004@gmail.com`)
- **Files Created:**
  - `client/src/pages/TitleDetailsPage.jsx`
  - `client/src/styles/details.css`
- **What Was Done:**
  - Created the detailed showcase page displaying backdrop art, poster, synopsis, genres, cast, director, and maturity rating.
  - Added a Kids Mode safety check that blocks direct URL access to mature titles when a Kids profile is active.
  - Built the interactive **Season & Episode Selector** for TV series so clicking any episode launches that specific stream in the player.
  - Added an interactive **Official Trailer Modal** with HTML5 video playback.

#### Task H7: Interactive Star Ratings & Community Reviews
- **Assigned To:** Haris Hassaan (`harishassaan2004@gmail.com`)
- **Files Created:**
  - `client/src/components/ReviewSection.jsx`
- **What Was Done:**
  - Built the 1–5 star rating picker and review submission form attributed to the active viewing profile.
  - Connected review submission to `StreamContext.addReview()` so the title's average star rating and review count recalculate immediately across the entire app.

#### Task H8: Personal Watchlist (`My List`) & Continue Watching History Page
- **Assigned To:** Haris Hassaan (`harishassaan2004@gmail.com`)
- **Files Created:**
  - `client/src/pages/MyListPage.jsx`
- **What Was Done:**
  - Built `/my-list` to display all bookmarked movies and series for the currently active profile, alongside a dedicated section for resuming in-progress titles.

#### Task H9: Administrator Dashboard (Content CRUD, Episodes & User Management)
- **Assigned To:** Haris Hassaan (`harishassaan2004@gmail.com`)
- **Files Created:**
  - `client/src/pages/AdminDashboard.jsx`
  - `client/src/styles/admin.css`
- **What Was Done:**
  - Built top-level platform analytics cards (Registered Accounts, Total Viewing Profiles, Library Breakdown, Total Streams, Most-Watched Title).
  - Created **Tab 1 (Movies & Series CRUD)** for adding new titles, editing existing metadata/URLs, and deleting titles.
  - Created **Tab 2 (Series Episode Manager)** for appending new episodes to any existing TV series.
  - Created **Tab 3 (User & Role Management)** to toggle `USER` / `ADMIN` privileges and suspend/activate accounts.

#### Task H10: Project Documentation & Architecture Guide
- **Assigned To:** Haris Hassaan (`harishassaan2004@gmail.com`)
- **Files Created:**
  - `README.md`
- **What Was Done:**
  - Documented the project scope, feature list, directory structure, team details, and local execution instructions.

---

### Part B — Tasks Assigned to Hashir Nadeem (`hashnadeem`)

#### Task N1: Workspace Initialization & Vite Frontend Configuration
- **Assigned To:** Hashir Nadeem (`nadeemhashir53@gmail.com`)
- **Files Created:**
  - `.gitignore`
  - `client/package.json`
  - `client/vite.config.js`
  - `client/index.html`
- **What Was Done:**
  - Set up the repository `.gitignore`, React + React Router dependencies, Google Fonts (`Inter` and `Bebas Neue`), and Vite dev server configuration with `/api` proxy support.

#### Task N2: Express API Server, MongoDB Connection & Mongoose Schemas
- **Assigned To:** Hashir Nadeem (`nadeemhashir53@gmail.com`)
- **Files Created:**
  - `server/package.json`
  - `server/server.js`
  - `server/models/User.js`
  - `server/models/Title.js`
  - `server/models/Review.js`
- **What Was Done:**
  - Configured the Node.js + Express REST API server with CORS, JSON body parsing, `/api/health` diagnostics, and MongoDB connection handling.
  - Designed Mongoose schemas for `User` (with embedded `profiles`, `myList`, `continueWatching`, and max-4 profile validation), `Title` (with embedded `episodes`), and `Review`.

#### Task N3: Backend JWT Authentication Middleware & Auth Routes
- **Assigned To:** Hashir Nadeem (`nadeemhashir53@gmail.com`)
- **Files Created:**
  - `server/middleware/authMiddleware.js`
  - `server/controllers/authController.js`
  - `server/routes/authRoutes.js`
- **What Was Done:**
  - Implemented `protect` (JWT Bearer token verification) and `requireAdmin` role-guard middleware.
  - Implemented `/api/auth/signup` and `/api/auth/login` controllers using `bcryptjs` password hashing and `jsonwebtoken` signing.

#### Task N4: Responsive Navbar, Profile Switcher Dropdown, Footer & Route Guards
- **Assigned To:** Hashir Nadeem (`nadeemhashir53@gmail.com`)
- **Files Created:**
  - `client/src/components/Navbar.jsx`
  - `client/src/components/Footer.jsx`
  - `client/src/components/ProtectedRoute.jsx`
  - `client/src/styles/navbar.css`
- **What Was Done:**
  - Built the sticky `Navbar` with scroll-aware glassmorphism, quick search bar, active resolution badge (`480p SD` / `1080p FHD` / `4K HDR`), `KIDS MODE` indicator, and instant profile-switching dropdown menu.
  - Built `ProtectedRoute` to guard authenticated pages and restrict `/admin` exclusively to admin users.
  - Built the responsive `Footer` with navigation links and BDS-7A team credits.

#### Task N5: Catalogue Context Provider, Kids Filtering & Home Page Assembly
- **Assigned To:** Hashir Nadeem (`nadeemhashir53@gmail.com`)
- **Files Created:**
  - `client/src/context/StreamContext.jsx`
  - `client/src/pages/HomePage.jsx`
- **What Was Done:**
  - Implemented `StreamContext` to manage catalogue state, view counters, review aggregation, and automatic `visibleTitles` filtering whenever a Kids profile is active.
  - Assembled `HomePage` combining `HeroBanner`, Kids Mode status banner, *Continue Watching* row (with progress map), *My List*, *Trending Now*, *New Releases*, *Top Rated*, and genre rows.

#### Task N6: Search & Multi-Criteria Filter Page
- **Assigned To:** Hashir Nadeem (`nadeemhashir53@gmail.com`)
- **Files Created:**
  - `client/src/pages/BrowsePage.jsx`
  - `client/src/styles/browse.css`
- **What Was Done:**
  - Built the `/browse` catalogue explorer supporting real-time keyword search (by title, synopsis, or cast) synchronized with URL query parameters (`?q=`).
  - Added simultaneous filtering by **Genre chips**, **Media Type** (`All` / `Movie` / `Series`), **Release Year**, **Minimum Rating**, and **Sort Order** (*Most Watched*, *Highest Rated*, *Newest*, *A–Z*).

#### Task N7: Express HTTP Range-Request Video Streaming & Catalogue API
- **Assigned To:** Hashir Nadeem (`nadeemhashir53@gmail.com`)
- **Files Created:**
  - `server/controllers/streamController.js`
  - `server/controllers/catalogController.js`
  - `server/routes/catalogRoutes.js`
- **What Was Done:**
  - Implemented `streamVideoChunk` supporting `HTTP 206 Partial Content` range headers (`bytes=start-end`) in 1MB chunks for smooth video seeking.
  - Implemented REST endpoints for querying catalogue titles, creating new titles (admin-protected), and posting user reviews.

#### Task N8: Custom HTML5 Video Player & Playback Progress Persistence
- **Assigned To:** Hashir Nadeem (`nadeemhashir53@gmail.com`)
- **Files Created:**
  - `client/src/pages/WatchPage.jsx`
  - `client/src/styles/player.css`
- **What Was Done:**
  - Built the custom full-viewport video player (`/watch/:id`) with Play/Pause, `-10s` / `+10s` skip buttons, interactive range seek bar, live timestamp formatting, volume slider, mute toggle, playback speed selector (`0.75x`–`1.5x`), and Fullscreen API integration.
  - Added an in-player **Episode Drawer** for switching TV series episodes and automatic checkpoint saving to `Continue Watching` every 5 seconds.

#### Task N9: Simulated Subscription Plans & Mock Checkout Modal
- **Assigned To:** Hashir Nadeem (`nadeemhashir53@gmail.com`)
- **Files Created:**
  - `client/src/pages/PlansPage.jsx`
  - `client/src/styles/plans.css`
- **What Was Done:**
  - Built `/plans` comparing Basic, Standard, and Premium tiers with an interactive **Simulated Checkout Modal** that updates the user's active subscription plan, profile limit, and streaming quality badge.

#### Task N10: Application Router Wiring & Chrome Visibility Logic
- **Assigned To:** Hashir Nadeem (`nadeemhashir53@gmail.com`)
- **Files Created:**
  - `client/src/App.jsx`
- **What Was Done:**
  - Wired all public, authenticated, and admin-only routes inside `App.jsx` and configured automatic hiding of `Navbar`/`Footer` on full-screen player (`/watch/:id`) and auth screens.

---

## 4. Planned 20-Commit Schedule (6 Nov 2026 – 8 Nov 2026)

| # | Date & Time (PKT) | Author | Commit Message | Files Included |
| :-: | :--- | :--- | :--- | :--- |
| 1 | Fri, 6 Nov 2026 `10:18` | **Hashir Nadeem** | `chore: initialize StreamVerse MERN workspace and frontend Vite configuration` | `.gitignore`, `client/package.json`, `client/vite.config.js`, `client/index.html` |
| 2 | Fri, 6 Nov 2026 `11:04` | **Haris Hassaan** | `style: configure global Netflix-inspired dark theme tokens and base responsive styles` | `client/src/styles/variables.css`, `client/src/styles/global.css`, `client/src/main.jsx` |
| 3 | Fri, 6 Nov 2026 `14:27` | **Hashir Nadeem** | `feat(server): set up Express API server, MongoDB connection, and Mongoose schemas` | `server/package.json`, `server/server.js`, `server/models/*.js` |
| 4 | Fri, 6 Nov 2026 `15:39` | **Haris Hassaan** | `feat(data): add initial catalog seed dataset for movies, series, episodes, and plans` | `client/src/data/seedCatalog.js`, `client/src/data/subscriptionPlans.js` |
| 5 | Fri, 6 Nov 2026 `20:12` | **Hashir Nadeem** | `feat(auth): implement JWT authentication middleware and user auth API routes` | `server/middleware/authMiddleware.js`, `server/controllers/authController.js`, `server/routes/authRoutes.js` |
| 6 | Fri, 6 Nov 2026 `22:45` | **Haris Hassaan** | `feat(auth): create AuthContext provider and login/signup pages with role support` | `client/src/context/AuthContext.jsx`, `client/src/pages/LoginPage.jsx`, `client/src/pages/SignupPage.jsx`, `client/src/styles/auth.css` |
| 7 | Sat, 7 Nov 2026 `09:34` | **Haris Hassaan** | `feat(profiles): build multi-profile selector with Kids mode restriction and plan limits` | `client/src/pages/ProfilesPage.jsx`, `client/src/styles/profiles.css` |
| 8 | Sat, 7 Nov 2026 `10:52` | **Hashir Nadeem** | `feat(layout): implement responsive Navbar with profile switcher, search bar, and ProtectedRoute` | `client/src/components/Navbar.jsx`, `client/src/components/Footer.jsx`, `client/src/components/ProtectedRoute.jsx`, `client/src/styles/navbar.css` |
| 9 | Sat, 7 Nov 2026 `13:28` | **Haris Hassaan** | `feat(home): add HeroBanner and horizontal ContentRow carousel components` | `client/src/components/HeroBanner.jsx`, `client/src/components/ContentRow.jsx`, `client/src/components/TitleCard.jsx`, `client/src/styles/home.css` |
| 10 | Sat, 7 Nov 2026 `14:49` | **Hashir Nadeem** | `feat(home): assemble HomePage with genre rows, Kids filtering, and continue watching row` | `client/src/context/StreamContext.jsx`, `client/src/pages/HomePage.jsx` |
| 11 | Sat, 7 Nov 2026 `18:05` | **Hashir Nadeem** | `feat(browse): implement Search and Filter page by genre, media type, year, and rating` | `client/src/pages/BrowsePage.jsx`, `client/src/styles/browse.css` |
| 12 | Sat, 7 Nov 2026 `19:22` | **Haris Hassaan** | `feat(details): create TitleDetailsPage with episode selector, cast info, and trailer modal` | `client/src/pages/TitleDetailsPage.jsx`, `client/src/styles/details.css` |
| 13 | Sat, 7 Nov 2026 `22:38` | **Haris Hassaan** | `feat(reviews): add interactive star ratings and user review submission on titles` | `client/src/components/ReviewSection.jsx` |
| 14 | Sat, 7 Nov 2026 `23:47` | **Hashir Nadeem** | `feat(stream): add Express HTTP range-request video streaming controller and catalog API` | `server/controllers/streamController.js`, `server/controllers/catalogController.js`, `server/routes/catalogRoutes.js` |
| 15 | Sun, 8 Nov 2026 `09:15` | **Hashir Nadeem** | `feat(player): build custom HTML5 video player with seek, speed, quality, and resume tracking` | `client/src/pages/WatchPage.jsx`, `client/src/styles/player.css` |
| 16 | Sun, 8 Nov 2026 `10:31` | **Haris Hassaan** | `feat(watchlist): add MyListPage and per-profile playback progress persistence` | `client/src/pages/MyListPage.jsx` |
| 17 | Sun, 8 Nov 2026 `13:12` | **Hashir Nadeem** | `feat(subscriptions): implement simulated subscription plans and mock checkout flow` | `client/src/pages/PlansPage.jsx`, `client/src/styles/plans.css` |
| 18 | Sun, 8 Nov 2026 `14:36` | **Haris Hassaan** | `feat(admin): build AdminDashboard for content CRUD, episode management, and user stats` | `client/src/pages/AdminDashboard.jsx`, `client/src/styles/admin.css` |
| 19 | Sun, 8 Nov 2026 `16:42` | **Hashir Nadeem** | `fix(router): wire application routes, kids profile guard, and responsive mobile layout` | `client/src/App.jsx` |
| 20 | Sun, 8 Nov 2026 `17:24` | **Haris Hassaan** | `docs: add comprehensive README with architecture, setup guide, and team contributions` | `README.md` |



---

## 5. Module 2 (Deliverable 2 — Remaining 50% Final Milestone) Task Breakdown & Assignment Table

For **Module 2 (Final Submission)**, the remaining 50% of the project (live MongoDB persistence, full Express REST controllers, Multer + Cloudinary media upload pipeline, end-to-end HTTP 206 streaming integration, and production polish) is divided evenly between **Haris Hassaan** (6 modules) and **Hashir Nadeem** (6 modules):

| Task ID | Module 2 Task Name | Assigned Member | Target Files (Create / Update) | Description & Deliverable Scope |
| :---: | :--- | :--- | :--- | :--- |
| **M2-01** | MongoDB Database Seeder Script & DB Config | **Hashir Nadeem** | `server/config/db.js`, `server/seed/seedDatabase.js`, `server/.env.example` | Build automated CLI seeder (`npm run seed`) to populate MongoDB with initial users, hashed passwords, 9 titles, episodes, and reviews. |
| **M2-02** | Frontend API Service Layer & JWT Interceptor | **Haris Hassaan** | `client/src/services/apiClient.js`, `client/src/context/AuthContext.jsx` | Create centralized HTTP client that attaches `Authorization: Bearer <token>` and connects login, signup, and session validation to live Express APIs. |
| **M2-03** | Backend Multi-Profile & `My List` Persistence API | **Haris Hassaan** | `server/controllers/profileController.js`, `server/routes/userRoutes.js` | Implement REST endpoints to create/delete viewing profiles (enforcing plan profile limits in MongoDB) and toggle `myList` items per profile. |
| **M2-04** | Backend `Continue Watching` & Subscription Checkout API | **Hashir Nadeem** | `server/controllers/subscriptionController.js`, `server/routes/userRoutes.js` | Implement endpoints to save playback progress (`progressSeconds`, `durationSeconds`, `episodeId`) and persist subscription plan upgrades in MongoDB. |
| **M2-05** | Live Catalogue Search, Filter & Kids Mode Query API | **Hashir Nadeem** | `server/controllers/catalogController.js`, `client/src/context/StreamContext.jsx` | Upgrade `GET /api/catalog` with MongoDB regex search, genre/type/year/rating filters, and server-side Kids Mode enforcement connected to `StreamContext`. |
| **M2-06** | Multer + Cloudinary Poster & Video Upload Pipeline | **Haris Hassaan** | `server/config/cloudinary.js`, `server/middleware/uploadMiddleware.js`, `server/controllers/uploadController.js`, `server/routes/uploadRoutes.js` | Build multipart upload pipeline (`POST /api/upload/media`) using Multer and Cloudinary (with local disk fallback) for movie posters and MP4 videos. |
| **M2-07** | Admin Dashboard Cloud Upload UI & Live CRUD Wiring | **Haris Hassaan** | `client/src/pages/AdminDashboard.jsx`, `server/controllers/adminController.js` | Connect Admin Studio forms to live `POST/PUT/DELETE /api/catalog`, series episode creation (`POST /api/catalog/:id/episodes`), and file upload progress bars. |
| **M2-08** | Live Ratings & Reviews MongoDB Aggregation Engine | **Haris Hassaan** | `server/controllers/reviewController.js`, `client/src/components/ReviewSection.jsx` | Store user reviews in MongoDB `Review` collection and execute an aggregation pipeline to dynamically update `Title.averageRating` and `ratingsCount`. |
| **M2-09** | End-to-End HTTP 206 Range Streaming in `WatchPage` | **Hashir Nadeem** | `server/controllers/streamController.js`, `client/src/pages/WatchPage.jsx` | Connect `WatchPage` video player to `/api/catalog/stream`, add buffering/error states, and increment `Title.viewsCount` in MongoDB on stream start. |
| **M2-10** | Admin Analytics Aggregation API & User Moderation | **Hashir Nadeem** | `server/controllers/adminStatsController.js`, `server/routes/adminRoutes.js`, `client/src/pages/AdminDashboard.jsx` | Build `GET /api/admin/stats` aggregation endpoint (total streams, most-watched titles, plan distribution) and live user role/suspension toggles. |
| **M2-11** | Toast Notifications, Skeleton Loaders & Error Boundaries | **Haris Hassaan** | `client/src/components/ToastContainer.jsx`, `client/src/components/SkeletonCard.jsx`, `client/src/components/ErrorBoundary.jsx` | Add animated toast feedback, shimmer skeleton loaders during API fetches, and React error boundaries across routes. |
| **M2-12** | Concurrent Dev Runner, Production Build & Final QA | **Hashir Nadeem** | `package.json` (root), `server/server.js`, `README.md` | Configure root `concurrently` script (`npm run dev`), Express static hosting for `client/dist`, and full end-to-end verification. |
