/* =========================================================
   董芸辰 個人網站 — script.js
   ========================================================= */

/* ---------- 1. 圖示：用內嵌 SVG 取代 Font Awesome（不需外部套件） ---------- */
const ICONS = {
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    bars: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    'arrow-down': '<path d="M12 5v14M19 12l-7 7-7-7"/>',
    graduate: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    list: '<path d="M10 6h11M10 12h11M10 18h11"/><path d="m3 6 1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17"/>',
    compass: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
    hand: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
    book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    sprout: '<path d="M12 21v-10"/><path d="M12 11C12 7 9 4 4 4c0 4 3 7 8 7z"/><path d="M12 13c0-3 2.5-6 8-6 0 4-3 6-8 6z"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 16v-4M12 16V8M17 16v-7"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    bulb: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
    'check-circle': '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.2-6"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    microscope: '<path d="M6 18h8M3 22h18M14 22a7 7 0 1 0 0-14h-1M9 14h2M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2zM12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    cake: '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1M2 21h20M7 8v3M12 8v3M17 8v3M7 4h.01M12 4h.01M17 4h.01"/>',
    gem: '<path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20M12 22 8 9l3-6M12 22l4-13-3-6"/>',
    laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 20h20"/>',
    film: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 7.5h4M3 12h18M3 16.5h4M17 7.5h4M17 16.5h4"/>',
    cookie: '<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5h.01M16 15.5h.01M12 12h.01M11 17h.01M7 14h.01"/>',
    shapes: '<path d="M8.3 10a.7.7 0 0 1-.6-1.1l3.7-6a.7.7 0 0 1 1.2 0l3.7 6a.7.7 0 0 1-.6 1.1z"/><rect x="3" y="14" width="7" height="7" rx="1"/><circle cx="17.5" cy="17.5" r="3.5"/>',
    tv: '<rect x="2" y="7" width="20" height="15" rx="2"/><path d="m17 2-5 5-5-5"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'
};

function svgIcon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
}

function renderIcons(root = document) {
    root.querySelectorAll('i[data-icon]').forEach(el => {
        el.innerHTML = svgIcon(el.dataset.icon);
    });
}
renderIcons();

/* ---------- 小工具：安全讀寫 localStorage ---------- */
const store = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* 無法儲存時忽略 */ } }
};

/* ---------- 2. 年份 ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- 3. 深色 / 淺色模式（會記住你的選擇） ---------- */
const root = document.documentElement;
const savedTheme = store.get('yc-theme');
if (savedTheme === 'dark' || savedTheme === 'light') root.dataset.theme = savedTheme;

function isDark() {
    if (root.dataset.theme) return root.dataset.theme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

document.getElementById('themeToggle').addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    store.set('yc-theme', next);
});

/* ---------- 4. 手機版選單 ---------- */
const menuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function setMenu(open) {
    mobileMenu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('i').dataset.icon = open ? 'close' : 'bars';
    renderIcons(menuBtn);
}
menuBtn.addEventListener('click', () => setMenu(mobileMenu.hidden));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

/* ---------- 5. 導覽列：捲動陰影 + 目前所在區塊高亮 ---------- */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = ['about', 'skills', 'research', 'diy', 'contact']
    .map(id => document.getElementById(id));

function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 8);

    let current = '';
    const line = window.innerHeight * 0.35;
    sections.forEach(sec => {
        if (sec.getBoundingClientRect().top <= line) current = sec.id;
    });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- 共用：分頁按鈕切換樣式 ---------- */
function activateTab(buttons, activeBtn) {
    buttons.forEach(b => {
        const on = b === activeBtn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', String(on));
    });
}

/* ---------- 6. 技能篩選 ---------- */
const skillBtns = document.querySelectorAll('[data-skill]');
const skillCards = document.querySelectorAll('.skill-card');

skillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const cat = btn.dataset.skill;
        activateTab(skillBtns, btn);
        skillCards.forEach(card => {
            const show = cat === 'all' || card.dataset.cat === cat;
            card.dataset.hide = String(!show);
            if (show) {
                card.classList.remove('fade-in');
                void card.offsetWidth; // 重新觸發動畫
                card.classList.add('fade-in');
            }
        });
    });
});

/* ---------- 7. 手作分頁 ---------- */
const diyBtns = document.querySelectorAll('[data-diy]');
const diyPanels = document.querySelectorAll('.diy-panel');

diyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        activateTab(diyBtns, btn);
        diyPanels.forEach(p => {
            const show = p.id === 'diy-' + btn.dataset.diy;
            p.hidden = !show;
            if (show) {
                p.classList.remove('fade-in');
                void p.offsetWidth;
                p.classList.add('fade-in');
            }
        });
    });
});

/* ---------- 8. 研究所目標清單：可以打勾（會記住） ---------- */
const goalBtns = document.querySelectorAll('.goal-check');
let goalState = [];
try { goalState = JSON.parse(store.get('yc-goals') || '[]'); } catch (e) { goalState = []; }

function paintGoal(btn, done) {
    btn.setAttribute('aria-pressed', String(done));
    btn.innerHTML = done ? '<i data-icon="check"></i>' : '';
    if (done) renderIcons(btn);
}

goalBtns.forEach((btn, i) => {
    paintGoal(btn, !!goalState[i]);
    btn.addEventListener('click', () => {
        const done = btn.getAttribute('aria-pressed') !== 'true';
        paintGoal(btn, done);
        goalState[i] = done;
        store.set('yc-goals', JSON.stringify(goalState));
    });
});

/* ---------- 9. 評論分析示意 ---------- */
const reviewBtn = document.getElementById('reviewToggle');
const reviewText = document.getElementById('reviewText');
const aspects = document.getElementById('aspects');

reviewBtn.addEventListener('click', () => {
    const on = !reviewText.classList.contains('analyzed');
    reviewText.classList.toggle('analyzed', on);
    aspects.hidden = !on;
    reviewBtn.setAttribute('aria-pressed', String(on));
    reviewBtn.textContent = on ? '隱藏分析結果' : '顯示分析結果';
});
