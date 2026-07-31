gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const mapSection = document.getElementById('mapSection');
const closeBtn = document.getElementById('closeMap');

let permanentlyUnpinned = false;
let locked = false;

const BLOCKED_KEYS = new Set([
  'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '
]);

function preventScrollKey(e) {
  if (BLOCKED_KEYS.has(e.key)) e.preventDefault();
}

function preventScrollEvent(e) {
  e.preventDefault();
}

function lockScroll() {
  if (locked || permanentlyUnpinned) return;
  locked = true;
  lenis.stop();
  window.addEventListener('wheel', preventScrollEvent, { passive: false });
  window.addEventListener('touchmove', preventScrollEvent, { passive: false });
  window.addEventListener('keydown', preventScrollKey);
}

function unlockScroll() {
  locked = false;
  lenis.start();
  window.removeEventListener('wheel', preventScrollEvent);
  window.removeEventListener('touchmove', preventScrollEvent);
  window.removeEventListener('keydown', preventScrollKey);
}

const mapTrigger = ScrollTrigger.create({
  trigger: mapSection,
  start: 'top top',
  end: 'bottom top',
  pin: true,
  pinSpacing: true,
  onEnter: lockScroll,
  onEnterBack: lockScroll,
});

closeBtn.addEventListener('click', () => {
  permanentlyUnpinned = true;
  unlockScroll();
  mapTrigger.kill();
  ScrollTrigger.refresh();
});
