# Anshul Mandekar — Portfolio Website

> **A premium, interactive, full-stack portfolio website built with vanilla HTML, CSS, and JavaScript — featuring a slide-based presentation mode and a fully playable 3D WebGL portfolio game.**

[![Live Site](https://img.shields.io/badge/Live%20Site-Visit-7c83e8?style=for-the-badge&logo=googlechrome&logoColor=white)](https://portfolio-website-anshul-1.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-AnshulMandekar-181717?style=for-the-badge&logo=github)](https://github.com/AnshulMandekar)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Anshul%20Mandekar-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/anshul-mandekar-4b75b2292)
[![LeetCode](https://img.shields.io/badge/LeetCode-200%2B%20Solved-FFA116?style=for-the-badge&logo=leetcode&logoColor=black)](https://leetcode.com/u/anshulmandekar21/)

---

## 📌 Overview

This is a **fully custom-built portfolio website** for **Anshul Ravindra Mandekar**, a Full-Stack Developer & AI Researcher currently pursuing a B.Tech in Computer Science at Symbiosis Institute of Technology, Pune.

The site serves as a **dynamic, interactive resume** — designed to stand out from generic PDF resumes. It includes:
- A **15-slide interactive presentation** covering every aspect of the resume — or read it as a normal scrolling page.
- A **command palette** (`Ctrl/⌘ + K`), clickable skill → project cross-links, an image lightbox and a playable mini-game on the retro console.
- **Light & dark themes**, a shareable link for every slide, a one-click **CV download**, a **contact form** and **live GitHub / LeetCode stats**.
- An **ElevenLabs Conversational AI** voice agent for live Q&A.
- An **"Anshul's World" 3D portfolio game** built from scratch in WebGL/Three.js, accessible from the last slide.

No frameworks, no build tools — **100% vanilla HTML, CSS, and JavaScript**.

---

## 🗂️ Repository Structure

```
portfolio_website/
│
├── index.html          # Main portfolio — 15-slide presentation
├── game.html           # 3D interactive portfolio game (WebGL)
├── style.css           # Complete design system & all component styles
├── script.js           # Presentation controller, navigation, interactive modules
├── anshul.html         # Redirect for older links (e.g. the URL printed on the resume)
├── favicon.ico / favicon.svg
├── nginx.conf, Dockerfile, docker-compose.yml, Jenkinsfile, deployment.yaml, service.yaml
│
├── Anshul_pfp.webp     # Profile photo served on the page (+ -360 variant); .PNG is the original
│
└── assets/             # Project screenshots and visuals
    │                   # Pages load the .webp files (and -800 variants via srcset);
    │                   # the .png/.jpg files are the originals they were generated from.
    ├── Anshul_Mandekar_Resume.pdf  # CV served by the "Download CV" buttons
    ├── og-image.png          # 1200×630 social preview card
    ├── apple-touch-icon.png
    ├── crm01.png       # CRM internship project — screen 1
    ├── crm02.png       # CRM internship project — screen 2
    ├── crm03.png       # CRM internship project — screen 3
    ├── crm04.png       # CRM internship project — screen 4
    ├── FinVaritas02.jpg  # Financial RAG system screenshot
    ├── FinVaritas03.jpg  # Financial RAG system screenshot
    ├── FinVaritas04.jpg  # Financial RAG system screenshot
    ├── financial_agents.jpg  # Financial agents diagram
    ├── microplastics.jpg     # YOLO microplastic detection visual
    ├── network_ids.jpg       # Network IDS CNN illustration
    ├── iskcon_memorial.png   # ISKCON memorial platform visual
    ├── TaskManager1.png      # TaskFlow dashboard visual
    ├── TaskManager2.png      # TaskFlow AI chat visual
    ├── Lecture_notes.png     # LectureNotes AI lecture notes & concept maps visual
    └── urban_mobility.png    # Urban GAN research visualization
```

---

## 🖥️ Main Portfolio (`index.html`)

The main portfolio is a **full-screen, vertical slide-based presentation** — similar to PowerPoint but in the browser. It has **15 slides**, each covering a distinct section of the resume. The top bar can switch it to a regular **scroll view** (remembered per visitor).

### Navigation
| Method | Action |
|---|---|
| **Arrow Up / Down** | Go to previous/next slide |
| **Page Up / Page Down** | Jump slides |
| **Space** | Next slide |
| **Shift + Space** | Previous slide |
| **Home / End** | Jump to first/last slide |
| **Sidebar dots** | Click to jump to any slide |
| **Prev/Next buttons** | Bottom navigation bar |
| **Scroll** | Naturally detects active slide via Intersection Observer |
| **Ctrl/⌘ + K** or **/** | Open the command palette (search sections, projects, links and actions) |
| **Arrow Left / Right** | Cycle the screenshots on project slides |
| **Links** | Every slide has its own URL (`/#taskflow`, `/#research`, `/#contact`…) — share it, and the browser **Back** button returns to the previous slide |

### Interactive Details
- **Command palette** — fuzzy search over every slide, project tech tag and external link, plus actions like *Copy email* and *Launch the 3D world*.
- **Skill cross-links** — click any skill tag to see which projects use it and jump straight there.
- **Hero** — cursor-reactive constellation background, rotating "I build …" typewriter, availability pill and one-click email copy.
- **Motion** — slide progress bar, staggered entrance animations, count-up metrics, card spotlight/tilt and magnetic buttons (all disabled under `prefers-reduced-motion`).
- **Project media** — autoplaying sliders with a progress bar (pauses on hover), swipe support and a fullscreen lightbox.
- **ANSHUL 64** — press **A** on the console mockup to play *Bug Hunt*, a tiny snake game with a saved best score.
- **Themes & views** — sun/moon button switches light/dark; the layout button switches slides/scroll view. Both are saved in `localStorage`.
- **Contact slide** — a validated contact form (with honeypot spam protection), copy-email button, CV download and live stats.
- **Live stats** — public repos, followers and top language from the GitHub API, plus solved-problem count from LeetCode. Cached for an hour; the static "200+" is shown if the APIs are unreachable.
- **Easter egg** — try the Konami code.

### Slide Breakdown

| # | Slide Title | Description |
|---|---|---|
| 01 | **Cover / Hero** | Name, title (Full-Stack Developer & AI Researcher), location, email, and social links (GitHub, LinkedIn, LeetCode). Profile photo display. |
| 02 | **About Me** | Professional summary with 4 metric cards: 1st Rank at Industry Conclave 2026, 20K+ Active Users Supported, 95%+ ML Detection Accuracy, 10⁻⁷ KL Divergence on Urban GAN. |
| 03 | **Technical Summary** | Skill tags grouped into 4 categories: Languages & Core, Web & Cloud Infrastructure, AI / Machine Learning, Developer Tools & Systems. |
| 04 | **Work Experience** | Software Development Intern at **Yellow Cube** (Jan–Jul 2025, Navi Mumbai). Covers AWS cloud infra, real-time WebSocket scheduling, IAM security config. Includes an image carousel of 4 CRM screenshots and a link to a demo video. |
| 05 | **Projects Index** | A card-based index of all 6 projects with short descriptions and deep-link navigation buttons. |
| 06 | **Project 01 — Financial RAG System** | Explainable financial background review pipeline using LangGraph multi-agent LLMs, RAG, and ChromaDB vector store. Includes image gallery slider. |
| 07 | **Project 02 — Microplastic Detection** | YOLO-based computer vision pipeline (YOLOv8/v9) with TensorRT inference acceleration and Conditional WGAN-GP synthetic data augmentation. |
| 08 | **Project 03 — Network IDS CNN** | 1D-to-2D feature transformation + CNN for network intrusion detection with 95%+ accuracy and XAI explainability. |
| 09 | **Project 04 — ISKCON Devotee Memorial** | Full-stack MERN platform for digitally preserving ISKCON devotees. 3-tier moderation, JWT auth, Cloudinary CDN, 90+ PageSpeed score. Live site linked. |
| 10 | **Project 05 — TaskFlow AI Task Manager** | AI-powered task manager with React client, Express gateway, and Python FastAPI service using Gemini 3.5 Flash for multimodal syllabus parsing and context-aware chat. |
| 11 | **Project 06 — LectureNotes AI** | Full-stack AI application powered by FastAPI, Google Gemini 2.5 Flash, MongoDB Atlas, and Mermaid.js for YouTube lecture synthesis, timestamp-synced playback, and dynamic concept maps. |
| 12 | **Research & Publications** | SCI-published paper on *Generative Adversarial Networks in Urban Digital Twins* (2026). Conditional WGAN-GP — KL Divergence of 9.78×10⁻⁷, outperforming VAE baselines. |
| 13 | **Education & Credentials** | B.Tech CSE at SIT Pune (2023–2027, CGPA 7.45), Class XII & X (CBSE). Certifications: NCA, Full Stack Gen AI, ML A-Z. Honors: 2x SIH Qualifier, Deloitte Hacksplosion L2, 200+ LeetCode problems. |
| 14 | **Bored of Reading?** | Invitation to launch the 3D portfolio game, with feature highlights and a "Launch 3D World" button. Features a retro game console card that plays the *Bug Hunt* mini-game. |
| 15 | **Let's Connect** | Contact form, email, CV download and live GitHub / LeetCode stats. |

---

## 🎮 3D Portfolio Game (`game.html`)

**"Anshul's World"** is a fully playable **3D interactive experience** built using **WebGL via Three.js (CDN)**, accessible from the final slide. It transforms the portfolio into an explorable virtual space — a unique recruiter engagement tool.

### Features
- **Playable Avatar**: Walk a low-poly island in third person — sprint, jump, collide with buildings and trees, and follow the hilly terrain.
- **Six Districts**: Identity, Experience, Skills, Projects, Research and Contact. Walk up to one and press `E` to open its detail card (projects get one card per project, with live links).
- **Skill Orbs**: 18 collectible orbs, one per skill, marked by light beams. A few float high and need a jump.
- **Objectives & Timer**: HUD tracks districts found, orbs collected and your time (paused while you read). Clearing everything triggers fireworks and saves your best time locally.
- **Minimap**: Shows the island, paths, remaining orbs, discovered districts and your facing direction.
- **Fast Travel**: Click a district (in the world, its label, or the HUD list) or press `1`–`6` to teleport next to it.
- **Quick Tour Mode**: The original orbit-and-click experience — press `M` to switch between walking and the map view.
- **Project Buildings**: In the Projects district each building carries a name sign; walk up to its door to open that project's full story.
- **One Source of Truth**: District and project text is read from `index.html` at load time, so editing the slides updates the game too (a built-in copy is used if the page can't be fetched).
- **Byte, the Guide**: A companion drone follows you and offers direction-aware hints ("the Research district is ahead to your right…") when you seem stuck or press `G`.
- **Day / Night**: Toggle with `N` or the settings panel — the sky, water, lights and fireflies change, windows glow and your avatar carries a lantern.
- **Music & Sound**: A generative ambient soundtrack plus sound effects, all behind the sound button (off by default).
- **Saved Progress**: Runs are saved on the device; the start screen offers *Continue* or *New game*.
- **Settings & Quality**: Time of day, graphics quality (low turns off shadows and extra particles — default on phones), music, sound effects and hints.
- **Controllers**: Standard gamepads work alongside keyboard, mouse and touch.
- **Mobile**: On-screen joystick, jump and explore buttons, drag-to-look and pinch-to-zoom.
- **Custom Cursor**, **Loading Screen** and **Glassmorphism UI Panels**.
- **Color Palette**: Deep-space dark theme (`#05050f` background) with `#7c83e8` (indigo) accent, `#4ecdc4` (teal), and `#ff9ff3` (pink) gradient highlights.
- **Font**: *Outfit* (Google Fonts) — 300 to 800 weight range.

### Game Controls
| Key | Action |
|---|---|
| `W` `A` `S` `D` / Arrow keys | Move (camera-relative) |
| `Shift` | Sprint |
| `Space` | Jump |
| `E` / `Enter` | Explore the district you're standing in (press again to close) |
| `1` – `6` | Travel to a district |
| `M` / `Tab` | Toggle walk mode / map (tour) view |
| Mouse drag / scroll | Rotate / zoom the camera |
| `G` | Ask Byte for a hint |
| `N` | Toggle day / night |
| `H` / `?` | Controls help |
| `Esc` | Close panel or overlay |

| Controller | Action |
|---|---|
| Left stick / D-pad | Move |
| Right stick · LB / RB | Look · zoom |
| A · X · B · Y | Jump · explore · close · hint |
| RT or left-stick click | Sprint |
| Start · Back | Map view · help |

---

## 🎨 Design System (`style.css`)

The entire visual identity is defined in a single CSS file — no Tailwind, no Bootstrap.

### Core Design Tokens
```css
:root {
  --bg-primary:     #0a0a0a;              /* Page & slide background */
  --bg-card:        #161616;              /* Cards and panels */
  --text-primary:   #ffffff;
  --text-secondary: #a0a0a0;
  --text-muted:     #626262;
  --fg-rgb:         255, 255, 255;        /* Tint for subtle overlays: rgba(var(--fg-rgb), .08) */
  --surface-rgb:    20, 20, 24;           /* Floating panels (palette, toasts, popovers) */
  --border-color:   rgba(var(--fg-rgb), 0.08);
  --brand-indigo:   #7c83e8;
  --brand-teal:     #4ecdc4;
  --brand-pink:     #ff9ff3;
  --gradient-brand: linear-gradient(90deg, #7c83e8, #4ecdc4, #ff9ff3);
  --font-heading:   'Outfit', sans-serif;
  --font-body:      'Inter', sans-serif;
}

/* The light theme only overrides these tokens */
:root[data-theme="light"] { --bg-primary: #f5f5f2; --text-primary: #111114; --fg-rgb: 17, 17, 20; /* … */ }
```
The 3D game (`game.html`) keeps its own deep-space palette (`#05050f` background) inside the file.

### Key Design Patterns
- **Glassmorphism** — translucent panels with backdrop blur on cards, control bars, and overlays.
- **Dark first, light available** — every colour comes from theme tokens, so the light theme is a small override block.
- **Micro-animations** — hover effects on buttons, slide transitions, nav dot pulses, glow effects.
- **CSS Grid & Flexbox** — fully responsive two-column layouts on each slide.
- **Retro Game UI** — pixel grid, blinking "PRESS START" text, and D-pad console mockup in the Bored slide.
- **Custom Scrollbar** — styled scrollbar matching the dark theme.
- **Gradient Accents** — used on titles, tags, and metric numbers.

---

## ⚙️ JavaScript Controller (`script.js`)

All interactivity is handled by a **single vanilla JS file** — the slide engine plus a set of small, independent interactive modules.

### Key Systems

#### Slide Presentation Engine
- Uses `IntersectionObserver` (threshold: 45%) to detect which slide is in the viewport and update the active state, dots, and counter.
- `scrollToSlide(index, push, instant)` — scrolls to the target slide; `push` records a browser-history entry so **Back** works.
- Each `<section>`'s `id` is its shareable hash (`#finveritas`); the address bar follows the slide on screen and `/#slug` links open straight on that slide.
- Arrow keys, Page Up/Down, Space, Home, End keyboard shortcuts.

#### Dot Navigation
- 15 sidebar nav dots, each with a hover label.
- Click events on dots call `scrollToSlide()`.

#### Prev/Next Buttons
- Disabled state on first/last slides.
- Live counter in `01 / 15` format; the `NN / 15` labels on each slide are also filled in by the script.

#### Project Image Slider
- `moveProjectSlider(sliderId, direction)` — cycles through project screenshots with previous/next buttons.
- `setProjectSlider(sliderId, targetIdx)` — jumps directly to a specific image by clicking dot indicators.
- Works on any slider element with the `slider` class and an ID.

#### Interactive Layer
- Every slide change dispatches a `slidechange` event; the modules below (`initInteractiveLayer`) subscribe to it instead of polling.
- Overlays (command palette, lightbox, console mini-game) register a key lock so slide shortcuts pause while they're open.
- Skill cross-links search each experience/project/research slide for keywords (see `SKILL_KEYWORDS`), so the links stay in sync with slide content.

#### Slides / Scroll View
- The top-bar button switches `presentation-mode` ↔ `document-mode`. The observer is rebuilt for the new scroller, the progress bar becomes a reading-progress bar, and the choice is saved.

---

## 🤖 ElevenLabs AI Voice Agent

The portfolio integrates an **ElevenLabs Conversational AI widget** embedded directly in `index.html`:

```html
<elevenlabs-convai agent-id="agent_5501kxqsfx1wew8rv19gh6nt983x"></elevenlabs-convai>
```

This places a voice-chat button on the page that allows visitors to **ask questions about Anshul's experience, projects, and skills** in natural language, powered by a custom ElevenLabs AI agent. The widget script is injected once the page is idle so it doesn't slow down the first paint.

---

## 🔧 Configuration

| What | Where |
|---|---|
| **Contact form delivery** | Create a free form at [Formspree](https://formspree.io), then put its URL in `data-endpoint` on `<form id="contact-form">` in `index.html` (e.g. `data-endpoint="https://formspree.io/f/abcdwxyz"`). Left empty, the form opens a pre-filled email in the visitor's mail app. |
| **CV file** | Replace `assets/Anshul_Mandekar_Resume.pdf` (keep the name, or update the three links and `RESUME_URL` in `script.js`). |
| **Live stats accounts** | `GITHUB_USER` / `LEETCODE_USER` in `script.js`. LeetCode has no public CORS API, so its count comes from the community `alfa-leetcode-api` proxy. |
| **Cache busting** | After editing `style.css` or `script.js`, bump the `?v=` value on their links in `index.html`. |
| **Images** | Pages use `.webp` files; regenerate them (and the `-800` variants) when a screenshot changes. |

---

## 🚀 Running Locally

No build step or package manager required.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AnshulMandekar/Portfolio-Website-Anshul.git
   cd Portfolio-Website-Anshul
   ```

2. **Serve locally** (required for assets to load — do not open `index.html` directly as a file):
   ```bash
   # Option 1: Python
   python -m http.server 8080

   # Option 2: Node.js (npx)
   npx serve .

   # Option 3: VS Code Live Server extension
   # Right-click index.html → "Open with Live Server"
   ```

3. **Open in browser:**
   ```
   http://localhost:8080
   ```

---

## 🌐 Deployment

The site is deployed as a **static site on [Render](https://render.com)**.

| Setting | Value |
|---|---|
| **Service Type** | Static Site |
| **Build Command** | *(none — no build step needed)* |
| **Publish Directory** | `.` (root of the repository) |
| **Branch** | `main` |

Caching: `nginx.conf` makes browsers revalidate HTML/CSS/JS on every visit (cheap `304`s), caches images for a month and the CV for an hour, so a new deploy shows up immediately.

To deploy your own copy:
1. Push this repository to GitHub.
2. Create a new **Static Site** on Render.
3. Connect your GitHub repo.
4. Set the **Publish Directory** to `.` and leave **Build Command** empty.
5. Click **Deploy**.

---

## 📊 Technical Highlights

| Metric | Value |
|---|---|
| Lines of HTML | ~1,200 |
| Lines of CSS | ~3,800 |
| Lines of JS (portfolio) | ~1,700 |
| Lines of JS (3D game) | ~2,900 |
| Images served | ~0.9 MB WebP (down from ~3.8 MB PNG/JPG) |
| Lighthouse (desktop) | Performance 99 · Accessibility 96 · Best Practices 100 · SEO 100 |
| Zero dependencies | No npm, no bundler |
| Google PageSpeed (ISKCON project) | 90+ |

---

## 👤 About Anshul Mandekar

| | |
|---|---|
| **Role** | Full-Stack Developer & AI Researcher |
| **Education** | B.Tech CSE, Symbiosis Institute of Technology, Pune (2023–2027) |
| **Location** | Pune, India |
| **Email** | anshulmandekar21@gmail.com |
| **Internship** | Software Development Intern, Yellow Cube (Jan–Jul 2025) |
| **Recognition** | 🏆 1st Rank — Industry Conclave 2026 |
| **Publication** | SCI Paper — GANs in Urban Digital Twins (2026) |
| **Hackathons** | 2× SIH Qualifier · Deloitte Hacksplosion Level 2 |

---

## 📄 License

This project is personal portfolio work by **Anshul Ravindra Mandekar**. Feel free to draw inspiration from the design and code, but please do not redistribute or use it as your own portfolio.

---

*Built with ❤️ using vanilla HTML, CSS & JavaScript — no frameworks, no build tools, just craft.*
