export default function decorate(block) {
  const h1 = block.querySelector('h1');
  if (!h1) return;

  const picture = h1.querySelector('picture');
  if (picture) picture.remove();
  const headingText = h1.textContent.trim();

  block.innerHTML = '';
  const inner = document.createElement('div');
  inner.className = 'hero-inner';

  if (picture) {
    const logoDiv = document.createElement('div');
    logoDiv.className = 'hero-logo';
    logoDiv.append(picture);
    inner.append(logoDiv);
  }

  const heading = document.createElement('h1');
  heading.textContent = headingText;
  inner.append(heading);

  block.append(inner);
}
