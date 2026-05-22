export default function decorate(block) {
  const rows = [...block.children];
  const total = rows.length;
  let current = 0;
  let animating = false;

  const slides = rows.map((row, i) => {
    const [imageCell, contentCell] = row.children;
    const picture = imageCell?.querySelector('picture');
    const tagEl = contentCell?.querySelector('p:first-child');
    const titleEl = contentCell?.querySelector('h2');
    const bodyEl = contentCell?.querySelector('h3');
    const linkEl = contentCell?.querySelector('a');

    const slide = document.createElement('div');
    slide.className = 'hero-carousel-slide';
    slide.style.flex = `0 0 ${100 / total}%`;

    if (picture) {
      if (i === 0) picture.querySelector('img')?.setAttribute('loading', 'eager');
      slide.append(picture);
    }

    const content = document.createElement('div');
    content.className = 'hero-carousel-content';

    if (tagEl?.textContent.trim()) {
      const tag = document.createElement('p');
      tag.className = 'hero-carousel-tag';
      tag.textContent = tagEl.textContent.trim();
      content.append(tag);
    }

    if (titleEl) {
      const title = document.createElement('h2');
      title.className = 'hero-carousel-title';
      title.textContent = titleEl.textContent.trim();
      content.append(title);
    }

    if (bodyEl) {
      const body = document.createElement('p');
      body.className = 'hero-carousel-body';
      body.textContent = bodyEl.textContent.trim();
      content.append(body);
    }

    if (linkEl) {
      const cta = document.createElement('a');
      cta.href = linkEl.href;
      cta.className = 'hero-carousel-cta';
      cta.textContent = linkEl.textContent.trim();
      content.append(cta);
    }

    slide.append(content);
    return slide;
  });

  const inner = document.createElement('div');
  inner.className = 'hero-carousel-inner';
  inner.style.width = `${total * 100}%`;
  slides.forEach((s) => inner.append(s));

  const track = document.createElement('div');
  track.className = 'hero-carousel-track';
  track.append(inner);

  const counter = document.createElement('span');
  counter.className = 'hero-carousel-counter';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'hero-carousel-prev';
  prevBtn.innerHTML = '&lsaquo; Previous';

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'hero-carousel-next';
  nextBtn.innerHTML = 'Next &rsaquo;';

  const navButtons = document.createElement('div');
  navButtons.className = 'hero-carousel-buttons';
  navButtons.append(prevBtn, nextBtn);

  const navInner = document.createElement('div');
  navInner.className = 'hero-carousel-nav-inner';
  navInner.append(counter, navButtons);

  const nav = document.createElement('div');
  nav.className = 'hero-carousel-nav';
  nav.append(navInner);

  const show = (idx) => {
    if (animating) return;
    const toIdx = (idx + total) % total;
    if (toIdx === current) return;

    animating = true;
    const steps = Math.abs(toIdx - current);
    current = toIdx;
    counter.textContent = `${current + 1} of ${total}`;

    inner.style.transition = `transform ${steps}s ease-in-out`;
    inner.style.transform = `translateX(${-current * (100 / total)}%)`;

    inner.addEventListener('transitionend', () => { animating = false; }, { once: true });
  };

  let timer = setInterval(() => show(current + 1), 8000);

  const resetTimer = () => {
    clearInterval(timer);
    timer = setInterval(() => show(current + 1), 8000);
  };

  prevBtn.addEventListener('click', () => { resetTimer(); show(current - 1); });
  nextBtn.addEventListener('click', () => { resetTimer(); show(current + 1); });

  block.innerHTML = '';
  block.append(track, nav);
  counter.textContent = `1 of ${total}`;
}
