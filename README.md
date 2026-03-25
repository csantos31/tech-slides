# Tech Slides

A lightweight, zero-dependency HTML presentation framework with keyboard navigation, slide transitions, and fullscreen mode.

**[Live Demo](https://csantos31.github.io/tech-slides/)**

<img src="screenshot.png" alt="Sample components" width="80%" />

## Features

- **Zero dependencies** — just HTML + CSS + vanilla JS
- **Keyboard navigation** — arrow keys, spacebar, `F` for fullscreen, `T` for theme
- **Click navigation** — visible arrow buttons on screen
- **Fullscreen mode** — built-in button + `F` key (works in VDI/remote desktops where F11 doesn't)
- **Multiple themes** — cycle with `T` or the toolbar button; order and icons live in `TECH_SLIDE_THEMES` in `tech-slides.js`; colors in `[data-theme="…"]` blocks in `tech-slides.css`; preference in localStorage
- **Progress bar** — animated gradient bar at the top
- **Staggered animations** — elements fade in sequentially on slide entry
- **Typography** — Space Grotesk + JetBrains Mono
- **Responsive** — works on desktop, tablet, and mobile
- **Git-friendly** — plain HTML, easy to diff and version
- **Separated assets** — CSS and JS are external files; HTML stays clean

## Built-in Components

| Component | Class | Usage |
|---|---|---|
| Metric cards | `.metrics-grid` > `.metric-card` | Big numbers with labels |
| Before/After columns | `.before-after` > `.ba-col.before` / `.ba-col.after` | Side-by-side comparison |
| Architecture flows | `.arch-flow` | Monospace text with colored highlights |
| Status tags | `.tag.tag-done` / `.tag-progress` / `.tag-accent` / `.tag-phase2` | Inline status badges |
| Tables | Standard `<table>` | Styled with dark header and hover |
| Code | `<code>` | Inline monospace with background |

## Quick Start

```bash
git clone https://github.com/csantos31/tech-slides.git
cd tech-slides
open index.html
```

Edit `index.html` to add your slides. Each slide is a `<div class="slide">` with a `data-slide` attribute (0-indexed).

## File Structure

```
tech-slides/
├── index.html        # Your slides (only HTML — no inline CSS or JS)
├── tech-slides.css   # Theme: colors, typography, components, slide engine
├── tech-slides.js    # Navigation: keyboard, arrows, fullscreen, progress bar
└── README.md
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` `↓` `Space` | Next slide |
| `←` `↑` | Previous slide |
| `F` | Toggle fullscreen |
| `T` | Cycle theme (see `TECH_SLIDE_THEMES`) |
| `ESC` | Exit fullscreen |

## Creating a Slide

```html
<div class="slide" data-slide="0">
    <span class="slide-number">01 / 05</span>
    <h2 class="animate-in delay-1">Slide Title</h2>
    <p class="animate-in delay-2">Content with staggered animation</p>
</div>
```

## Animation Classes

Add `animate-in` + `delay-N` to stagger element entrance:

```html
<h2 class="animate-in delay-1">Appears first</h2>
<p class="animate-in delay-2">Appears second</p>
<div class="animate-in delay-3">Appears third</div>
```

## Customization

Edit CSS variables per theme. Default dark and light are under `:root[data-theme="dark"]` and `:root[data-theme="light"]` in `tech-slides.css`.

## Adding a new palette

1. **CSS** — Add a block (copy an existing one) with a new id:

```css
:root[data-theme="ocean"] {
    --bg: #0a1628;
    --accent: #38bdf8;
    --accent2: #0ea5e9;
    /* …same variables as other themes (surface, text, nav-*, etc.) */
}
```

There is a commented **ocean** example at the bottom of the theme section in `tech-slides.css` you can uncomment and tweak.

2. **JS** — Append one object to `TECH_SLIDE_THEMES` in `tech-slides.js` **in the order you want for the T key cycle**:

```javascript
const TECH_SLIDE_THEMES = [
    { id: 'dark', label: 'Dark', icon: '\u263D' },
    { id: 'light', label: 'Light', icon: '\u2600' },
    { id: 'ocean', label: 'Ocean', icon: '\u2601' },  /* icon = next theme’s preview */
];
```

`icon` is shown on the toolbar for the **next** step in the cycle (what you switch to when pressing `T`). `label` is used for the tooltip and `aria-label`.

3. Optional: set `<html data-theme="ocean">` as the default in your HTML, or leave it to `localStorage` after the first visit.

## License

MIT
