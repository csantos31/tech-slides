/* Tech Slides — Lightweight HTML Presentation Engine
   Usage: <script src="tech-slides.js"></script> (at end of body)
   Requires: slides with class="slide" and data-slide="N",
             progress bar with id="progress",
             nav buttons with id="btnPrev" and id="btnNext",
             fullscreen button with id="btnFs"
             theme button with id="btnTheme" (optional)

   Keyboard shortcuts:
     → ↓ Space  Next slide
     ← ↑        Previous slide
     F           Toggle fullscreen
     T           Cycle theme (see TECH_SLIDE_THEMES)
     ESC         Exit fullscreen (native browser) */

/**
 * Theme registry — order = cycle order (T key). Each row needs matching CSS:
 *   :root[data-theme="<id>"] { --bg: …; … }
 * Toolbar shows `icon` of the *next* theme (what you switch to next).
 */
const TECH_SLIDE_THEMES = [
    { id: 'dark', label: 'Dark', icon: '\u263D' },
    { id: 'light', label: 'Light', icon: '\u2600' },
    { id: 'ocean', label: 'Ocean', icon: '\u2601' },
];

const THEME_STORAGE_KEY = 'tech-slides-theme';

document.body.classList.add('slides-mode');

/* ── Slide navigation ────────────────────────────────────────────── */

const slides = document.querySelectorAll('.slide');
const progress = document.getElementById('progress');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const total = slides.length;
let current = 0;

function update() {
    slides.forEach((s, i) => {
        s.classList.remove('active');
        s.style.opacity = '0';
        s.style.pointerEvents = 'none';
        s.style.transform = i > current ? 'translateX(60px)' : 'translateX(-60px)';
    });
    const active = slides[current];
    active.classList.add('active');
    active.style.opacity = '1';
    active.style.pointerEvents = 'all';
    active.style.transform = 'translateX(0)';
    progress.style.width = ((current + 1) / total * 100) + '%';
    btnPrev.classList.toggle('hidden', current === 0);
    btnNext.classList.toggle('hidden', current === total - 1);
}

function goTo(index) {
    if (index < 0 || index >= total || index === current) return;
    current = index;
    update();
}

/* ── Fullscreen ──────────────────────────────────────────────────── */

function toggleFs() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen();
    }
}

document.addEventListener('fullscreenchange', () => {
    const btn = document.getElementById('btnFs');
    if (!btn) return;
    if (document.fullscreenElement) {
        btn.textContent = '\u2715';
        btn.setAttribute('aria-label', 'Exit fullscreen');
        btn.setAttribute('title', 'Exit fullscreen (Esc)');
    } else {
        btn.textContent = '\u26F6';
        btn.setAttribute('aria-label', 'Toggle fullscreen');
        btn.setAttribute('title', 'Fullscreen (F)');
    }
});

/* ── Themes (data-theme on <html>, cycle via TECH_SLIDE_THEMES) ─── */

function getTheme() {
    const t = document.documentElement.dataset.theme;
    if (t && TECH_SLIDE_THEMES.some((x) => x.id === t)) return t;
    return 'dark';
}

function setTheme(themeId) {
    if (!TECH_SLIDE_THEMES.some((x) => x.id === themeId)) themeId = 'dark';
    document.documentElement.dataset.theme = themeId;
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
    updateThemeButton();
}

function cycleTheme() {
    const i = TECH_SLIDE_THEMES.findIndex((x) => x.id === getTheme());
    const idx = i >= 0 ? i : 0;
    const next = TECH_SLIDE_THEMES[(idx + 1) % TECH_SLIDE_THEMES.length];
    setTheme(next.id);
}

/** @deprecated use cycleTheme — kept for older HTML that calls toggleTheme */
function toggleTheme() {
    cycleTheme();
}

function updateThemeButton() {
    const btn = document.getElementById('btnTheme');
    if (!btn) return;
    const i = TECH_SLIDE_THEMES.findIndex((x) => x.id === getTheme());
    const idx = i >= 0 ? i : 0;
    const next = TECH_SLIDE_THEMES[(idx + 1) % TECH_SLIDE_THEMES.length];
    btn.textContent = next.icon;
    btn.title = `Next: ${next.label} (T)`;
    btn.setAttribute('aria-label', `Switch to ${next.label} theme`);
}

function initThemeFromStorage() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && TECH_SLIDE_THEMES.some((t) => t.id === saved)) {
        document.documentElement.dataset.theme = saved;
    } else if (saved && !TECH_SLIDE_THEMES.some((t) => t.id === saved)) {
        document.documentElement.dataset.theme = 'dark';
    }
    updateThemeButton();
}

initThemeFromStorage();

/* ── Keyboard ────────────────────────────────────────────────────── */

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        goTo(current + 1);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goTo(current - 1);
    }
    if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFs();
    }
    if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        cycleTheme();
    }
});

update();
