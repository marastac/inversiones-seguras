// chat.js mejorado - Mantiene toda la funcionalidad original pero añade elementos visuales

document.addEventListener("DOMContentLoaded", function() {
  const input = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const chat = document.getElementById("chat-output");
  
  // Agregar capacidad de enviar mensaje con tecla Enter
  input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });
  
  // Evento de clic en botón
  sendBtn.addEventListener("click", sendMessage);
  
  // Añadir mensaje de bienvenida
  setTimeout(() => {
    addMessage(
      "¡Hola! Soy el asistente virtual de Finance Pro. Puedo responder tus dudas sobre nuestro sistema de inversión. ¿En qué puedo ayudarte hoy?", 
      "ai"
    );
  }, 500);
  
  // Función para enviar mensajes
  async function sendMessage() {
    const message = input.value.trim();
    
    if (!message) return;
    
    // Añadir mensaje del usuario
    addMessage(message, "user");
    input.value = "";
    
    // Mostrar indicador de carga
    const loadingId = showLoading();
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      
      const data = await response.json();
      
      // Quitar indicador de carga
      hideLoading(loadingId);
      
      if (!data.reply) {
        addMessage("⚠️ Error: no se obtuvo respuesta.", "ai");
        return;
      }
      
      // Formatear el mensaje para mostrar mejor los saltos de línea
      const formattedReply = data.reply.replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>");
      
      // Añadir mensaje IA con efecto de escritura
      addMessage(formattedReply, "ai");
      
    } catch (error) {
      hideLoading(loadingId);
      addMessage("❌ Error al conectar con el servidor. Intenta nuevamente más tarde.", "ai");
      console.error("Error en la solicitud:", error);
    }
  }
  
  // Función para añadir mensajes al chat
  function addMessage(text, type) {
    const messageDiv = document.createElement("div");
    messageDiv.className = type === "user" ? "user-msg" : "ai-msg";
    
    // Añadir icono según tipo de mensaje
    const icon = type === "user" ? "🙋‍♂️" : "🤖";
    messageDiv.innerHTML = `<strong>${icon}</strong>: ${text}`;
    
    // Añadir al chat
    chat.appendChild(messageDiv);
    
    // Scroll automático
    chat.scrollTop = chat.scrollHeight;
    
    // Si es un botón de WhatsApp en el mensaje, hacerlo funcional
    if (text.includes("WhatsApp") && text.includes("href")) {
      const links = messageDiv.querySelectorAll("a");
      links.forEach(link => {
        if (link.href.includes("whatsapp")) {
          link.target = "_blank";
        }
      });
    }
  }
  
  // Mostrar indicador de carga
  function showLoading() {
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "ai-msg loading-msg";
    loadingDiv.innerHTML = `
      <strong>🤖</strong>: Pensando
      <div class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    chat.appendChild(loadingDiv);
    chat.scrollTop = chat.scrollHeight;
    return loadingDiv.id = "loading-" + Date.now();
  }
  
  // Ocultar indicador de carga
  function hideLoading(id) {
    const loadingDiv = document.getElementById(id);
    if (loadingDiv) {
      loadingDiv.remove();
    }
  }
});













        