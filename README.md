# Jesse Yuu Laukvik — Dark Luxury Interactive Portfolio

A premium developer portfolio built with **Next.js 15**, **Three.js**, **GSAP**, and **Framer Motion**.

## 🎨 Features

- ✨ **Custom Gold Cursor** — Lerp-based tracking with trail effect (desktop only)
- 🎬 **Page Load Transition** — Wipe animation on first load
- 🌊 **WebGL Liquid Background** — Simplex noise-based flowing gold veins with mouse interaction
- 🔤 **Chromatic Aberration Glitch** — RGB channel separation on hero headline
- 🎯 **Horizontal Scroll Work Section** — GSAP ScrollTrigger with progress bar
- ⭐ **Skills Constellation Graph** — Interactive force-directed node graph
- 🤖 **Live AI Chat** — Real-time streaming responses from Claude Sonnet
- ♿ **Accessibility** — Respects `prefers-reduced-motion` and touch devices

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion, GSAP with ScrollTrigger
- **3D Rendering**: Three.js with custom GLSL shaders
- **AI**: Anthropic SDK (Claude Sonnet)
- **Fonts**: Cormorant Garamond (300), Inter (400/500), JetBrains Mono (400)

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📋 Environment Variables

Create `.env.local`:

```
ANTHROPIC_API_KEY=your_key_here
```

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── actions/
│       └── chat.ts         # Server action for AI streaming
├── components/
│   ├── CustomCursor.tsx    # Custom cursor component
│   ├── PageLoadTransition.tsx
│   ├── HeroSection.tsx
│   ├── AboutSection.tsx
│   ├── WorkSection.tsx
│   ├── SkillsSection.tsx
│   ├── SkillsConstellationGraph.tsx
│   ├── ContactSection.tsx
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── Marquee.tsx
│   └── WebGLShader.tsx
├── public/
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── package.json
└── README.md
```

## 🎨 Color Palette

- **Background**: `#0A0A0A`
- **Surface**: `#111111`
- **Gold**: `#C9A84C`
- **Gold Glow**: `#E8C76A`
- **Gold Subtle**: `#8B6914`
- **Bronze-Brown**: `#4A3728`
- **Text**: `#F0EDE8`
- **Muted Text**: `#6B6560`

## 📞 Contact

- **Email**: jesse@example.com
- **LinkedIn**: [Your LinkedIn]
- **GitHub**: [Your GitHub]

---

Built by Jesse Yuu Laukvik. Norway, 2026.
