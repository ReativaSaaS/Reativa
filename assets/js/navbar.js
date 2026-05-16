// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar-toggle');
  const links = document.querySelector('.navbar-links');

  if (!navbar) return;

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Mobile toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('active');
      document.body.style.overflow = links.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link highlight
  const sections = document.querySelectorAll('section[id]');
  if (sections.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY + 100;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = links?.querySelector(`a[href="#${id}"]`);

        if (link) {
          if (scrollY >= top && scrollY < top + height) {
            links.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    });
  }
}

// ===== LOAD COMPONENTS =====
async function loadComponent(selector, path) {
  const el = document.querySelector(selector);
  if (!el) return;

  try {
    const response = await fetch(path);
    if (response.ok) {
      el.innerHTML = await response.text();
      if (selector === '#navbar') initNavbar();
    }
  } catch (e) {
    console.warn(`Failed to load component: ${path}`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadComponent('#navbar', '/components/navbar.html');
  loadComponent('#footer', '/components/footer.html');
});
