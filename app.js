(() => {
  const screens = [...document.querySelectorAll('.screen')];
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const stage = document.getElementById('stage');
  const helpDialog = document.getElementById('helpDialog');
  const helpOpen = document.getElementById('helpOpen');

  let current = 0;
  let touchStartX = null;
  const guidedLast = 8;
  const labels = ['준비', '물', '바람', '눈', '움직임', '작은 일', '집중', '사람', '마음정리', '완료'];

  function show(index) {
    index = Math.max(0, Math.min(index, screens.length - 1));
    screens.forEach((screen, i) => {
      screen.classList.toggle('active', i === index);
      screen.classList.toggle('exit-left', i < index);
    });
    current = index;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= screens.length - 1;
    const progressIndex = Math.min(current, guidedLast);
    const pct = current === 0 ? 0 : Math.round((progressIndex / guidedLast) * 100);
    progressFill.style.width = pct + '%';
    progressText.textContent = labels[current] || '';
  }

  function next() { show(current + 1); }
  function prev() { show(current - 1); }
  function restart() { show(0); }

  document.querySelectorAll('[data-next]').forEach(btn => btn.addEventListener('click', next));
  document.querySelectorAll('[data-skip]').forEach(btn => btn.addEventListener('click', next));
  document.querySelectorAll('[data-restart]').forEach(btn => btn.addEventListener('click', restart));
  document.getElementById('betterBtn').addEventListener('click', () => show(9));
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  helpOpen.addEventListener('click', () => helpDialog.showModal());

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });

  stage.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  stage.addEventListener('touchend', e => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) < 60) return;
    if (dx < 0) next(); else prev();
  }, { passive: true });

  document.addEventListener('keydown', e => {
    if (helpDialog.open) return;
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  show(0);

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
})();