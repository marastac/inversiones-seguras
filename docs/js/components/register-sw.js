// register-sw.js - Registro del Service Worker y botón de acceso

// Acción del botón
const joinButton = document.querySelector('#unirme');
if (joinButton) {
  joinButton.addEventListener('click', () => {
    alert("Gracias por tu interés. Nuestro equipo te contactará pronto para confirmar tu acceso.");
  });
}

// Registro del Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/js/sw.js')
      .then(reg => console.log('✅ Service Worker registrado:', reg.scope))
      .catch(err => console.warn('❌ Error al registrar el Service Worker:', err));
  });
}
