/* levimc-kit vanilla runtime for pages without React (static pages, Doxygen): the GlobalBar's theme and
   language menus, <details> menus, and the footer year. static/build-static.mjs builds kit.js from this file
   (it fills in the shared preference code and the chrome strings). Include once, deferred:
     <script src="kit.js" defer></script>
   after the pre-paint script (theme-init.js) in <head>.
   - Theme: Auto (default) / Light / Dark, stored for every LeviMC site (cookie levimc_theme on levimc.org).
   - Language: the chrome (bar, footer, skip link) follows the visitor's language preference (cookie levimc_lang);
     choosing one in the menu stores it for every LeviMC site and translates the chrome in place. */
(function () {
  'use strict';
  /*__PREFS_CORE__*/
  var STR = /*__STRINGS__*/ {};
  var NAMES = /*__NAMES__*/ {};
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var doxygen = root.classList.contains('dark-mode') || root.classList.contains('light-mode') || root.hasAttribute('data-kit-doxygen');
  var THEME_KEYS = { auto: 'themeAuto', light: 'themeLight', dark: 'themeDark' };

  function each(sel, fn) {
    var n = document.querySelectorAll(sel);
    for (var i = 0; i < n.length; i++) fn(n[i]);
  }
  function uiLocale(tag) {
    var L = [];
    for (var k in STR) if (Object.prototype.hasOwnProperty.call(STR, k)) L.push({ c: k, l: k });
    var i = ml(tag, L);
    return i < 0 ? 'en' : L[i].c;
  }
  function chromeLocale() {
    var a = document.querySelector('[data-kit-lang-value].is-active');
    return a ? a.getAttribute('data-kit-lang-value') : uiLocale(root.lang || 'en');
  }
  function strings() {
    return STR[chromeLocale()] || STR.en;
  }

  // ------------------------------------------------------------------ theme
  function readTheme() {
    var v = rp('theme');
    return v === 'light' || v === 'dark' ? v : 'auto';
  }
  function sysDark() {
    return !!(mq && mq.matches);
  }
  function applyTheme(pref, persist) {
    var dark = pref === 'dark' || (pref === 'auto' && sysDark());
    root.classList.add('kit-no-transition');
    root.classList.toggle('dark', dark);
    if (doxygen) {
      root.classList.toggle('dark-mode', dark);
      root.classList.toggle('light-mode', !dark);
    }
    root.setAttribute('data-theme-pref', pref);
    root.style.colorScheme = dark ? 'dark' : 'light';
    if (persist) wp('theme', pref);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.classList.remove('kit-no-transition');
      });
    });
    labelTheme();
  }
  function labelTheme() {
    var S = strings();
    var pref = root.getAttribute('data-theme-pref') || 'auto';
    if (pref === 'system') pref = 'auto';
    each('[data-kit-theme-toggle]', function (b) {
      b.setAttribute('aria-label', S.theme + ': ' + S[THEME_KEYS[pref]]);
    });
    each('[data-kit-theme-value]', function (o) {
      o.setAttribute('aria-checked', String(o.getAttribute('data-kit-theme-value') === pref));
    });
  }

  // ------------------------------------------------------------------ language (chrome only)
  function translate(code) {
    var S = STR[code];
    if (!S) return;
    each('[data-kit-t]', function (el) {
      var k = el.getAttribute('data-kit-t');
      var v = k.indexOf('projectBlurbs.') === 0 ? S.projectBlurbs[k.slice(14)] : S[k];
      if (typeof v === 'string') el.textContent = v;
    });
    each('[data-kit-t-aria]', function (el) {
      var v = S[el.getAttribute('data-kit-t-aria')];
      if (typeof v === 'string') el.setAttribute('aria-label', v);
    });
    each('[data-kit-t-title]', function (el) {
      var v = S[el.getAttribute('data-kit-t-title')];
      if (typeof v === 'string') el.setAttribute('title', v);
    });
    each('.kit-gbar, .kit-footer, .kit-skip-link', function (el) {
      el.setAttribute('lang', code);
    });
    // the language menu: check the new language, move the check mark, relabel the trigger
    var check = null;
    each('[data-kit-lang-value]', function (o) {
      var on = o.getAttribute('data-kit-lang-value') === code;
      o.setAttribute('aria-checked', String(on));
      o.classList.toggle('is-active', on);
      var c = o.querySelector('.kit-menu-check');
      if (c && !on) {
        check = c;
        c.parentNode.removeChild(c);
      }
    });
    each('[data-kit-lang-value].is-active', function (o) {
      if (check && !o.querySelector('.kit-menu-check')) o.appendChild(check.cloneNode(true));
    });
    each('[data-kit-locale-switcher]', function (s) {
      s.setAttribute('aria-label', S.language + ': ' + (NAMES[code] || code));
      var l = s.querySelector('.kit-menu-trigger-label');
      if (l) {
        l.textContent = NAMES[code] || code;
        l.setAttribute('lang', code);
      }
    });
    labelTheme();
  }
  function applyLanguagePref() {
    var p = rp('lang');
    var code = p ? uiLocale(p) : null;
    if (code && code !== chromeLocale() && document.querySelector('[data-kit-lang-value]')) translate(code);
    root.classList.remove('kit-chrome-pending');
  }

  // ------------------------------------------------------------------ menus + clicks
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target : null;
    var th = t && t.closest('[data-kit-theme-value]');
    if (th) {
      applyTheme(th.getAttribute('data-kit-theme-value'), true);
    }
    var lg = t && t.closest('[data-kit-lang-value]');
    if (lg) {
      var code = lg.getAttribute('data-kit-lang-value');
      wp('lang', code);
      if (lg.tagName === 'BUTTON') translate(uiLocale(code));
    }
    // close <details class="kit-menu"> when clicking outside or choosing an item inside
    each('details.kit-menu[open]', function (d) {
      var inside = t && d.contains(t);
      var choice = inside && t.closest('.kit-menu-panel a, .kit-menu-panel button');
      if (!inside || choice) {
        d.open = false;
        if (choice && choice.tagName === 'BUTTON') {
          var s = d.querySelector('summary');
          if (s) s.focus();
        }
      }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    each('details.kit-menu[open]', function (d) {
      d.open = false;
      var s = d.querySelector('summary');
      if (s) s.focus();
    });
  });
  // tabbing out of an open menu closes it
  document.addEventListener('focusout', function (e) {
    var to = e.relatedTarget;
    if (!to) return;
    each('details.kit-menu[open]', function (d) {
      if (d.contains(e.target) && !d.contains(to)) d.open = false;
    });
  });
  document.addEventListener(
    'toggle',
    function (e) {
      var d = e.target;
      if (!d || !d.matches || !d.matches('details.kit-menu') || !d.open) return;
      each('details.kit-menu[open]', function (o) {
        if (o !== d && !o.contains(d)) o.open = false;
      });
    },
    true,
  );

  // ------------------------------------------------------------------ live updates
  if (mq && mq.addEventListener)
    mq.addEventListener('change', function () {
      if (readTheme() === 'auto') applyTheme('auto', false);
    });
  function resync() {
    var p = readTheme();
    if (root.getAttribute('data-theme-pref') !== p) applyTheme(p, false);
    applyLanguagePref();
  }
  window.addEventListener('storage', function (e) {
    if (e.key === PS.theme || e.key === PS.lang) resync();
  });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') resync();
  });

  // footer year follows the reader's clock (the snippet carries the year it was built in)
  var y = new Date().getFullYear();
  each('[data-kit-year]', function (e) {
    if (y > +e.textContent) e.textContent = String(y);
  });
  applyTheme(readTheme(), false);
  applyLanguagePref();
})();
