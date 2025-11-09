function showSection(event, sectionId) {
  if (event) {
    event.preventDefault();
  }

  const target = document.getElementById(sectionId);
  if (!target) {
    return false;
  }

  const links = document.querySelectorAll('nav a');
  links.forEach(link => link.classList.remove('active'));

  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  } else {
    const fallbackLink = document.querySelector(`nav a[href="#${sectionId}"]`);
    if (fallbackLink) {
      fallbackLink.classList.add('active');
    }
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return false;
}

window.addEventListener('DOMContentLoaded', () => {
  showSection(null, 'home');
});
