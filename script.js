// THE FINAL LAP — interakcie. Všetky texty sú v HTML a v profiles.js.
// Stránka funguje aj bez JavaScriptu; skript iba pridáva pohodlie.

/* ---------- Diakritika v nadpisoch (Segment A) ----------
   Trial verzia písma Segment A nemá hotové písmená s diakritikou (É, Č, Ý...),
   má však samostatné znamienka. Chrome si ich poskladá sám, Safari nie.
   Preto text veľkých nadpisov rozložíme na písmeno + znamienko (NFD).
   Po nasadení licencovaného písma s diakritikou môžete tento blok zmazať. */
function decomposeAccents(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) walker.currentNode.nodeValue = walker.currentNode.nodeValue.normalize('NFD');
}
document.querySelectorAll('.display, .initials, .avatar').forEach(decomposeAccents);

/* ---------- Mobilné menu ---------- */
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');

function setMenu(open) {
  if (!navigation || !menuButton) return;
  navigation.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('span').textContent = open ? 'Zavrieť' : 'Menu';
  menuButton.querySelector('use')?.setAttribute('href', open ? '#i-close' : '#i-menu');
}
menuButton?.addEventListener('click', () => setMenu(!navigation.classList.contains('open')));
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', event => {
  if (navigation?.classList.contains('open') && !navigation.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation?.classList.contains('open')) { setMenu(false); menuButton.focus(); }
});

/* ---------- Hlavička pri posúvaní ---------- */
const header = document.querySelector('.header');
const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Dialógy: otvorenie, zatvorenie, návrat fokusu ---------- */
let lastTrigger = null;
function openDialog(dialog, trigger) {
  lastTrigger = trigger || document.activeElement;
  dialog.showModal();
  document.body.classList.add('modal-open');
}
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  // Klik na tmavé pozadie mimo obsahu dialóg zatvorí.
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    lastTrigger?.focus({ preventScroll: true });
  });
});

/* ---------- Medailóny (údaje v profiles.js) ---------- */
const profileDialog = document.querySelector('#profile-dialog');
function initials(name) {
  return name.split(' ').slice(0, 2).map(part => part[0]).join('');
}
document.querySelectorAll('[data-person]').forEach(button => {
  button.addEventListener('click', () => {
    const person = typeof profiles !== 'undefined' && profiles[button.dataset.person];
    if (!person || !profileDialog) return;
    profileDialog.querySelector('#profile-name').textContent = person.name.normalize('NFD');
    profileDialog.querySelector('.profile-role').textContent = person.role;
    const bio = profileDialog.querySelector('.profile-bio');
    bio.textContent = person.bio || 'Medailón pripravujeme. Viac informácií doplníme čoskoro.';
    bio.classList.toggle('pending', !person.bio);

    const portrait = profileDialog.querySelector('.profile-portrait');
    portrait.replaceChildren();
    if (person.photo) {
      const image = document.createElement('img');
      image.src = person.photo;
      image.alt = person.name;
      portrait.append(image);
    } else {
      const letters = document.createElement('span');
      letters.className = 'initials';
      letters.textContent = initials(person.name).normalize('NFD');
      const label = document.createElement('span');
      label.className = 'photo-label';
      label.textContent = 'Portrét pripravujeme';
      portrait.append(letters, label);
    }

    const source = profileDialog.querySelector('.profile-source');
    source.replaceChildren('Zdroj: ');
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
    openDialog(profileDialog, button);
  });
});

/* ---------- Galéria: prepínač Z filmu / Zo zákulisia ---------- */
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab, focus) {
  tabs.forEach(other => {
    const selected = other === tab;
    other.setAttribute('aria-selected', String(selected));
    other.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(other.getAttribute('aria-controls'));
    if (!panel) return;
    panel.hidden = !selected;
    if (selected) { panel.classList.remove('entering'); void panel.offsetWidth; panel.classList.add('entering'); }
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    selectTab(next, true);
  });
});
if (tabs.length) selectTab(tabs.find(tab => tab.getAttribute('aria-selected') === 'true') || tabs[0]);

/* ---------- Fotogaléria: zväčšenie, šípky, potiahnutie prstom ---------- */
const lightbox = document.querySelector('#lightbox');
let photos = [];
let current = 0;

document.querySelectorAll('[data-gallery]').forEach(button => {
  // Viditeľná ikona zväčšenia a popis pre čítačky obrazovky.
  const image = button.querySelector('img');
  button.setAttribute('aria-label', `Zväčšiť fotografiu: ${image.alt}`);
  button.insertAdjacentHTML('beforeend', '<span class="zoom" aria-hidden="true"><svg class="icon"><use href="#i-zoom"/></svg></span>');
  button.addEventListener('click', () => {
    // Listuje sa v rámci skupiny, v ktorej je fotografia (film alebo zákulisie).
    const group = button.closest('.gallery-panel') || document;
    photos = [...group.querySelectorAll('[data-gallery] img')];
    showPhoto(photos.indexOf(image));
    openDialog(lightbox, button);
  });
});

function showPhoto(index) {
  if (!photos.length) return;
  current = (index + photos.length) % photos.length;
  const original = photos[current];
  const target = lightbox.querySelector('img');
  target.src = original.currentSrc || original.src;
  target.alt = original.alt;
  lightbox.querySelector('.count').textContent = `${current + 1} / ${photos.length}`;
  lightbox.querySelector('.caption').textContent = original.alt;
}
lightbox?.querySelector('[data-prev]').addEventListener('click', () => showPhoto(current - 1));
lightbox?.querySelector('[data-next]').addEventListener('click', () => showPhoto(current + 1));
lightbox?.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(current - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(current + 1); }
});
let touchX = null;
lightbox?.addEventListener('touchstart', event => { touchX = event.touches[0].clientX; }, { passive: true });
lightbox?.addEventListener('touchend', event => {
  if (touchX === null) return;
  const distance = event.changedTouches[0].clientX - touchX;
  if (Math.abs(distance) > 45) showPhoto(current + (distance < 0 ? 1 : -1));
  touchX = null;
});

/* ---------- Aktívna sekcia v navigácii a jemné odkrytie obsahu ---------- */
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
  }, { rootMargin: '-35% 0px -60% 0px' });
  sections.forEach(section => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('in'));
}
