import OpenAI from "openai";


const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export async function enrichItemDetails(name) {
  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a concise technical assistant. For an electronic part, provide a short overview and key specs. Do not invent pricing/stock. Keep it factual and compact.",
        },
        {
          role: "user",
          content: `Part: ${name}

Return a short paragraph (2–4 sentences) describing typical function and use cases.
Then include 3–6 bullet points with typical key specs (e.g., supply voltage range, package options).
End with a line: "Datasheet suggestions: TI, STMicro, Onsemi, alldatasheet.com" (adjust brands if obvious).`,
        },
      ],
    });

    const text = completion?.choices?.[0]?.message?.content?.trim();
    return text || "No extra details generated.";
  } catch (err) {
    console.error("DeepSeek error:", err?.status || "", err?.message || err);
    return "AI enrichment failed.";
  }
}
