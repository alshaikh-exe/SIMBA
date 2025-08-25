// services/aiService.js
import fetch from "node-fetch";

export async function enrichItemDetails(name) {
  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`, 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "admin",
            content: "You are a technical assistant. For any electronic part, generate a detailed description and suggest datasheet links from alldatasheet.com, TI, STMicro, etc."
          },
          {
            role: "user",
            content: `Generate details and datasheet links for: ${name}`
          }
        ]
      })
    });

    const data = await response.json();

    // Extract the text DeepSeek returned
    return data?.choices?.[0]?.message?.content || "No extra details generated.";
  } catch (err) {
    console.error("AI service error:", err.message);
    return "AI enrichment failed.";
  }
}