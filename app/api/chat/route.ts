import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "No Gemini API key provided." }, { status: 503 });
    }

    const body = await req.json();
    const { query, posts } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: process.env.GOOGLE_AI_MODEL || "gemini-1.5-flash-latest" });

    // Format the context
    let contextStr = "Here are the current news headlines and snippets:\n\n";
    if (Array.isArray(posts) && posts.length > 0) {
      posts.forEach((post: any, i: number) => {
        contextStr += `[${i + 1}] Title: ${post.title}\n`;
        contextStr += `    Snippet: ${post.body || "No summary"}\n\n`;
      });
    } else {
      contextStr += "No recent news available at the moment.\n";
    }

    const prompt = `
You are a helpful civic AI assistant for the 'Evolucent' app in Ghana.
Your job is to explain, summarize, or answer questions about the current news displayed in the user's feed.
Answer concisely and accurately based ONLY on the provided news context. If the user asks about something not in the news context, politely inform them you can only answer questions about the current feed.

CONTEXT:
${contextStr}

USER QUERY:
${query}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error("[chat api] error:", error);
    return NextResponse.json({ error: "Failed to process chat query." }, { status: 500 });
  }
}
