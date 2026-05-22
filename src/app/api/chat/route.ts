import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { getTiersoDashboard } from "@/app/actions/tracks";

export const maxDuration = 30;

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      { error: "GROQ_API_KEY is not configured on this server." },
      { status: 503 }
    );
  }

  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const data = await getTiersoDashboard();

    const fmt = (n: number) => n.toLocaleString("en-US");
    const fmtUsd = (n: number) =>
      n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      });

    const trackRows = data.tracks
      .map(
        (t, i) =>
          `${i + 1}. "${t.title}" · ${t.genre ?? "—"} · ${fmt(t.streams)} streams · $${t.royaltyRate.toFixed(5)}/stream · ISRC: ${t.isrc ?? "—"}`
      )
      .join("\n");

    const system = `Eres Sonic Assistant, un estratega senior de la industria musical. Analizas datos de regalías y streaming para dar consejos hiper-concisos, técnicos y con una estética verbal fría y profesional.

DATOS EN TIEMPO REAL — ARTISTA: Tierso
• Catálogo activo: ${data.tracks.length} tracks
• Streams totales: ${fmt(data.totalStreams)}
• Gross earnings: ${fmtUsd(data.totalGross)}
• Platform fee (30%): ${fmtUsd(data.totalPlatformFee)}
• Net earnings: ${fmtUsd(data.totalNet)}

CATÁLOGO (ordenado por streams):
${trackRows}

REGLAS DE COMPORTAMIENTO:
- Responde siempre en español.
- Sé directo y técnico. Cita datos del catálogo cuando sean relevantes.
- Máximo 150 palabras salvo que el usuario pida un análisis profundo.
- Usa párrafos cortos o bullets limpios. Sin markdown complejo.
- Tono: frío, confiado. Sin exclamaciones ni emojis.`.trim();

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 512,
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        if (error instanceof Error) return error.message;
        return "Error interno del servidor";
      },
    });
  } catch (error) {
    console.error("[POST /api/chat]", error);
    return Response.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
