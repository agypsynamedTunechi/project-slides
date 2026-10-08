(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var count = document.getElementById('count');
  var progress = document.getElementById('progress');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var current = 0;

  function show(n) {
    current = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach(function (s, k) {
      var on = k === current;
      s.classList.toggle('active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    count.textContent = (current + 1) + ' of ' + slides.length;
    progress.style.width = ((current + 1) / slides.length * 100) + '%';
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;
    slides[current].scrollTop = 0;
    try { history.replaceState(null, '', '#' + (current + 1)); } catch (e) {}
  }
  function next() { show(current + 1); }
  function prev() { show(current - 1); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var onButton = e.target && e.target.tagName === 'BUTTON';
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': next(); break;
      case 'ArrowLeft': case 'PageUp': prev(); break;
      case ' ': if (!onButton) { e.preventDefault(); next(); } break;
      case 'Home': show(0); break;
      case 'End': show(slides.length - 1); break;
      case 'f': case 'F': toggleFullscreen(); break;
      case 't': case 'T': toggleTheme(); break;
    }
  });

  var startX = 0, startY = 0;
  document.addEventListener('touchstart', function (e) {
    startX = e.changedTouches[0].clientX; startY = e.changedTouches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 60 && Math.abs(dy) < 60) { dx < 0 ? next() : prev(); }
  }, { passive: true });

  // Theme: follows the device by default, T or the button overrides it
  var root = document.documentElement;
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function toggleTheme() { root.setAttribute('data-theme', isDark() ? 'light' : 'dark'); }
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);

  // Full screen
  var fsBtn = document.getElementById('fsBtn');
  function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) { root.requestFullscreen && root.requestFullscreen(); }
      else { document.exitFullscreen && document.exitFullscreen(); }
    } catch (e) {return e('Fullscreen API error', e);}
  }
  if (!document.fullscreenEnabled) { fsBtn.style.display = 'none'; }
  fsBtn.addEventListener('click', toggleFullscreen);

  // Dashboard slide: switch between the two captured views
  var captions = {
    econ: 'Economy tab: FAAC allocation by LGA, April 2026',
    edu: 'Education tab: primary schools by LGA, 2012'
  };
  var viewButtons = document.querySelectorAll('[data-view]');
  var viewImages = document.querySelectorAll('[data-img]');
  Array.prototype.forEach.call(viewButtons, function (btn) {
    btn.addEventListener('click', function () {
      var v = btn.getAttribute('data-view');
      Array.prototype.forEach.call(viewButtons, function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      Array.prototype.forEach.call(viewImages, function (img) {
        img.hidden = img.getAttribute('data-img') !== v;
      });
      document.getElementById('shotCaption').textContent = captions[v];
    });
  });

  var start = parseInt((location.hash || '').replace('#', ''), 10);
  show(isNaN(start) ? 0 : start - 1);
})();