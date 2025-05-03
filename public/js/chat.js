document.getElementById("send-btn").addEventListener("click", async () => {
  const input = document.getElementById("user-input");
  const chat = document.getElementById("chat-output");
  const message = input.value.trim();

  if (!message) return;

  chat.innerHTML += `<div class="user-msg">🙋‍♂️: ${message}</div>`;
  input.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    if (!data.reply) {
      chat.innerHTML += `<div class="ai-msg">⚠️ Error: no se obtuvo respuesta.</div>`;
      return;
    }

    chat.innerHTML += `<div class="ai-msg">🤖: ${data.reply}</div>`;
    chat.scrollTop = chat.scrollHeight;
  } catch (error) {
    chat.innerHTML += `<div class="ai-msg">❌ Error al conectar con el servidor.</div>`;
    console.error("Error en la solicitud:", error);
  }
});
