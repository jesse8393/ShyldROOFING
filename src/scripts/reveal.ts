// Settles .rise elements into place when they enter the viewport.
// Content is fully visible without this script; it only adds a small motion accent.
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const targets = document.querySelectorAll<HTMLElement>('.rise');

if (prefersReduced || !('IntersectionObserver' in window)) {
  targets.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  targets.forEach((el) => io.observe(el));
  // Anything already above the fold or missed should never stay hidden.
  window.setTimeout(() => targets.forEach((el) => el.classList.add('is-in')), 2500);
}
