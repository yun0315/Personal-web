/* =====================================================================
   董芸辰 個人網站 — script.js
   ---------------------------------------------------------------------
   這一版的重點：網站「沒有這個檔案也能正常使用」。
   圖示、打勾、分頁、手機選單都已經用 HTML + CSS 完成，
   這裡只負責加分功能：
     1. 自動更新頁尾年份
     2. 深色 / 淺色模式切換（並記住選擇）
     3. 手機選單：點連結後自動收起、支援鍵盤
     4. 導覽列：往下捲加陰影、標示目前所在區塊
     5. 記住「研究所生涯期望」的打勾狀態
   每個功能都用 safe() 包起來：就算其中一個出錯，其他功能照常運作。
   打開瀏覽器的「開發人員工具 → Console」可以看到哪個功能出錯。
   ===================================================================== */

(function () {
    'use strict';

    /* ---------------------------------------------------------------
       小工具 1：safe(名稱, 函式)
       執行某個功能；如果出錯，只在 Console 顯示警告，不會讓整支程式停掉。
       --------------------------------------------------------------- */
    function safe(name, fn) {
        try {
            fn();
        } catch (err) {
            console.warn('[個人網站] 「' + name + '」功能發生錯誤：', err);
        }
    }

    /* ---------------------------------------------------------------
       小工具 2：store
       安全地讀寫 localStorage（瀏覽器的小型儲存空間）。
       無痕模式或瀏覽器封鎖儲存時，讀取回傳 null、寫入直接略過，不會報錯。
       --------------------------------------------------------------- */
    var store = {
        get: function (key) {
            try { return window.localStorage.getItem(key); } catch (e) { return null; }
        },
        set: function (key, value) {
            try { window.localStorage.setItem(key, value); } catch (e) { /* 無法儲存就算了 */ }
        }
    };


    /* ===============================================================
       1. 頁尾年份：把 HTML 寫死的 2026 換成今年
       =============================================================== */
    safe('年份', function () {
        var yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    });


    /* ===============================================================
       2. 深色 / 淺色模式
       - 在 <html> 加上 data-theme="dark" 或 "light"，CSS 就會切換配色
       - 選擇存在 localStorage，下次打開網站會記得
       - 沒按過按鈕時，跟隨系統設定（CSS 的 prefers-color-scheme 負責）
       =============================================================== */
    safe('深色模式', function () {
        var root = document.documentElement;
        var btn = document.getElementById('themeToggle');

        // (1) 讀取上次的選擇
        var saved = store.get('yc-theme');
        if (saved === 'dark' || saved === 'light') {
            root.setAttribute('data-theme', saved);
        }

        // (2) 判斷「現在」是不是深色
        function isDark() {
            var t = root.getAttribute('data-theme');
            if (t) return t === 'dark';
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        // (3) 按下按鈕：切換並儲存
        if (btn) {
            btn.addEventListener('click', function () {
                var next = isDark() ? 'light' : 'dark';
                root.setAttribute('data-theme', next);
                store.set('yc-theme', next);
            });
        }
    });


    /* ===============================================================
       3. 手機選單
       開 / 關本身由 HTML 的 checkbox（#menuToggle）+ CSS 完成，
       這裡補上兩個體驗：
         (a) 點了選單裡的連結後，自動把選單收起來
         (b) 用鍵盤 Tab 到漢堡按鈕時，按 Enter 或空白鍵也能開關
       =============================================================== */
    safe('手機選單', function () {
        var toggle = document.getElementById('menuToggle');
        var menuBtn = document.querySelector('.menu-btn');
        var menu = document.getElementById('mobileMenu');
        if (!toggle || !menu) return;

        // (a) 點連結 → 取消勾選 → 選單收起
        var links = menu.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function () {
                toggle.checked = false;
                syncAria();
            });
        }

        // (b) 鍵盤 Enter / 空白鍵
        if (menuBtn) {
            menuBtn.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle.checked = !toggle.checked;
                    syncAria();
                }
            });
        }

        // 讓螢幕閱讀器知道選單現在是開還是關
        function syncAria() {
            if (menuBtn) menuBtn.setAttribute('aria-expanded', String(toggle.checked));
        }
        toggle.addEventListener('change', syncAria);
        syncAria();
    });


    /* ===============================================================
       4. 導覽列效果
         (a) 頁面往下捲超過 8px，導覽列加上陰影（.scrolled）
         (b) 根據目前看到的區塊，把對應的導覽連結加上 .active（底線 + 綠色）
       =============================================================== */
    safe('導覽列效果', function () {
        var navbar = document.getElementById('navbar');
        var navLinks = document.querySelectorAll('.nav-links a');
        var ids = ['about', 'skills', 'research', 'diy', 'contact'];

        // 只留下頁面上真的存在的區塊，避免找不到元素而出錯
        var sections = [];
        for (var i = 0; i < ids.length; i++) {
            var el = document.getElementById(ids[i]);
            if (el) sections.push(el);
        }

        function onScroll() {
            // (a) 陰影
            if (navbar) {
                if (window.scrollY > 8) navbar.classList.add('scrolled');
                else navbar.classList.remove('scrolled');
            }

            // (b) 找出「頂端已經捲過畫面 35% 高度」的最後一個區塊
            var current = '';
            var line = window.innerHeight * 0.35;
            for (var j = 0; j < sections.length; j++) {
                if (sections[j].getBoundingClientRect().top <= line) current = sections[j].id;
            }
            for (var k = 0; k < navLinks.length; k++) {
                var match = navLinks[k].getAttribute('href') === '#' + current;
                navLinks[k].classList.toggle('active', match);
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        onScroll(); // 一載入就先執行一次
    });


    /* ===============================================================
       5. 記住「研究所生涯期望」的打勾狀態
       打勾本身是 HTML checkbox，本來就能點；
       這裡把勾選結果存起來，重新整理或下次打開時還會在。
       存的格式：{"goal-1":true,"goal-2":false,...}
       =============================================================== */
    safe('目標打勾記憶', function () {
        var inputs = document.querySelectorAll('.goal-input');
        if (!inputs.length) return;

        // (1) 讀取舊資料
        var state = {};
        try {
            state = JSON.parse(store.get('yc-goals') || '{}') || {};
        } catch (e) {
            state = {};
        }

        // (2) 套用到畫面，並監聽之後的變化
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if (state[input.id] === true) input.checked = true;

            input.addEventListener('change', function (e) {
                state[e.target.id] = e.target.checked;
                store.set('yc-goals', JSON.stringify(state));
            });
        }
    });

})();
