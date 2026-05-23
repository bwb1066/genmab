const ITEMS_DESKTOP = 3;
const ITEMS_MOBILE = 2;
const isDesktopMQ = window.matchMedia('(min-width: 900px)');

function buildTeamCarousel(people) {
  const total = people.length;
  let current = 0;

  const getItems = () => (isDesktopMQ.matches ? ITEMS_DESKTOP : ITEMS_MOBILE);

  const carousel = document.createElement('div');
  carousel.className = 'hero-team-carousel';

  const trackWrap = document.createElement('div');
  trackWrap.className = 'hero-team-track-wrap';

  const track = document.createElement('div');
  track.className = 'hero-team-track';

  const cards = people.map((person) => {
    const card = document.createElement('div');
    card.className = 'hero-team-card';

    if (person.picture) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'hero-team-card-image';
      imgWrap.append(person.picture);
      card.append(imgWrap);
    }

    const name = document.createElement('h4');
    name.className = 'hero-team-card-name';
    name.textContent = person.name;
    card.append(name);

    if (person.href) {
      const link = document.createElement('a');
      link.className = 'hero-team-card-link';
      link.href = person.href;
      link.textContent = person.linkText || 'Read more';
      card.append(link);
    }

    track.append(card);
    return card;
  });

  trackWrap.append(track);
  carousel.append(trackWrap);

  const nav = document.createElement('div');
  nav.className = 'hero-team-nav';

  const counter = document.createElement('span');
  counter.className = 'hero-team-counter';

  const buttons = document.createElement('div');
  buttons.className = 'hero-team-buttons';

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'hero-team-prev';
  prev.setAttribute('aria-label', 'Previous');
  prev.innerHTML = '&#8249;';

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'hero-team-next';
  next.setAttribute('aria-label', 'Next');
  next.innerHTML = '&#8250;';

  buttons.append(prev, next);
  nav.append(counter, buttons);
  carousel.append(nav);

  const update = () => {
    const items = getItems();
    const cardPct = 100 / total;
    const offset = current * cardPct;
    track.style.width = `${(total * 100) / items}%`;
    cards.forEach((c) => { c.style.flexBasis = `${100 / total}%`; c.style.flexShrink = '0'; });
    track.style.transform = `translateX(-${offset * items}%)`;
    counter.textContent = `${current + 1} of ${total}`;
    prev.disabled = current === 0;
    next.disabled = current >= total - items;
  };

  prev.addEventListener('click', () => { if (current > 0) { current -= 1; update(); } });
  next.addEventListener('click', () => {
    const items = getItems();
    if (current < total - items) { current += 1; update(); }
  });

  isDesktopMQ.addEventListener('change', () => {
    current = 0;
    update();
  });

  update();
  return carousel;
}

function decorateTeamHero(block) {
  const cell = block.querySelector(':scope > div > div');
  if (!cell) return;

  const tagEl = cell.querySelector('p:first-child');
  const titleEl = cell.querySelector('h1');
  const hr = cell.querySelector('hr');

  const allH2s = [...cell.querySelectorAll('h2')];
  // eslint-disable-next-line no-bitwise
  const bodyEl = allH2s.find((h) => !h.closest('table') && h.compareDocumentPosition(hr) & Node.DOCUMENT_POSITION_FOLLOWING);
  // eslint-disable-next-line no-bitwise
  const sectionTitleEl = allH2s.find((h) => !h.closest('table') && h.compareDocumentPosition(hr) & Node.DOCUMENT_POSITION_PRECEDING);

  const table = cell.querySelector('table');
  const people = [];
  if (table) {
    [...table.querySelectorAll('tr')].slice(1).forEach((row) => {
      const [imgCell, contentCell] = row.children;
      const picture = imgCell?.querySelector('picture');
      const name = contentCell?.querySelector('h2')?.textContent.trim();
      const linkEl = contentCell?.querySelector('a');
      if (name) {
        people.push({
          picture, name, href: linkEl?.href, linkText: linkEl?.textContent.trim(),
        });
      }
    });
  }

  block.innerHTML = '';
  block.classList.add('hero-team');

  const inner = document.createElement('div');
  inner.className = 'hero-team-inner';

  const header = document.createElement('div');
  header.className = 'hero-team-header';

  if (tagEl) {
    const tag = document.createElement('p');
    tag.className = 'hero-team-tag';
    tag.textContent = tagEl.textContent.trim();
    header.append(tag);
  }

  if (titleEl) {
    const title = document.createElement('h2');
    title.className = 'hero-team-title';
    title.textContent = titleEl.textContent.trim();
    header.append(title);
  }

  if (bodyEl) {
    const body = document.createElement('p');
    body.className = 'hero-team-body';
    body.textContent = bodyEl.textContent.trim();
    header.append(body);
  }

  inner.append(header);

  const divider = document.createElement('hr');
  divider.className = 'hero-team-divider';
  inner.append(divider);

  const teamSection = document.createElement('div');
  teamSection.className = 'hero-team-section';

  if (sectionTitleEl) {
    const st = document.createElement('h3');
    st.className = 'hero-team-section-title';
    st.textContent = sectionTitleEl.textContent.trim();
    teamSection.append(st);
  }

  if (people.length) {
    teamSection.append(buildTeamCarousel(people));
  }

  inner.append(teamSection);
  block.append(inner);
}

export default function decorate(block) {
  const h1 = block.querySelector('h1');
  if (!h1) return;

  const picture = h1.querySelector('picture');

  if (!picture) {
    decorateTeamHero(block);
    return;
  }

  // Logo/image hero variant (existing behaviour)
  picture.remove();
  const headingText = h1.textContent.trim();

  block.innerHTML = '';
  const inner = document.createElement('div');
  inner.className = 'hero-inner';

  const logoDiv = document.createElement('div');
  logoDiv.className = 'hero-logo';
  logoDiv.append(picture);
  inner.append(logoDiv);

  const heading = document.createElement('h1');
  heading.textContent = headingText;
  inner.append(heading);

  block.append(inner);
}
