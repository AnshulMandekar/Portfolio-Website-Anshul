# Anshul Mandekar — Portfolio Website

> **A premium, interactive, full-stack portfolio website built with vanilla HTML, CSS, and JavaScript — featuring a slide-based presentation mode and a fully playable 3D WebGL portfolio game.**

[![Live Site](https://img.shields.io/badge/Live%20Site-Visit-7c83e8?style=for-the-badge&logo=googlechrome&logoColor=white)](https://anshulmandekar.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-AnshulMandekar-181717?style=for-the-badge&logo=github)](https://github.com/AnshulMandekar)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Anshul%20Mandekar-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/anshul-mandekar-4b75b2292)
[![LeetCode](https://img.shields.io/badge/LeetCode-200%2B%20Solved-FFA116?style=for-the-badge&logo=leetcode&logoColor=black)](https://leetcode.com/u/anshulmandekar21/)

---

## 📌 Overview

This is a **fully custom-built portfolio website** for **Anshul Ravindra Mandekar**, a Full-Stack Developer & AI Researcher currently pursuing a B.Tech in Computer Science at Symbiosis Institute of Technology, Pune.

The site serves as a **dynamic, interactive resume** — designed to stand out from generic PDF resumes. It includes:
- A **12-slide interactive presentation** covering every aspect of the resume.
- An **ElevenLabs Conversational AI** voice agent for live Q&A.
- An **"Anshul's World" 3D portfolio game** built from scratch in WebGL/Three.js, accessible from the last slide.

No frameworks, no build tools — **100% vanilla HTML, CSS, and JavaScript**.

---

## 🗂️ Repository Structure

```
portfolio_website/
│
├── index.html          # Main portfolio — 12-slide presentation
├── game.html           # 3D interactive portfolio game (WebGL)
├── style.css           # Complete design system & all component styles
├── script.js           # Presentation controller, navigation, slider logic
│
├── Anshul_pfp.PNG      # Profile photo (hero slide)
│
└── assets/             # Project screenshots and visuals
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
    └── urban_mobility.png    # Urban GAN research visualization
```

---

## 🖥️ Main Portfolio (`index.html`)

The main portfolio is a **full-screen, vertical slide-based presentation** — similar to PowerPoint but in the browser. It has **12 slides**, each covering a distinct section of the resume.

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

### Slide Breakdown

| # | Slide Title | Description |
|---|---|---|
| 01 | **Cover / Hero** | Name, title (Full-Stack Developer & AI Researcher), location, email, and social links (GitHub, LinkedIn, LeetCode). Profile photo display. |
| 02 | **About Me** | Professional summary with 4 metric cards: 1st Rank at Industry Conclave 2026, 20K+ Active Users Supported, 95%+ ML Detection Accuracy, 10⁻⁷ KL Divergence on Urban GAN. |
| 03 | **Technical Summary** | Skill tags grouped into 4 categories: Languages & Core, Web & Cloud Infrastructure, AI / Machine Learning, Developer Tools & Systems. |
| 04 | **Work Experience** | Software Development Intern at **Yellow Cube** (Jan–Jul 2025, Navi Mumbai). Covers AWS cloud infra, real-time WebSocket scheduling, IAM security config. Includes an image carousel of 4 CRM screenshots and a link to a demo video. |
| 05 | **Projects Index** | A card-based index of all 4 projects with short descriptions and deep-link navigation buttons. |
| 06 | **Project 01 — Financial RAG System** | Explainable financial background review pipeline using LangGraph multi-agent LLMs, RAG, and ChromaDB vector store. Includes image gallery slider. |
| 07 | **Project 02 — Microplastic Detection** | YOLO-based computer vision pipeline (YOLOv8/v9) with TensorRT inference acceleration and Conditional WGAN-GP synthetic data augmentation. |
| 08 | **Project 03 — Network IDS CNN** | 1D-to-2D feature transformation + CNN for network intrusion detection with 95%+ accuracy and XAI explainability. |
| 09 | **Project 04 — ISKCON Devotee Memorial** | Full-stack MERN platform for digitally preserving ISKCON devotees. 3-tier moderation, JWT auth, Cloudinary CDN, 90+ PageSpeed score. Live site linked. |
| 10 | **Research & Publications** | SCI-published paper on *Generative Adversarial Networks in Urban Digital Twins* (2026). Conditional WGAN-GP — KL Divergence of 9.78×10⁻⁷, outperforming VAE baselines. |
| 11 | **Education & Credentials** | B.Tech CSE at SIT Pune (2023–2027, CGPA 7.45), Class XII & X (CBSE). Certifications: NCA, Full Stack Gen AI, ML A-Z. Honors: 2x SIH Qualifier, Deloitte Hacksplosion L2, 200+ LeetCode problems. |
| 12 | **Bored of Reading?** | Invitation to launch the 3D portfolio game, with feature highlights and a "Launch 3D World" button. Features a retro game console UI card. |

---

## 🎮 3D Portfolio Game (`game.html`)

**"Anshul's World"** is a fully playable **3D interactive experience** built using **WebGL via Three.js (CDN)**, accessible from the final slide. It transforms the portfolio into an explorable virtual space — a unique recruiter engagement tool.

### Features
- **Custom 3D World**: Stylized virtual districts representing different areas of the portfolio (projects, skills, etc.).
- **First-person-style Navigation**: Move through the world using **WASD or Arrow keys**.
- **Interactive Portals/Objects**: Click or approach objects to trigger project information panels.
- **Custom Cursor**: The browser default cursor is hidden and replaced with a custom game cursor.
- **Loading Screen**: Animated gradient loader with a progress bar and phase descriptions before the world renders.
- **Glassmorphism UI Panels**: Project detail cards and info overlays appear with a frosted glass style.
- **Color Palette**: Deep-space dark theme (`#05050f` background) with `#7c83e8` (indigo) accent, `#4ecdc4` (teal), and `#ff9ff3` (pink) gradient highlights.
- **Font**: *Outfit* (Google Fonts) — 300 to 800 weight range.

### Game Controls
| Key | Action |
|---|---|
| `W` / `↑` | Move forward |
| `S` / `↓` | Move backward |
| `A` / `←` | Strafe left |
| `D` / `→` | Strafe right |
| `Click` | Interact with objects / open portals |

---

## 🎨 Design System (`style.css`)

The entire visual identity is defined in a single **~34KB CSS file** — no Tailwind, no Bootstrap.

### Core Design Tokens
```css
:root {
  --bg-primary:    #05050f;    /* Deep space black */
  --bg-secondary:  #0a0a1a;    /* Slide background */
  --accent:        #7c83e8;    /* Indigo accent */
  --accent-glow:   rgba(124,131,232,0.35);
  --text-primary:  #ffffff;
  --glass:         rgba(8,8,24,0.75);  /* Glassmorphism panels */
  --glass-border:  rgba(255,255,255,0.1);
}
```

### Key Design Patterns
- **Glassmorphism** — translucent panels with backdrop blur on cards, control bars, and overlays.
- **Dark Mode First** — deep space color palette throughout.
- **Micro-animations** — hover effects on buttons, slide transitions, nav dot pulses, glow effects.
- **CSS Grid & Flexbox** — fully responsive two-column layouts on each slide.
- **Retro Game UI** — pixel grid, blinking "PRESS START" text, and D-pad console mockup in the Bored slide.
- **Custom Scrollbar** — styled scrollbar matching the dark theme.
- **Gradient Accents** — used on titles, tags, and metric numbers.

---

## ⚙️ JavaScript Controller (`script.js`)

All interactivity is handled by a **single 223-line vanilla JS file**.

### Key Systems

#### Slide Presentation Engine
- Uses `IntersectionObserver` (threshold: 45%) to detect which slide is in the viewport and update the active state, dots, and counter.
- `scrollToSlide(index)` — smoothly scrolls to the target slide using `scrollIntoView`.
- Arrow keys, Page Up/Down, Space, Home, End keyboard shortcuts.

#### Dot Navigation
- 12 sidebar nav dots, each with a hover label.
- Click events on dots call `scrollToSlide()`.

#### Prev/Next Buttons
- Disabled state on first/last slides.
- Live counter in `01 / 12` format.

#### Project Image Slider
- `moveProjectSlider(sliderId, direction)` — cycles through project screenshots with previous/next buttons.
- `setProjectSlider(sliderId, targetIdx)` — jumps directly to a specific image by clicking dot indicators.
- Works on any slider element with the `slider` class and an ID.

#### Mode Toggle (Legacy)
- The codebase retains a `document-mode` / `presentation-mode` toggle handler (the toggle button has since been removed from the HTML, but the logic remains in `script.js` for potential re-activation).

---

## 🤖 ElevenLabs AI Voice Agent

The portfolio integrates an **ElevenLabs Conversational AI widget** embedded directly in `index.html`:

```html
<elevenlabs-convai agent-id="agent_5501kxqsfx1wew8rv19gh6nt983x"></elevenlabs-convai>
<script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
```

This places a voice-chat button on the page that allows visitors to **ask questions about Anshul's experience, projects, and skills** in natural language, powered by a custom ElevenLabs AI agent.

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
| Lines of HTML | ~789 |
| Lines of CSS | ~1,100+ |
| Lines of JS (portfolio) | ~223 |
| Lines of JS (3D game) | ~1,600+ |
| Total Asset Size | ~2.5 MB |
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
