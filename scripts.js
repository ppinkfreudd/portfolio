let typewriterEffectRan = false;

function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.add('hidden'));

  const activeSection = document.getElementById(sectionId);
  activeSection.classList.remove('hidden');

  const links = document.querySelectorAll('nav a');
  links.forEach(link => link.classList.remove('active'));

  document.querySelector(`nav a[href="#${sectionId}"]`).classList.add('active');

  if (sectionId === 'blog') {
    console.log("Blog section is active");
  } else if (sectionId === 'home') {
    resetTypeWriter();
    startTypeWriter();
  }

  if (sectionId === 'resume') {
    activeSection.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
}

const typewriterText = document.querySelector('.typewriter-text');
const text = "Co-founder at GARDE and a Computational Cognitive Science student at UC Davis 🐄. From Melbourne 🇦🇺, lived in 🇮🇳, 🇭🇰, and 🇦🇪.";

let index = 0;

function typeWriter() {
  if (index < text.length) {
    typewriterText.innerHTML += text.charAt(index);
    index++;
    setTimeout(typeWriter, 20);
  }
}

function resetTypeWriter() {
  typewriterText.innerHTML = '';
  index = 0;
}

function startTypeWriter() {
  setTimeout(typeWriter, 1000);
}

// Call showSection('home') when the page loads
window.addEventListener('DOMContentLoaded', () => {
  showSection('home');
});
