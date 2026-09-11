// Scales each fixed-width 816px "page" to fit its responsive frame. Page
// height is read per-page (transform:scale doesn't affect offsetHeight, so
// this works whether a page is the standard 1056px or a shorter variant
// like the section-divider pages) rather than assumed to always be 1056,
// and lightly highlights the active section in the sticky nav.
(function () {
  var PAGE_W = 816;

  function scaleFrames() {
    document.querySelectorAll('.page-frame').forEach(function (frame) {
      var page = frame.querySelector('.page');
      if (!page) return;
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
})();
