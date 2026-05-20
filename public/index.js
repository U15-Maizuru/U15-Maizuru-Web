document.addEventListener('DOMContentLoaded', () => {
  const titleCount = document.getElementById('title-count');
  const titleContainer = document.getElementById('title-container');
  const title = document.getElementById('title');

  if (titleCount && titleContainer) {
    const endHeight = titleContainer.scrollHeight;
    titleContainer.style.maxHeight = '0px';
    titleCount.addEventListener('animationend', () => {
      titleContainer.style.maxHeight = `${endHeight}px`;
    });
  }

  if (title) {
    title.querySelectorAll('div').forEach(child => {
      const span = child.querySelector('span');
      if (!span) return;

      span.addEventListener('animationend', event => {
        if (event.animationName === 'fade-in-up') {
          child.classList.remove('overflow-hidden');
        }
      });
    });
  }
});

const toggleBtn = document.getElementById('menu-toggle');
const dropdownMenu = document.getElementById('dropdown-menu');
const dropdownIcon = document.getElementById('dropdown-icon');
const dropdownLinks = document.querySelectorAll('.dropdown-link');
let isDropdownOpen = false;

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const logo = document.getElementById('logo');

const setBodyScroll = isBlocked => {
  document.documentElement.classList.toggle('overflow-hidden', isBlocked);
  document.body.classList.toggle('overflow-hidden', isBlocked);
};

const setDropdown = isOpen => {
  if (!dropdownMenu || !dropdownIcon) return;
  dropdownMenu.classList.toggle('hidden', !isOpen);
  dropdownIcon.classList.toggle('rotate-180', isOpen);
  isDropdownOpen = isOpen;
};

const closeDropdown = () => setDropdown(false);
const closeMobileMenu = () => {
  if (!hamburger || !mobileMenu) return;

  hamburger.classList.remove('active');
  mobileMenu.classList.remove('active');
  setBodyScroll(false);
  hamburger.setAttribute('aria-expanded', 'false');
};

if (toggleBtn && dropdownMenu && dropdownIcon) {
  toggleBtn.addEventListener('click', () => {
    setDropdown(!isDropdownOpen);
  });

  document.addEventListener('click', event => {
    if (!toggleBtn.contains(event.target) && !dropdownMenu.contains(event.target) && isDropdownOpen) {
      closeDropdown();
    }
  });

  dropdownLinks.forEach(link => {
    link.addEventListener('click', closeDropdown);
  });
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active', isOpen);
    setBodyScroll(isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 640) {
      setBodyScroll(false);
    } else if (mobileMenu.classList.contains('active')) {
      setBodyScroll(true);
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  const mobileLinks = document.querySelectorAll('.mobile-link');
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
}

if (logo) {
  logo.addEventListener('click', closeMobileMenu);
}

window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (!nav || !dropdownMenu) return;

  const heroHeight = window.innerHeight;
  const navHeight = 60;
  const isScrolled = window.scrollY > navHeight;

  nav.classList.toggle('backdrop-blur-sm', isScrolled);
  nav.classList.toggle('border-b-2', isScrolled);
  nav.classList.toggle('border-blue-300', isScrolled);
  nav.classList.toggle('shadow-md', isScrolled);

  const isHalfScrolled = window.scrollY > heroHeight / 2;
  dropdownMenu.classList.toggle('border-blue-400', isHalfScrolled);
  dropdownMenu.classList.toggle('border-white', !isHalfScrolled);
});
