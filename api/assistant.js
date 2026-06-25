const SMARTCART_CONTEXT = `
You are the SmartCart in-app assistant.
Answer in Hebrew, RTL-friendly, concise and friendly.
SmartCart is a Hebrew grocery companion app for budget-aware and health-aware shopping.
Main screens:
- בית: overview, monthly budget, quick actions.
- הכנה: choose supermarket, set budget and time goal.
- סריקה: simulated barcode scanner, product health grade, dietary tags, cheaper/healthier swaps.
- רשימת קניות: shopping list, completed items, manual product additions, budget progress.
- תובנות: charts, receipts, savings insights and shopping habits.
- פרופיל: May Cohen profile, avatar, dietary preferences and household members.
Important: product prices are based on last checks and may differ from real market prices due to branches, promotions, stock and supplier updates.
If asked how to do something, give practical steps inside the app.
If asked casual questions, answer naturally, then offer help with SmartCart.
Do not claim to perform real barcode scanning or real market price verification.
`;

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return response.status(503).json({ error: "OPENAI_API_KEY is not configured" });
  }

  try {
    const { question, history = [] } = request.body || {};
    if (!question || typeof question !== "string") {
      return response.status(400).json({ error: "Missing question" });
    }

    const safeHistory = Array.isArray(history)
      ? history.slice(-8).map((message) => ({
          role: message.from === "user" ? "user" : "assistant",
          content: String(message.text || "").slice(0, 700),
        }))
      : [];

    const aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: SMARTCART_CONTEXT,
        input: [
          ...safeHistory,
          {
            role: "user",
            content: question.slice(0, 1000),
          },
        ],
        max_output_tokens: 260,
        temperature: 0.4,
        store: false,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      return response.status(aiResponse.status).json({ error: errorText });
    }

    const data = await aiResponse.json();
    const answer =
      data.output_text ||
      data.output
        ?.flatMap((item) => item.content || [])
        ?.map((content) => content.text)
        ?.filter(Boolean)
        ?.join("\n") ||
      "אני כאן, אבל לא הצלחתי לנסח תשובה כרגע. נסי לשאול שוב בצורה אחרת.";

    return response.status(200).json({ answer });
  } catch (error) {
    return response.status(500).json({ error: error.message || "Assistant failed" });
  }
}
