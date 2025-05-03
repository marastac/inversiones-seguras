// server.js - Servidor Express que sirve la web y la API de OpenAI

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000; // Usa puerto 3000 o el definido por entorno

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde "public"
app.use(express.static(path.join(__dirname, "public")));

// Configurar cliente de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

// Ruta API del chat
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Eres un asesor profesional de nuestra empresa. Solo puedes responder en base a la siguiente información. No inventes ni agregues nada que no esté aquí. Prioriza siempre invitar al usuario a rellenar el formulario para hablar con un asesor por WhatsApp.

¿Quieres duplicar o triplicar tu dinero en poco tiempo y sin riesgos? Nosotros tenemos la forma.
Trabajamos con un sistema que utiliza los seguros de protección de compras que ofrecen los bancos. Es 100% seguro y legal para ti. Lo único que necesitas es una tarjeta activa y un monto inicial para invertir. Puede ser desde 500 soles , 1000, 2000 o más. Mientras más pongas, más ganas.

¿Cómo funciona?
Primero, tú haces una compra simulada a nombre de una de nuestras empresas asociadas simulando compras como motos, carros, laptops, etc. Esa compra se hace con tu tarjeta, pero tranquilo: no perderás nada. Esa transacción se te devuelve el 100% en 5 horas por parte de las empresas asociadas.

Antes de hacer esa compra, te ayudamos a activar el seguro de protección de tarjeta que ofrecen los bancos. Ese seguro es la clave. Luego te guiamos para que hagas un reclamo al banco diciendo que no reconoces esa transacción. El banco inicia una investigación y gracias a nuestras conexiones, el proceso se archiva y el reclamo pasa como válido.

Entonces recuperas:
• El dinero invertido (en 5 horas),
• El reembolso provisional del banco (en 5 días),
• El reembolso final del seguro (en 5 a 10 días).

Resultado: puedes duplicar o triplicar tu inversión. Nosotros cobramos solo un 15% como comisión del total recuperado.

Preguntas frecuentes:
- ¿En cuánto tiempo recibo mi dinero?
  El monto invertido se devuelve en 5 horas. El banco reembolsa otra cantidad a los 5 días. El seguro devuelve otra suma igual de 5 a 10 días después de aprobarse la solicitud.

- ¿Por qué razón te devuelven dos veces?
  Porque una cantidad es del banco (provisional) y otra del seguro que contrataste.

- ¿Puedo repetir este método varias veces?
  Sí. Puedes usarlo con todos los bancos con seguro de protección. Solo Scotiabank triplica el dinero; los demás lo duplican.

Recuerda siempre sugerir al usuario que complete el formulario en la web para hablar con un asesor por WhatsApp.`
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const responseText = chat.choices[0].message.content;

    const finalResponse = responseText + `\n\n💬 Para resolver tus dudas directamente, por favor rellena el formulario y uno de nuestros asesores te hablará por WhatsApp.`;

    res.json({ reply: finalResponse });
  } catch (err) {
    console.error("❌ Error en OpenAI:", err?.response?.data || err.message);
    res.status(500).json({ error: "Error procesando la respuesta." });
  }
});

// Ruta de respaldo: sirve index.html si no se encuentra otra
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// Iniciar servidor con manejo de errores por puerto ocupado
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ El puerto ${PORT} ya está en uso. Intenta cerrarlo o usar otro.`);
  } else {
    console.error("❌ Error al iniciar el servidor:", err);
  }
});
