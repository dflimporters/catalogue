(function(){
  const DEFAULT_MS = 8000;

  function initDeck(deckEl){
    const slides = Array.from(deckEl.querySelectorAll('.slide'));
    if(!slides.length) return;

    // progress dots
    const progress = document.createElement('div');
    progress.className = 'progress';
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.addEventListener('click', () => goTo(i));
      progress.appendChild(dot);
    });
    deckEl.appendChild(progress);

    const pauseBadge = document.createElement('div');
    pauseBadge.className = 'pause-badge';
    pauseBadge.textContent = 'Paused — press space to resume';
    deckEl.appendChild(pauseBadge);

    let current = 0;
    let timer = null;
    let paused = false;

    function render(){
      slides.forEach((s, i) => s.classList.toggle('active', i === current));
      Array.from(progress.children).forEach((d, i) => d.classList.toggle('on', i === current));
    }

    function armTimer(){
      clearTimeout(timer);
      if(paused) return;
      const dur = parseInt(slides[current].dataset.duration, 10) || DEFAULT_MS;
      timer = setTimeout(next, dur);
    }

    function next(){
      current = (current + 1) % slides.length;
      render();
      armTimer();
    }

    function prev(){
      current = (current - 1 + slides.length) % slides.length;
      render();
      armTimer();
    }

    function goTo(i){
      current = ((i % slides.length) + slides.length) % slides.length;
      render();
      armTimer();
    }

    function togglePause(){
      paused = !paused;
      deckEl.classList.toggle('paused', paused);
      if(!paused) armTimer(); else clearTimeout(timer);
    }

    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape'){ window.location.href = 'index.html'; }
      else if(e.key === 'ArrowRight'){ next(); }
      else if(e.key === 'ArrowLeft'){ prev(); }
      else if(e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar'){ e.preventDefault(); togglePause(); }
    });

    deckEl.addEventListener('click', (e) => {
      if(e.target.closest('.dot')) return;
      next();
    });

    render();
    armTimer();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.deck').forEach(initDeck);
  });
})();
