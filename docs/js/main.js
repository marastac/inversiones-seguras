// main.js - Efectos, scroll, modo oscuro y carrusel

// Intersección para animar secciones al hacer scroll
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => {
  section.classList.add('hidden');
  observer.observe(section);
});

// Sonido al hacer clic
const clickSound = new Audio('/sounds/click.mp3');
function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.play();
}

// Scroll suave con sonido
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
    playClickSound();
  });
});

// Menú responsivo
const toggleBtn = document.querySelector('.menu-toggle');
toggleBtn?.addEventListener('click', () => {
  document.querySelector('.menu').classList.toggle('active');
  playClickSound();
});

// Activar modo oscuro al presionar 🌙
const themeToggle = document.getElementById('theme-toggle');
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  playClickSound();
});

// Carrusel automático en sección "Opiniones reales"
const reviewTrack = document.querySelector('.carousel-track');
if (reviewTrack) {
  setInterval(() => {
    reviewTrack.scrollBy({ left: 160, behavior: 'smooth' });
    if (reviewTrack.scrollLeft + reviewTrack.clientWidth >= reviewTrack.scrollWidth) {
      reviewTrack.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, 3000);
}

// Estilos para scroll reveal
const style = document.createElement('style');
style.textContent = `
  section.hidden {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  section.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

// Manejo del formulario de contacto con WhatsApp
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Obtener los valores del formulario
      const nombre = document.querySelector('input[name="nombre"]').value;
      const monto = document.querySelector('input[name="monto"]').value;
      const consulta = document.querySelector('textarea[name="consulta"]').value;
      
      // Crear el mensaje para WhatsApp con toda la información
      const mensaje = `*NUEVO CLIENTE - FINANCE PRO*
      
👤 *Nombre completo:* ${nombre}
💰 *Monto a invertir:* S/ ${monto}
📝 *Consulta:* ${consulta}
      
_Mensaje enviado desde el formulario web de Finance Pro_`;
      
      // Número de WhatsApp (sin el +)
      const numeroWhatsApp = '51955899106';
      
      // Crear el enlace de WhatsApp
      const enlaceWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
      
      // Abrir WhatsApp en una nueva ventana
      window.open(enlaceWhatsApp, '_blank');
      
      // Opcional: Limpiar el formulario después de enviar
      contactForm.reset();
      
      // Opcional: Mostrar mensaje de confirmación
      alert('Serás redirigido a WhatsApp. Si no se abre automáticamente, por favor revisa tu bloqueador de ventanas emergentes.');
    });
  }
});