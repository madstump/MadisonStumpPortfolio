const navToggle = document.querySelector('.nav-toggle');
const trailNav = document.querySelector('.trail-nav');
const progressBar = document.querySelector('.progress-bar');
const backToTop = document.querySelector('.back-to-top');
const copyEmailButtons = document.querySelectorAll('[data-copy-email]');
const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('[data-category]');
const revealItems = document.querySelectorAll('.reveal');
const sideLinks = document.querySelectorAll('.side-links a');
const yearTargets = document.querySelectorAll('[data-current-year]');

if (navToggle && trailNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = trailNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('.trail-nav a').forEach(link => {
  const page = location.pathname.split('/').pop() || 'index.html';
  const href = link.getAttribute('href');
  if (href === page || (page === '' && href === 'index.html')) link.classList.add('active');
});

function updateProgress() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (backToTop) backToTop.classList.toggle('show', scrollTop > 500);
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach(item => revealObserver.observe(item));

if (sideLinks.length) {
  const sections = [...sideLinks]
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sideLinks.forEach(link => link.classList.toggle('is-visible', link.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-25% 0px -60% 0px', threshold: 0.1 });
  sections.forEach(section => sectionObserver.observe(section));
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.toggle('active', btn === button));
    projectCards.forEach(card => {
      const categories = card.dataset.category.split(' ');
      card.hidden = !(filter === 'all' || categories.includes(filter));
    });
  });
});

copyEmailButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const email = button.dataset.copyEmail;
    const status = button.parentElement.querySelector('.copy-status');
    try {
      await navigator.clipboard.writeText(email);
      if (status) status.textContent = 'Email copied to clipboard.';
    } catch {
      if (status) status.textContent = `Copy manually: ${email}`;
    }
  });
});

yearTargets.forEach(target => {
  target.textContent = new Date().getFullYear();
});

// Optional: replace placeholder embed cards with actual iframes by adding data-iframe-src to .embed-placeholder.
document.querySelectorAll('[data-iframe-src]').forEach(holder => {
  const src = holder.dataset.iframeSrc;
  if (!src || src === '#') return;
  const title = holder.dataset.iframeTitle || 'Embedded portfolio artifact';
  holder.innerHTML = `<iframe src="${src}" title="${title}" loading="lazy" allowfullscreen></iframe>`;
});
