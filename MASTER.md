# MASTER.md — SHR Portfolio Design System
*Single source of truth for all components. Generated from clarifying session.*

---

## Identity
**Brand**: Shusaku Nishiura — SHR
**Disciplines**: Model · Motion Designer · App Creator
**Location**: Tokyo, Japan

---

## Color System — 90 / 10 / 1 Rule

```
Primary   (90% usage)
  --bg:       #0a0a0a     near-black canvas
  --fg:       #f4f4f0     warm off-white text

Secondary (10% usage)
  --muted:    #2a2926     subtle surfaces / dividers
  --subtle:   #1a1917     faintest background tint
  --dimmed:   rgba(244,244,240,0.45)   secondary text

Accent    (1% usage — use sparingly, never for backgrounds)
  --accent:   #c8b99a     warm gold
  --accent-r: rgba(200,185,154,0.12)   tinted glass surface
```

**Banned colors**: purple/pink neon gradients, default Tailwind gradient strings,
any absolute hex not listed above without explicit approval.

---

## Typography

```
Heading: Playfair Display (Google Fonts)
  Variable: --font-playfair
  Weights:  400, 700
  Style:    normal + italic (editorial em)
  Usage:    hero title, project titles, footer CTA

UI / Body: Syne (Google Fonts)
  Variable: --font-syne
  Weights:  400, 500, 600, 700
  Tracking: 0.08em–0.22em on labels, nav links, metadata
  Usage:    nav, category labels, metadata, body copy, CTAs
```

**BANNED fonts**: Inter, Roboto, system-ui, Helvetica Neue, Arial — never use.

---

## Spacing Grid — strict 8px

| Token    | Value  | Token    | Value  |
|----------|--------|----------|--------|
| --s-1    | 8px    | --s-8    | 64px   |
| --s-2    | 16px   | --s-10   | 80px   |
| --s-3    | 24px   | --s-12   | 96px   |
| --s-4    | 32px   | --s-16   | 128px  |
| --s-5    | 40px   | --s-20   | 160px  |
| --s-6    | 48px   | --s-24   | 192px  |

No hardcoded px values outside this grid except for 1px borders and sub-pixel corrections.

---

## WebGL Camera — 1:1 Pixel Mapping

```
Perspective distance  d = 800 (px / WebGL units)
Camera position Z     = 800
FOV (runtime)         = 2 × arctan(H / 2d) × (180/π)
                        → ~59° at 900px height
Coordinate origin     center of viewport
1 WebGL unit          = 1 CSS pixel at z = 0
```

**DOM → WebGL mapping**:
```
x  = rect.left + rect.width/2  − window.innerWidth/2
y  = −(rect.top + rect.height/2 − window.innerHeight/2)
     (inverted: WebGL Y grows up, DOM Y grows down)
```

**Scroll → Camera**:
```
camera.position.y = −lerpedScrollY   (lerp α = 0.10)
```

---

## Animation Easing

| Use case               | Value                          |
|------------------------|--------------------------------|
| LERP smoothing (α)     | 0.10                           |
| GSAP page ease         | power3.out                     |
| Hover transitions      | 150ms–300ms ease-out           |
| Cursor ring            | 0.18 easing factor             |
| Cursor haze            | 0.07 easing factor             |
| Lenis duration         | 1.4                            |
| Section reveal         | 0.9s cubic-bezier(0.22,1,0.36,1) |

---

## Project Data (ordered)

| # | Title                  | Category   | Year        | Route   |
|---|------------------------|------------|-------------|---------|
| 1 | Model Archive          | Editorial  | 2022 — 25   | /model  |
| 2 | Pittanko App           | iOS        | App         | /apps   |
| 3 | Kakeibo App            | iOS        | App         | /apps   |
| 4 | Motion Reel            | Motion     | 2025        | /movie  |
| 5 | AI Video Experiments   | Film       | 2025        | /movie  |
| 6 | Marketing Tests        | Brand      | 2025        | /movie  |
| 7 | Portrait Archive       | Portrait   | ELLE        | /model  |

---

## Hero 3D Scene — Bas-relief / Sculptural Objects

- Style: abstract white sculptures, high-gloss, subtle roughness
- Geometry: IcosahedronGeometry, TorusKnotGeometry, SphereGeometry
- Material: MeshPhysicalMaterial { color: #f4f4f0, roughness: 0.15, metalness: 0.05 }
- Lighting: warm key light (top-right) + accent fill (bottom-left, gold tint)
- Mouse parallax: objects drift 20–40px toward cursor (different speeds per object)
- Fade-out: opacity lerps 0→1 on load (1.2s), lerps 1→0 as scroll enters first project

---

## Project Planes — GLSL Shader

- Geometry: PlaneGeometry at 80vw × 90vh
- Shader uniforms:
  - uTexture: project image (WebP, lazy-loaded)
  - uMouse: normalized cursor position within plane (vec2)
  - uVelocity: mouse speed 0–1 (decays 0.92× per frame)
  - uHover: hover state 0→1 (smoothstep over 300ms)
  - uTime: elapsed seconds
- Effect: wave distortion + chromatic aberration (R/G/B channel split along velocity vector)
- Decay: distortion eases to 0 when cursor leaves (0.92 decay per frame)

---

## Performance Guardrails

- **Desktop first**: full WebGL active ≥ 768px
- **Mobile**: canvas hidden, CSS background-image fallback
- Draw calls target: < 20 per frame
- dpr: [1, 1.5] (no Retina overdraw)
- Textures: WebP, lazy-loaded via useTexture
- Geometries: shared where possible

---

## Preserved Routes (DO NOT TOUCH)

- `/model`  — model archive page (navy dark, existing design)
- `/movie`  — motion/movie page
- `/apps`   — iOS apps page
- `/dark`   — original dark navy homepage
