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
    profileDialog.querySelector('.profile-bio').textContent = person.bio;
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
      initials.textContent = person.name.split(' ').map(name => name[0]).join('');
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
