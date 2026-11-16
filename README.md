# StreamVerse — A Netflix-Style Video Streaming Platform

**Course:** Web Programming (Section BDS-7A)  
**Deliverable:** Deliverable 1 (Complete Frontend & Initial MERN Architecture — 50%+ Project Milestone)

---

## Group Members

| Name | Roll Number | GitHub Username | Email |
| :--- | :--- | :--- | :--- |
| **Haris Hassaan** | 23L-2642 | [`Haris3969`](https://github.com/Haris3969) | `harishassaan2004@gmail.com` |
| **Hashir Nadeem** | 23L-2544 | [`hashnadeem`](https://github.com/hashnadeem) | `nadeemhashir53@gmail.com` |

---

## Project Overview

**StreamVerse** is a full-stack, Netflix-inspired video streaming web application built on the **MERN** stack (**M**ongoDB, **E**xpress.js, **R**eact.js, **N**ode.js). Users can register, create up to 4 personalized viewing profiles (including a **Kids Mode** profile that automatically filters the catalogue to age-appropriate titles), browse movies and multi-episode TV series by category and genre, and stream content directly in a custom HTML5 video player.

---

## Implemented Functionalities

1. **User Authentication & Role-Based Access (`/login`, `/signup`)**
   - Sign up, login, and logout flows with protected routes (`ProtectedRoute.jsx`) and role-based access (`user` vs. `admin`).
   - Includes instant evaluation quick-login buttons for **Admin (Haris — Premium)** and **User (Hashir — Standard)**.
2. **Multiple Viewing Profiles & Kids Mode (`/profiles`)**
   - Create, switch, and delete up to 4 profiles per account (governed by the active Subscription Plan).
   - Dedicated **Kids Profile** flag (`isKids: true`) that restricts browsing and title details to age-appropriate ratings (`G`, `PG`, `TV-Y`, `TV-G`).
3. **Home & Browse Page (`/`)**
   - Cinematic `HeroBanner` featuring flagship original content, match score, maturity rating, and instant Play / My List controls.
   - Horizontal scrollable `ContentRow` carousels: *Continue Watching*, *My List*, *Trending Now*, *New Releases*, *Top Rated*, *Sci-Fi & Thrillers*, and *Kids & Family*.
4. **Search & Multi-Criteria Filter (`/browse`)**
   - Real-time search by title, synopsis, or cast member.
   - Filter simultaneously by **Genre**, **Media Type** (`Movie` / `Series`), **Release Year**, **Minimum Star Rating**, and sort order.
5. **Title Details & Episode Selector (`/title/:id`)**
   - Full backdrop showcase, synopsis, cast & director credits, official trailer modal, and interactive **Season & Episode selector** for TV series.
6. **Custom HTML5 Video Player & Streaming (`/watch/:id`)**
   - Play/pause, 10-second rewind/forward, interactive seek bar, volume & mute controls, playback speed selector (`0.75x`–`1.5x`), in-player episode drawer, and fullscreen mode.
   - Express HTTP range-request streaming endpoint (`server/controllers/streamController.js`) for chunked video delivery.
7. **Continue Watching & Personal Watchlist (`/my-list`)**
   - Automatic per-profile playback progress tracking (resumes from exact timestamp) and personal *My List* bookmarking.
8. **Interactive Ratings & Reviews**
   - Submit 1–5 star ratings and written reviews under any title; dynamically updates the title's average rating across the platform.
9. **Simulated Subscription Plans (`/plans`)**
   - **Basic** (480p SD, 1 Profile), **Standard** (1080p FHD, 2 Profiles), and **Premium** (4K HDR, 4 Profiles) with a simulated checkout modal.
10. **Administrator Dashboard (`/admin`)**
    - Platform metrics (Total Users, Total Titles, Total Streams, Most-Watched Title), full CRUD for Movies/Series, Episode Manager, and User Role/Status management.

---

## Tech Stack & Directory Structure

```text
StreamVerse/
├── client/                     # React.js (Vite) Frontend Application
│   ├── src/
│   │   ├── components/         # Navbar, Footer, HeroBanner, ContentRow, TitleCard, ReviewSection, ProtectedRoute
│   │   ├── context/            # AuthContext & StreamContext state providers
│   │   ├── data/               # Initial catalogue seed data & subscription tier configs
│   │   ├── pages/              # Home, Browse, TitleDetails, Watch, Profiles, MyList, Plans, Admin, Login, Signup
│   │   └── styles/             # Modular responsive CSS stylesheets
│   ├── index.html
│   └── package.json
└── server/                     # Node.js + Express + Mongoose REST & Streaming Backend
    ├── controllers/            # Auth, Catalogue & HTTP Range Streaming controllers
    ├── middleware/             # JWT verification & Admin guard middleware
    ├── models/                 # User, Title, and Review Mongoose schemas
    ├── routes/                 # Express API routers
    └── server.js
```

---

## How to Run Locally

### 1. Start the React Frontend
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 2. Start the Express Backend Server (Optional / Deliverable 2 API)
```bash
cd server
npm install
npm run dev
```
The API server listens on `http://localhost:5000`.

