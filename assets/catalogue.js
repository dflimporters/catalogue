// Scales each fixed-width 816px "page" to fit its responsive frame — but
// only above the mobile breakpoint (must match assets/catalogue.css's
// `@media (max-width:680px)` block). Below that width, the CSS reflows the
// page as a real fluid mobile layout instead, so this script just gets out
// of the way (clears any transform/height it previously set) rather than
// visually shrinking the whole canvas. Page height is read per-page
// (transform:scale doesn't affect offsetHeight, so this works whether a
// page is the standard 1056px or a shorter variant like the section-divider
// pages) rather than assumed to always be 1056.
// Also lightly highlights the active section in the sticky nav, and drives
// the mobile hamburger menu.
(function () {
  var PAGE_W = 816;
  var MOBILE_BREAKPOINT = 680;

  function scaleFrames() {
    var isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    document.querySelectorAll('.page-frame').forEach(function (frame) {
      var page = frame.querySelector('.page');
      if (!page) return;
      if (isMobile) {
        page.style.transform = '';
        frame.style.height = '';
        return;
      }
      var naturalHeight = page.offsetHeight;
      var scale = frame.clientWidth / PAGE_W;
      page.style.transform = 'scale(' + scale + ')';
      frame.style.height = Math.round(naturalHeight * scale) + 'px';
    });
  }

  window.addEventListener('resize', scaleFrames);
  window.addEventListener('load', scaleFrames);
  scaleFrames();

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.sitenav a[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = navLinks.find(function (a) { return a.getAttribute('href') === '#' + entry.target.id; });
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (a) { a.classList.remove('active'); });
            link.classList.add('active');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  // Mobile hamburger menu: toggle open/closed. Closing it removes ~500px of
  // in-flow height right as a link's native anchor-jump is being computed,
  // which throws the jump off by that much (it lands wherever the *closed*
  // layout puts that scroll offset, not the intended section). Fix: prevent
  // the default jump, close the menu, then scroll to the target ourselves
  // after a short setTimeout — not a 0ms/rAF callback, both of which proved
  // unreliable here: a same-tick scrollIntoView can race the close reflow
  // (the browser computes it against a not-yet-settled layout and the
  // "smooth" animation never visibly moves), and rAF can be throttled or
  // skipped entirely in a backgrounded/emulated tab. A real setTimeout
  // delay sidesteps both.
  var nav = document.querySelector('.sitenav');
  var toggle = document.querySelector('.nav-toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinks.forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (!nav.classList.contains('open')) return;
        e.preventDefault();
        var href = a.getAttribute('href');
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        setTimeout(function () {
          var target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      });
    });
  }
})();
