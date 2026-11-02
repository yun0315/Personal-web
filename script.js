/* ================================================================
   董芸辰 個人網站 — script.js（互動加分功能）
   ----------------------------------------------------------------
   ※ 這個版本的網站「沒有 JS 也能正常使用」：
     圖示、勾選清單、分頁切換、手機選單、評論分析都由 HTML + CSS 完成。
   ※ 這支 JS 只負責以下加分功能：
     1. 自動更新頁尾年份
     2. 深色 / 淺色模式切換（並記住選擇）
     3. 手機選單：點了連結後自動收起
     4. 導覽列：往下捲時加陰影、標示目前所在區塊
     5. 研究所期望清單：記住勾選狀態（重新整理後還在）
   ※ 每個功能都包在 try...catch 裡，就算某一段出錯，也不會影響其他功能。
   ================================================================ */

(function () {
    'use strict'; // 嚴格模式：幫忙抓出常見寫法錯誤

    /* ------------------------------------------------------------
       小工具：安全地讀寫瀏覽器儲存空間（localStorage）
       有些情況（無痕模式、直接開本機檔案的某些瀏覽器）會禁止儲存，
       用 try...catch 包起來，失敗時就安靜地略過。
       ------------------------------------------------------------ */
    var store = {
        get: function (key) {
            try { return window.localStorage.getItem(key); } catch (e) { return null; }
        },
        set: function (key, value) {
            try { window.localStorage.setItem(key, value); } catch (e) { /* 無法儲存就略過 */ }
        }
    };

    /* ------------------------------------------------------------
       1. 頁尾年份：自動換成今年
       ------------------------------------------------------------ */
    try {
        var yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    } catch (e) { console.warn('年份更新失敗：', e); }

    /* ------------------------------------------------------------
       2. 深色 / 淺色模式
       - 預設跟隨電腦／手機的系統設定
       - 按右上角按鈕後，在 <html> 加上 data-theme="dark" 或 "light"
         （style.css 會依照這個屬性換顏色）
       - 選擇會存起來，下次打開網站時沿用
       ------------------------------------------------------------ */
    try {
        var root = document.documentElement; // 就是 <html> 元素
        var saved = store.get('yc-theme');
        if (saved === 'dark' || saved === 'light') {
            root.setAttribute('data-theme', saved);
        }

        // 判斷「現在」是不是深色
        var isDark = function () {
            var t = root.getAttribute('data-theme');
            if (t) return t === 'dark';
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        };

        var themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', function () {
                var next = isDark() ? 'light' : 'dark';
                root.setAttribute('data-theme', next);
                store.set('yc-theme', next);
            });
        }
    } catch (e) { console.warn('深色模式設定失敗：', e); }

    /* ------------------------------------------------------------
       3. 手機選單：點了選單裡的連結後，自動把選單收起來
       （開關本身是 checkbox，由 CSS 控制；這裡只是把它取消勾選）
       ------------------------------------------------------------ */
    try {
        var navToggle = document.getElementById('navToggle');
        var menuLinks = document.querySelectorAll('#mobileMenu a');
        for (var i = 0; i < menuLinks.length; i++) {
            menuLinks[i].addEventListener('click', function () {
                if (navToggle) navToggle.checked = false;
            });
        }
        // 螢幕變寬（例如手機轉橫向）時，也把選單收起來
        window.addEventListener('resize', function () {
            if (navToggle && window.innerWidth >= 768) navToggle.checked = false;
        });
    } catch (e) { console.warn('手機選單設定失敗：', e); }

    /* ------------------------------------------------------------
       4. 導覽列效果
       - 往下捲超過 8px：導覽列加上陰影（.scrolled）
       - 捲到哪個區塊，上方對應的選單文字就變綠色並加底線（.active）
       ------------------------------------------------------------ */
    try {
        var navbar = document.getElementById('navbar');
        var navLinks = document.querySelectorAll('.nav-links a');
        var sectionIds = ['about', 'skills', 'research', 'diy', 'contact'];
        var sections = [];
        for (var s = 0; s < sectionIds.length; s++) {
            var el = document.getElementById(sectionIds[s]);
            if (el) sections.push(el);
        }

        var onScroll = function () {
            if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 8);

            // 找出「最後一個頂端已經捲過畫面 35% 位置」的區塊
            var current = '';
            var line = window.innerHeight * 0.35;
            for (var k = 0; k < sections.length; k++) {
                if (sections[k].getBoundingClientRect().top <= line) current = sections[k].id;
            }
            // 捲到最底部時，強制標示最後一個區塊（聯絡方式）
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2 && sections.length) {
                current = sections[sections.length - 1].id;
            }

            for (var n = 0; n < navLinks.length; n++) {
                var href = navLinks[n].getAttribute('href');
                navLinks[n].classList.toggle('active', href === '#' + current);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // 一打開頁面就先執行一次
    } catch (e) { console.warn('導覽列效果設定失敗：', e); }

    /* ------------------------------------------------------------
       5. 研究所期望清單：記住勾選狀態
       （勾選本身是原生 checkbox，不靠 JS 也能勾；這裡只負責「記住」）
       ------------------------------------------------------------ */
    try {
        var goals = document.querySelectorAll('.goal-input');
        var state = {};
        try { state = JSON.parse(store.get('yc-goals') || '{}') || {}; } catch (e) { state = {}; }

        for (var g = 0; g < goals.length; g++) {
            var box = goals[g];
            if (state[box.id]) box.checked = true; // 還原上次的勾選

            box.addEventListener('change', function (ev) {
                state[ev.target.id] = ev.target.checked;
                store.set('yc-goals', JSON.stringify(state));
            });
        }
    } catch (e) { console.warn('勾選清單設定失敗：', e); }
})();
