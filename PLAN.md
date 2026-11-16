# StreamVerse — Comprehensive Master Project Plan (`PLAN.md`)

**Project Title:** StreamVerse: A Netflix-Style Video Streaming Platform  
**Course & Section:** Web Programming (Section BDS-7A)  
**Tech Stack:** MongoDB, Express.js, React.js (Vite), Node.js, JWT, bcryptjs, Multer, Cloudinary  

---

## Team Members

| Member | Roll Number | GitHub Username | Email | Role & Ownership |
| :--- | :--- | :--- | :--- | :--- |
| **Haris Hassaan** | 23L-2642 | [`Haris3969`](https://github.com/Haris3969) | `harishassaan2004@gmail.com` | **50% Full-Stack** (Auth UI, Profiles & Kids Mode, Home/Details/Reviews UI, Watchlist, Admin Studio, Cloud Upload & Admin APIs) |
| **Hashir Nadeem** | 23L-2544 | [`hashnadeem`](https://github.com/hashnadeem) | `nadeemhashir53@gmail.com` | **50% Full-Stack** (Workspace/Server Core, Mongoose Schemas, JWT Auth API, Navbar/Browse/Filter, HTML5 Player, HTTP 206 Streaming, Plans & Checkout API) |

---

## 1. Executive Summary & Project Scope

**StreamVerse** is a full-stack, on-demand video streaming web application modeled after modern OTT platforms such as Netflix. Built on the **MERN stack**, it enables subscribers to register accounts, choose simulated subscription tiers (**Basic**, **Standard**, **Premium**), manage up to **4 personalized viewing profiles** per account (including a dedicated **Kids Mode** profile), discover movies and multi-episode TV series through dynamic category carousels and multi-criteria filters, and stream video content directly in the browser using a custom HTML5 video player backed by **HTTP 206 Partial Content range-request streaming**.

### Project Milestones (2-Phase Delivery)
- **Module 1 (Deliverable 1 — First 50% — COMPLETED):**
  - Complete, interactive React.js Frontend across all 10 functional screens (`Login`, `Signup`, `Profiles`, `Home`, `Browse & Filter`, `Title Details`, `Custom Video Player`, `My List`, `Subscription Plans`, and `Admin Dashboard`).
  - Client-side state management (`AuthContext` & `StreamContext`) with rich seed data and `localStorage` persistence so every feature works end-to-end immediately.
  - Core Express.js server scaffolding, Mongoose data models (`User`, `Title`, `Review`), JWT authentication controllers, and HTTP 206 range-request streaming controller.
- **Module 2 (Deliverable 2 — Remaining 50% — Final Submission):**
  - Live **MongoDB Atlas / Local MongoDB** database integration replacing client-side mock storage with live REST API calls (`axios`/`fetch`).
  - Complete **Backend API Controllers** for Multi-Profile CRUD, Watchlist (`My List`) synchronization, `Continue Watching` timestamp persistence, Ratings & Reviews aggregation, Subscription Plan updates, and Admin Analytics.
  - **Multer + Cloudinary Media Upload Pipeline** allowing administrators to upload movie posters, backdrops, trailers, and MP4 video files directly from the Admin Dashboard.
  - End-to-end **HTTP 206 Chunked Video Streaming** connected to the frontend `WatchPage` player with token-verified stream URLs, error boundaries, toast notifications, and production build/deployment configuration.

---

## 2. System Architecture & End-to-End Data Flows

```
+-----------------------------------------------------------------------------------+
|                           CLIENT TIER (React.js + Vite)                           |
|                                                                                   |
|  +-----------------+   +-------------------+   +-------------------------------+  |
|  |   AuthContext   |   |   StreamContext   |   |        React Router v6        |  |
|  | - User Session  |   | - Catalogue State |   | - Public: /login, /signup     |  |
|  | - ActiveProfile |   | - Kids Mode Guard |   | - Protected: /, /browse, etc. |  |
|  | - Plan Limits   |   | - Reviews & Views |   | - AdminGuard: /admin          |  |
|  +--------+--------+   +---------+---------+   +---------------+---------------+  |
+-----------|----------------------|-----------------------------|------------------+
            | REST JSON (JWT)      | REST JSON / Multipart       | HTTP Range: bytes=
            v                      v                             v
+-----------------------------------------------------------------------------------+
|                        APPLICATION TIER (Node.js + Express)                       |
|                                                                                   |
|  +-----------------+   +-------------------+   +-------------------------------+  |
|  | Auth Middleware |   | REST Controllers  |   |  StreamController (HTTP 206)  |  |
|  | - protect (JWT) |   | - authController  |   | - Parses Range header         |  |
|  | - requireAdmin  |   | - profileCtrl     |   | - Streams 1MB video chunks    |  |
|  | - planValidator |   | - catalogCtrl     |   | - Supports instant seeking    |  |
|  +-----------------+   | - reviewCtrl      |   +-------------------------------+  |
|                        | - adminCtrl       |                                      |
|                        +---------+---------+                                      |
+----------------------------------|------------------------------------------------+
                                   | Mongoose ODM / Cloudinary SDK
                                   v
+-----------------------------------------------------------------------------------+
|                     DATA & MEDIA TIER (MongoDB + Cloudinary)                      |
|                                                                                   |
|  +---------------------------------------+   +---------------------------------+  |
|  |            MongoDB Database           |   |    Cloudinary / Local Storage   |  |
|  | - users (embedded profiles & history) |   | - Poster & Backdrop Images      |  |
|  | - titles (embedded series episodes)   |   | - Movie & Episode MP4 Streams   |  |
|  | - reviews (user ratings & comments)   |   | - Multer temp upload buffer     |  |
|  +---------------------------------------+   +---------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### Key Architectural Mechanisms
1. **JWT Authentication & Role Authorization:**
   - Upon login/signup, the server hashes passwords via `bcryptjs` (10 salt rounds) and signs a JWT containing `{ id, email, role }` valid for 7 days.
   - Protected frontend routes check `AuthContext.isAuthenticated`; admin routes check `AuthContext.isAdmin` (`role === 'admin'`).
   - Backend routes verify the `Authorization: Bearer <token>` header via `protect` and `requireAdmin` middlewares.
2. **Subscription-Driven Profile & Quality Enforcement:**
   - **Basic Plan (PKR 450/mo):** Max `1` profile, `480p SD` badge.
   - **Standard Plan (PKR 800/mo):** Max `2` profiles, `1080p FHD` badge.
   - **Premium Plan (PKR 1,100/mo):** Max `4` profiles, `4K HDR` badge.
   - Attempting to create a profile beyond `currentPlanDetails.maxProfiles` throws a validation error and prompts the user to upgrade on `/plans`.
3. **Kids Mode Content Isolation:**
   - Any profile with `isKids: true` automatically filters `StreamContext.visibleTitles` to only include titles where `isKidsSafe === true` or `maturityRating` is in `['G', 'PG', 'TV-Y', 'TV-G']`.
   - Direct navigation to `/title/:id` for a restricted title (`PG-13`, `TV-14`, `R`, `TV-MA`) while in a Kids profile renders a *"Restricted in Kids Mode"* safety screen.
4. **HTTP 206 Partial Content Video Streaming:**
   - The HTML5 `<video>` element sends an HTTP `Range: bytes=start-` header when seeking or buffering.
   - `streamController.js` calculates a `1MB` (`10^6` bytes) byte window, sets `Content-Range: bytes start-end/total`, `Accept-Ranges: bytes`, and status `206 Partial Content`, and pipes `fs.createReadStream(videoPath, { start, end })` to the response.

---

## 3. Complete Database Schema Specification (Mongoose ODM)

### 3.1 `User` Collection (`server/models/User.js`)

| Field | Type | Constraints / Defaults | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated PK | Unique account identifier |
| `name` | `String` | `required: true`, `trim: true` | Account holder full name |
| `email` | `String` | `required: true`, `unique: true`, `lowercase: true` | Login email address |
| `passwordHash` | `String` | `required: true` | `bcrypt` hashed password |
| `role` | `String` | `enum: ['user', 'admin']`, `default: 'user'` | Role-based access level |
| `status` | `String` | `enum: ['active', 'suspended']`, `default: 'active'` | Account moderation status |
| `subscriptionPlan` | `String` | `enum: ['basic', 'standard', 'premium']`, `default: 'standard'` | Active billing tier |
| `profiles` | `[ProfileSchema]` | Max length validator `<= 4` | Embedded viewing profiles |
| `createdAt / updatedAt` | `Date` | `timestamps: true` | Account audit timestamps |

#### Embedded `ProfileSchema` & `WatchProgressSchema`
- `name` (`String`, required) — Profile display name (e.g., `"Haris"`, `"Kids Zone"`).
- `avatarColor` (`String`, default `'#e50914'`) — Hex color for profile tile.
- `avatarIcon` (`String`, default `'🎬'`) — Emoji/icon identifier.
- `isKids` (`Boolean`, default `false`) — Enables Kids Mode maturity filter.
- `myList` (`[String]`) — Array of bookmarked `titleId` strings for this profile.
- `continueWatching` (`[WatchProgressSchema]`):
  - `titleId` (`String`, required)
  - `episodeId` (`String`, nullable — used for TV series)
  - `progressSeconds` (`Number`, default `0`)
  - `durationSeconds` (`Number`, default `0`)
  - `updatedAt` (`Date`, default `Date.now`)

---

### 3.2 `Title` Collection (`server/models/Title.js`)

| Field | Type | Constraints / Defaults | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated PK | Unique catalogue title ID |
| `title` | `String` | `required: true`, `trim: true` | Movie or TV Series name |
| `type` | `String` | `enum: ['Movie', 'Series']`, `required: true` | Media classification |
| `synopsis` | `String` | `required: true` | Full plot summary |
| `genres` | `[String]` | `required: true` | Genre tags (`Sci-Fi`, `Action`, etc.) |
| `releaseYear` | `Number` | `required: true` | Year of release (e.g., `2026`) |
| `maturityRating` | `String` | `enum: ['G','PG','TV-Y','TV-G','PG-13','TV-14','R','TV-MA']` | Age rating badge |
| `isKidsSafe` | `Boolean` | `default: false` | Explicit Kids profile visibility flag |
| `duration` | `String` | `required: true` | Runtime (`2h 14m`) or seasons (`2 Seasons`) |
| `cast` | `[String]` | Array of actor names | Starring cast list |
| `director` | `String` | Optional | Director or series creator |
| `posterUrl` | `String` | `required: true` | Vertical poster image URL |
| `backdropUrl` | `String` | `required: true` | 16:9 hero banner image URL |
| `trailerUrl` | `String` | Optional | Official trailer MP4 URL |
| `videoUrl` | `String` | `required: true` | Main feature MP4 path or URL |
| `featured` | `Boolean` | `default: false` | Displays in Home `HeroBanner` |
| `trending` | `Boolean` | `default: false` | Appears in *Trending Now* row |
| `newRelease` | `Boolean` | `default: false` | Appears in *New Releases* row |
| `averageRating` | `Number` | `default: 4.5` | Dynamically aggregated star rating |
| `ratingsCount` | `Number` | `default: 1` | Total number of submitted reviews |
| `viewsCount` | `Number` | `default: 100` | Total stream starts |
| `episodes` | `[EpisodeSchema]` | Embedded array (for `Series`) | Season/episode breakdown |

---

### 3.3 `Review` Collection (`server/models/Review.js`)

| Field | Type | Constraints / Defaults | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated PK | Unique review ID |
| `titleId` | `String` | `required: true`, `index: true` | Target movie/series ID |
| `userId` | `String` | `required: true` | Author account ID |
| `profileName` | `String` | `required: true` | Active viewing profile name |
| `rating` | `Number` | `required: true`, `min: 1`, `max: 5` | Star rating (1–5) |
| `comment` | `String` | `required: true`, `trim: true` | Written review body |
| `createdAt` | `Date` | `timestamps: true` | Review submission date |

---

## 4. Complete REST API Specification

| Method | Endpoint | Access | Description | Owner |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Server & DB health check | Hashir |
| `POST` | `/api/auth/signup` | Public | Register user, hash password, create default profiles, return JWT | Hashir |
| `POST` | `/api/auth/login` | Public | Authenticate credentials, check suspension status, return JWT | Hashir |
| `GET` | `/api/auth/me` | `protect` | Fetch current logged-in user & embedded profiles | Haris |
| `POST` | `/api/users/profiles` | `protect` | Create a new viewing profile (enforces plan `maxProfiles` limit) | Haris |
| `DELETE` | `/api/users/profiles/:profileId` | `protect` | Delete a viewing profile (prevents deleting last remaining profile) | Haris |
| `POST` | `/api/users/profiles/:profileId/mylist` | `protect` | Toggle a `titleId` in the active profile's `myList` array | Haris |
| `PUT` | `/api/users/profiles/:profileId/progress` | `protect` | Upsert `continueWatching` playback progress (`progressSeconds`, `episodeId`) | Hashir |
| `PUT` | `/api/users/subscription` | `protect` | Process simulated checkout & update user's `subscriptionPlan` | Hashir |
| `GET` | `/api/catalog` | `protect` | List titles with query filters (`genre`, `type`, `year`, `minRating`, `kidsOnly`, `q`) | Hashir |
| `GET` | `/api/catalog/:id` | `protect` | Get single title details, episodes, and recent reviews | Haris |
| `POST` | `/api/catalog` | `protect`, `requireAdmin` | Create a new movie or series in MongoDB | Haris |
| `PUT` | `/api/catalog/:id` | `protect`, `requireAdmin` | Update an existing title's metadata or media URLs | Haris |
| `DELETE` | `/api/catalog/:id` | `protect`, `requireAdmin` | Delete a title and its associated reviews | Haris |
| `POST` | `/api/catalog/:id/episodes` | `protect`, `requireAdmin` | Append a new episode to a TV series | Haris |
| `GET` | `/api/catalog/:id/reviews` | `protect` | Fetch all community reviews for a title | Haris |
| `POST` | `/api/catalog/:id/reviews` | `protect` | Submit a 1–5 star review and recalculate `Title.averageRating` | Haris |
| `GET` | `/api/catalog/stream` | Public / Token | Stream MP4 video chunks via HTTP 206 `Range` requests | Hashir |
| `POST` | `/api/upload/media` | `protect`, `requireAdmin` | Upload poster image or video file via Multer + Cloudinary | Haris |
| `GET` | `/api/admin/stats` | `protect`, `requireAdmin` | Aggregate total users, profiles, streams, plan distribution & top titles | Hashir |
| `PATCH` | `/api/admin/users/:id/role` | `protect`, `requireAdmin` | Toggle user role (`user` <-> `admin`) or account `status` (`active` <-> `suspended`) | Haris |

---

## 5. Frontend Architecture & Page Specifications

### 5.1 Component & Page Hierarchy
```text
App.jsx
├── AuthProvider (context/AuthContext.jsx)
└── StreamProvider (context/StreamContext.jsx)
    └── AppLayout
        ├── Navbar.jsx (hidden on /login, /signup, /watch/:id)
        ├── Routes
        │   ├── /login          -> LoginPage.jsx
        │   ├── /signup         -> SignupPage.jsx
        │   ├── /profiles       -> ProtectedRoute -> ProfilesPage.jsx
        │   ├── /               -> ProtectedRoute -> HomePage.jsx
        │   │                      ├── HeroBanner.jsx
        │   │                      └── ContentRow.jsx (x7) -> TitleCard.jsx
        │   ├── /browse         -> ProtectedRoute -> BrowsePage.jsx -> TitleCard.jsx
        │   ├── /title/:id      -> ProtectedRoute -> TitleDetailsPage.jsx
        │   │                      ├── Season/Episode List
        │   │                      ├── Official Trailer Modal
        │   │                      └── ReviewSection.jsx
        │   ├── /watch/:id      -> ProtectedRoute -> WatchPage.jsx (Custom HTML5 Player)
        │   ├── /my-list        -> ProtectedRoute -> MyListPage.jsx
        │   ├── /plans          -> ProtectedRoute -> PlansPage.jsx (Mock Checkout Modal)
        │   └── /admin          -> ProtectedRoute (adminOnly) -> AdminDashboard.jsx
        └── Footer.jsx (hidden on /login, /signup, /watch/:id)
```

---

## 6. Module 1 (Deliverable 1 — First 50%) Task Breakdown & Assignment Table

**Status:** **100% Complete** (20 Commits, 10 per member, spanning Nov 6–8, 2026)

| Task ID | Module 1 Task Name | Assigned Member | Files Created / Owned | Deliverable 1 Status |
| :---: | :--- | :--- | :--- | :---: |
| **M1-01** | Workspace Initialization & Vite Configuration | **Hashir Nadeem** | `.gitignore`, `client/package.json`, `client/vite.config.js`, `client/index.html` | ✅ Completed |
| **M1-02** | Global Dark Theme Tokens & Base CSS Utilities | **Haris Hassaan** | `client/src/styles/variables.css`, `client/src/styles/global.css`, `client/src/main.jsx` | ✅ Completed |
| **M1-03** | Express Server Setup & Mongoose Schemas (`User`, `Title`, `Review`) | **Hashir Nadeem** | `server/package.json`, `server/server.js`, `server/models/User.js`, `server/models/Title.js`, `server/models/Review.js` | ✅ Completed |
| **M1-04** | Initial Catalogue Seed Dataset & Subscription Tier Config | **Haris Hassaan** | `client/src/data/seedCatalog.js`, `client/src/data/subscriptionPlans.js` | ✅ Completed |
| **M1-05** | Backend JWT Middleware & Auth Controllers (`/signup`, `/login`) | **Hashir Nadeem** | `server/middleware/authMiddleware.js`, `server/controllers/authController.js`, `server/routes/authRoutes.js` | ✅ Completed |
| **M1-06** | Client `AuthContext` & Login/Signup UI with Quick Demo Switcher | **Haris Hassaan** | `client/src/context/AuthContext.jsx`, `client/src/pages/LoginPage.jsx`, `client/src/pages/SignupPage.jsx`, `client/src/styles/auth.css` | ✅ Completed |
| **M1-07** | Multi-Profile Selector, Avatar Picker, Plan Limit & Kids Toggle | **Haris Hassaan** | `client/src/pages/ProfilesPage.jsx`, `client/src/styles/profiles.css` | ✅ Completed |
| **M1-08** | Responsive `Navbar`, Profile Dropdown, `Footer` & `ProtectedRoute` | **Hashir Nadeem** | `client/src/components/Navbar.jsx`, `client/src/components/Footer.jsx`, `client/src/components/ProtectedRoute.jsx`, `client/src/styles/navbar.css` | ✅ Completed |
| **M1-09** | `HeroBanner`, Horizontal `ContentRow` Carousel & `TitleCard` | **Haris Hassaan** | `client/src/components/HeroBanner.jsx`, `client/src/components/ContentRow.jsx`, `client/src/components/TitleCard.jsx`, `client/src/styles/home.css` | ✅ Completed |
| **M1-10** | `StreamContext` Provider, Kids Filtering & `HomePage` Assembly | **Hashir Nadeem** | `client/src/context/StreamContext.jsx`, `client/src/pages/HomePage.jsx` | ✅ Completed |
| **M1-11** | Real-Time Search & Multi-Criteria Filter (`BrowsePage`) | **Hashir Nadeem** | `client/src/pages/BrowsePage.jsx`, `client/src/styles/browse.css` | ✅ Completed |
| **M1-12** | `TitleDetailsPage`, Season/Episode Selector & Trailer Modal | **Haris Hassaan** | `client/src/pages/TitleDetailsPage.jsx`, `client/src/styles/details.css` | ✅ Completed |
| **M1-13** | Interactive 1–5 Star Ratings & User Reviews (`ReviewSection`) | **Haris Hassaan** | `client/src/components/ReviewSection.jsx` | ✅ Completed |
| **M1-14** | Express HTTP 206 Range-Request Video Streaming & Catalogue API | **Hashir Nadeem** | `server/controllers/streamController.js`, `server/controllers/catalogController.js`, `server/routes/catalogRoutes.js` | ✅ Completed |
| **M1-15** | Custom HTML5 Video Player (`WatchPage`) with Seek, Speed & Drawer | **Hashir Nadeem** | `client/src/pages/WatchPage.jsx`, `client/src/styles/player.css` | ✅ Completed |
| **M1-16** | Personal Watchlist (`MyListPage`) & Per-Profile Resume History | **Haris Hassaan** | `client/src/pages/MyListPage.jsx` | ✅ Completed |
| **M1-17** | Simulated Subscription Plans & Mock Checkout Modal (`PlansPage`) | **Hashir Nadeem** | `client/src/pages/PlansPage.jsx`, `client/src/styles/plans.css` | ✅ Completed |
| **M1-18** | Role-Based `AdminDashboard` (Catalogue CRUD, Episodes & Users) | **Haris Hassaan** | `client/src/pages/AdminDashboard.jsx`, `client/src/styles/admin.css` | ✅ Completed |
| **M1-19** | Application Router Wiring & Layout Chrome Control (`App.jsx`) | **Hashir Nadeem** | `client/src/App.jsx` | ✅ Completed |
| **M1-20** | Comprehensive Project Documentation & Setup Instructions | **Haris Hassaan** | `README.md` | ✅ Completed |

---

## 7. Module 2 (Deliverable 2 — Remaining 50%) Detailed Plan & Task Breakdown

In **Module 2 (Final Submission)**, the team transitions StreamVerse from a standalone frontend + initial backend skeleton into a **fully integrated, database-persisted MERN application** with live MongoDB seeding, Multer/Cloudinary file uploads, real HTTP 206 chunked video streaming in the player, and end-to-end API synchronization.

---

### 7.1 Module 2 Task Assignment Table (50% Haris / 50% Hashir)

| Task ID | Module 2 Task Name | Assigned Member | Target Files (Create / Update) | Technical Scope |
| :---: | :--- | :--- | :--- | :--- |
| **M2-01** | MongoDB Database Seeder Script & Environment Setup | **Hashir Nadeem** | `server/seed/seedDatabase.js`, `server/.env.example`, `server/config/db.js` | Automated CLI script (`npm run seed`) that populates MongoDB with initial users (Haris Admin, Hashir User), 9 titles, episodes, and reviews. |
| **M2-02** | Frontend Axios/Fetch API Client & JWT Interceptor | **Haris Hassaan** | `client/src/services/apiClient.js`, `client/src/context/AuthContext.jsx` | Centralized HTTP service that attaches `Authorization: Bearer <token>` to every request and syncs `/api/auth/login`, `/signup`, and `/me` with MongoDB. |
| **M2-03** | Backend Multi-Profile & My List Persistence API | **Haris Hassaan** | `server/controllers/profileController.js`, `server/routes/userRoutes.js` | Express endpoints for adding/deleting profiles (validating plan limits on server) and toggling `myList` items inside MongoDB `User.profiles`. |
| **M2-04** | Backend Continue Watching & Subscription Checkout API | **Hashir Nadeem** | `server/controllers/subscriptionController.js`, `server/routes/userRoutes.js` | Endpoints to persist `continueWatching` playback timestamps (`PUT /api/users/profiles/:id/progress`) and update subscription tiers (`PUT /api/users/subscription`). |
| **M2-05** | Live Catalogue Query, Search & Kids Mode Filtering API | **Hashir Nadeem** | `server/controllers/catalogController.js`, `client/src/context/StreamContext.jsx` | Upgrade `GET /api/catalog` with MongoDB regex search, genre/type/year/rating query filters, and automatic Kids-safe filtering, wired to `StreamContext`. |
| **M2-06** | Multer + Cloudinary Poster & Video Upload Pipeline | **Haris Hassaan** | `server/config/cloudinary.js`, `server/middleware/uploadMiddleware.js`, `server/controllers/uploadController.js`, `server/routes/uploadRoutes.js` | Multipart file upload endpoint (`POST /api/upload/media`) using `multer` and Cloudinary SDK for uploading movie posters, backdrops, and MP4 videos. |
| **M2-07** | Admin Studio Cloud Upload UI & Full Backend CRUD Integration | **Haris Hassaan** | `client/src/pages/AdminDashboard.jsx`, `server/controllers/adminController.js` | Connect Admin Dashboard forms to live `POST/PUT/DELETE /api/catalog`, episode creation (`POST /api/catalog/:id/episodes`), and file upload drag-and-drop inputs. |
| **M2-08** | Live Ratings & Reviews Aggregation Engine | **Haris Hassaan** | `server/controllers/reviewController.js`, `client/src/components/ReviewSection.jsx` | Persist user reviews in MongoDB `Review` collection and run a MongoDB aggregation pipeline to update `Title.averageRating` and `Title.ratingsCount` atomically. |
| **M2-09** | End-to-End HTTP 206 Range Streaming Integration in `WatchPage` | **Hashir Nadeem** | `server/controllers/streamController.js`, `client/src/pages/WatchPage.jsx` | Connect `WatchPage` `<video>` source to `/api/catalog/stream?videoPath=...`, add buffering spinner, network error recovery, and view counter increment in MongoDB. |
| **M2-10** | Admin Analytics Aggregation API & User Moderation Wiring | **Hashir Nadeem** | `server/controllers/adminStatsController.js`, `server/routes/adminRoutes.js`, `client/src/pages/AdminDashboard.jsx` | Server-side analytics endpoint (`GET /api/admin/stats`) computing total views, most-watched titles, and subscription tier breakdown + live user role/status toggling. |
| **M2-11** | Global Toast Notification System, Skeleton Loaders & Error Boundaries | **Haris Hassaan** | `client/src/components/ToastContainer.jsx`, `client/src/components/SkeletonCard.jsx`, `client/src/components/ErrorBoundary.jsx` | Replace static banners with animated toast notifications, shimmer skeleton cards while API requests load, and React error boundary protection. |
| **M2-12** | Production Build Pipeline, Concurrent Runner & Final Verification | **Hashir Nadeem** | `package.json` (root), `server/server.js`, `README.md` | Configure root `npm run dev` (using `concurrently` for client + server), Express static serving of `client/dist`, and final end-to-end integration test suite. |

---

### 7.2 Detailed Module 2 Technical Specifications

#### 1. Database Seeding & Connection Resilience (`M2-01` — Hashir Nadeem)
- Create `server/config/db.js` with connection retry logic and clear console diagnostics.
- Create `server/seed/seedDatabase.js` which imports the initial users, movies, series, episodes, and reviews, hashes default passwords (`password123`) using `bcryptjs`, wipes stale collections when run with `--destroy`, and inserts fresh documents so both team members have identical local databases.

#### 2. Frontend-to-Backend API Service Layer (`M2-02` — Haris Hassaan)
- Create `client/src/services/apiClient.js`:
  - Base URL configured via `import.meta.env.VITE_API_URL || '/api'`.
  - Automatically reads the JWT from `localStorage` (`streamverse_session_v1`) and injects `Authorization: Bearer <token>`.
  - Provides typed helper methods: `authApi`, `profileApi`, `catalogApi`, `reviewApi`, `adminApi`, and `uploadApi`.
  - Graceful fallback: if the backend server is offline during offline testing, falls back cleanly to local cache while logging a clear notice.

#### 3. Multi-Profile, Watchlist & Progress Synchronization (`M2-03` Haris & `M2-04` Hashir)
- **`profileController.js` (Haris):**
  - `POST /api/users/profiles`: Reads the user's `subscriptionPlan`, verifies `user.profiles.length < PLAN_LIMITS[user.subscriptionPlan]`, pushes the new subdocument to `user.profiles`, saves to MongoDB, and returns the updated profile array.
  - `POST /api/users/profiles/:profileId/mylist`: Uses Mongoose `$addToSet` or `$pull` to toggle `titleId` in the target profile's `myList`.
- **`subscriptionController.js` (Hashir):**
  - `PUT /api/users/profiles/:profileId/progress`: Debounced call from `WatchPage.jsx` every 5 seconds of playback (and on `pause`/`unmount`) updating `progressSeconds` and `durationSeconds` in MongoDB.
  - `PUT /api/users/subscription`: Validates the requested plan (`basic`, `standard`, `premium`), updates `user.subscriptionPlan`, and records the simulated checkout timestamp.

#### 4. Multer + Cloudinary Media Upload Pipeline (`M2-06` & `M2-07` — Haris Hassaan)
- Install `cloudinary` and configure `server/config/cloudinary.js` with `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` (plus local disk storage fallback in `server/uploads/` so uploads work even without internet/Cloudinary credentials during lab evaluation).
- In `AdminDashboard.jsx`, add file upload inputs for **Poster Image** and **Video MP4 File** alongside the URL inputs, with an upload progress bar (`0% -> 100%`) that auto-populates `posterUrl` and `videoUrl` upon completion.

#### 5. Dynamic Review Aggregation & HTTP 206 Video Streaming (`M2-08` Haris & `M2-09` Hashir)
- **Review Aggregation (Haris):**
  - When `POST /api/catalog/:id/reviews` is called, insert the new `Review` document, then run `Review.aggregate([{ $match: { titleId: id } }, { $group: { _id: '$titleId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }])` and update `Title.findByIdAndUpdate(id, { averageRating, ratingsCount })`.
- **HTTP Range Streaming (Hashir):**
  - Enhance `GET /api/catalog/stream` to support both local MP4 files stored in `server/uploads/videos/` (streaming `206 Partial Content` byte ranges) and remote CDN URLs, while incrementing `Title.viewsCount` in MongoDB when a stream session begins.

---

## 8. Evaluation & Viva Preparation Checklist

During project evaluation, both members must be ready to demonstrate and explain the entire platform:

### Haris Hassaan — Key Evaluation Demonstration Points
1. **Authentication & Role Guarding:** Demonstrate logging in as Admin (`Haris`) vs. Subscriber (`Hashir`), showing how `AuthContext.jsx` manages session state and how `/admin` is restricted.
2. **Multi-Profile & Kids Mode:** Demonstrate creating a profile on `/profiles`, hitting the subscription plan profile limit, and switching to the **Kids Zone** profile to show mature titles (`R`, `TV-MA`, `TV-14`) disappearing across the app.
3. **Title Details, Episodes & Reviews:** Open a multi-season series (`/title/sv-101`), switch between Season 1 and Season 2, open the Official Trailer modal, and submit a 5-star review in `ReviewSection.jsx` to show the live rating update.
4. **Admin Studio (`/admin`):** Create a new movie or add a new episode to a series, edit an existing title, and toggle a user's role or account status.

### Hashir Nadeem — Key Evaluation Demonstration Points
1. **MERN Server & Mongoose Models:** Walk through `server.js`, `User.js`, `Title.js`, and `Review.js`, explaining how profiles and episodes are embedded subdocuments and how `bcrypt` + `JWT` secure `/api/auth`.
2. **Home Carousels & Search/Filter Engine:** Demonstrate `HomePage.jsx` category rows and navigate to `/browse` (`BrowsePage.jsx`) to combine keyword search, Genre chips, Movie/Series type filter, Release Year, and Minimum Rating sorting.
3. **Custom HTML5 Video Player & HTTP 206 Streaming:** Stream a title on `/watch/sv-101` (`WatchPage.jsx`), demonstrate `-10s`/`+10s` skip, playback speed (`1.25x`), the in-player **Episode Drawer**, and explain how `streamController.js` handles `Range: bytes=start-end` headers with `206 Partial Content`.
4. **Continue Watching & Subscription Checkout:** Pause a video midway, return to `/` or `/my-list` to show the red progress bar on the card, and upgrade/switch plans on `/plans` (`PlansPage.jsx`) via the simulated checkout modal.

