// Jednoduché ovládanie menu, medailónov a fotografií. Obsah je v HTML a profiles.js.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
menuButton?.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'Zavrieť ×' : 'Menu +';
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Menu +';
}));

const profileDialog = document.querySelector('#profile-dialog');
document.querySelectorAll('[data-person]').forEach(button => {
  button.addEventListener('click', () => {
    const person = profiles[button.dataset.person];
    if (!person) return;
    profileDialog.querySelector('#profile-name').textContent = person.name;
    profileDialog.querySelector('.profile-role').textContent = person.role;
    profileDialog.querySelector('.profile-bio').textContent = person.bio || 'Medailón pripravujeme. Viac informácií doplníme čoskoro.';
    const portrait = profileDialog.querySelector('.profile-portrait');
    portrait.replaceChildren();
    if (person.photo) {
      const image = document.createElement('img');
      image.src = person.photo;
      image.alt = person.name;
      portrait.append(image);
    } else {
      const initials = document.createElement('span');
      initials.className = 'initials';
      initials.textContent = person.name.split(' ').slice(0, 2).map(name => name[0]).join('');
      const label = document.createElement('span');
      label.className = 'photo-label';
      label.textContent = 'Miesto na fotografiu';
      portrait.append(initials, label);
    }
    const source = profileDialog.querySelector('.profile-source');
    source.replaceChildren();
    source.append('Zdroj: ');
    if (person.sourceUrl) {
      const link = document.createElement('a');
      link.href = person.sourceUrl;
      link.textContent = person.source;
      link.target = '_blank';
      link.rel = 'noopener';
      source.append(link);
    } else {
      source.append(person.source);
    }
    openDialog(profileDialog);
  });
});

function openDialog(dialog) {
  dialog.showModal();
  document.body.classList.add('modal-open');
}
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
});

const gallery = [...document.querySelectorAll('[data-gallery]')];
const lightbox = document.querySelector('#lightbox');
let currentPhoto = 0;
function showPhoto(index) {
  currentPhoto = (index + gallery.length) % gallery.length;
  const original = gallery[currentPhoto].querySelector('img');
  lightbox.querySelector('img').src = original.src;
  lightbox.querySelector('img').alt = original.alt;
  lightbox.querySelector('p').textContent = `${String(currentPhoto + 1).padStart(2, '0')} / ${String(gallery.length).padStart(2, '0')} — ${original.alt}`;
}
gallery.forEach((button, index) => button.addEventListener('click', () => {
  showPhoto(index);
  openDialog(lightbox);
}));
lightbox?.querySelector('[data-prev]').addEventListener('click', () => showPhoto(currentPhoto - 1));
lightbox?.querySelector('[data-next]').addEventListener('click', () => showPhoto(currentPhoto + 1));
lightbox?.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(currentPhoto - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(currentPhoto + 1); }
});

// Viditeľné ovládanie na každej fotografii, aj na dotykovej obrazovke.
gallery.forEach(button => {
  const label = document.createElement('span');
  label.className = 'gallery-open';
  label.innerHTML = 'Zväčšiť fotografiu <span aria-hidden="true">↗</span>';
  button.append(label);
});

// Menu sa zatvorí aj pomocou Escape; fokus sa vráti na jeho tlačidlo.
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation?.classList.contains('open')) {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Menu +';
    menuButton.focus();
  }
});

// Zvýraznenie sekcie v navigácii a jemný príchod obsahových blokov.
if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('.nav a[href^="#"], .credits-nav a')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-18% 0px -65% 0px' });
  sections.forEach(section => sectionObserver.observe(section));

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-in');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.section-heading, .story-grid, .people-grid, .bts-grid, .partner-grid, .funding').forEach(element => revealObserver.observe(element));
  }
}
