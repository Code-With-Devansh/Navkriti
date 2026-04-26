import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const fallbackResponse = (situation) => `**Emergency Situation:** ${situation}

**IMMEDIATE ACTIONS:**
1. Stay calm and keep the patient comfortable
2. Call 102 immediately for emergency medical services
3. Do not move the patient unless absolutely necessary
4. Monitor breathing and consciousness
5. Note any symptoms or changes

**WARNING:** Do not give medications or food/water without medical guidance

**CALL 102 IF:** Any worsening symptoms, difficulty breathing, or loss of consciousness`;

export async function POST(req) {
  let transcription;

  try {
    const body = await req.json();
    transcription = body.transcription;

    // Clean JSON string if needed
    if (typeof transcription === "string" && transcription.startsWith("{")) {
      try {
        const parsed = JSON.parse(transcription);
        transcription = parsed.text ?? parsed.transcription ?? transcription;
      } catch {
        // keep original
      }
    }

    console.log("=".repeat(60));
    console.log("Raw transcription:", body.transcription);
    console.log("Clean transcription:", transcription);
    console.log("=".repeat(60));
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const prompt = `You are an emergency medical AI assistant.

Patient's emergency: "${transcription}"

Provide IMMEDIATE first aid instructions:

**Emergency Situation:** [Brief assessment]

**IMMEDIATE ACTIONS:**
1. [Critical action]
2. [Second action]
3. [Third action]
4. [Fourth action]
5. [Fifth action]

**WARNING:** [What NOT to do]

**CALL 102 IF:** [When to call emergency]`;

  try {
    console.log("Calling Gemini 2.5 Flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    console.log("Success!");

    return NextResponse.json({ success: true, firstAid: text });
  } catch (error) {
    console.error("ERROR:", error);

    return NextResponse.json({
      success: true,
      firstAid: fallbackResponse(transcription),
    });
  }
}