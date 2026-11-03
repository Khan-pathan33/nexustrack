import { NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import { DailyTracker } from '@/models/DailyTracker';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { emailContent, senderEmail, senderName } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key missing' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      You are an expert technical manager assisting in tracking trainee progress.
      Read the following daily status email from a trainee.
      Extract the following fields and return ONLY a valid JSON object matching this exact structure, with no markdown formatting around it:
      {
        "pendingTopics": "String summarizing what is pending",
        "completedTopicsStatus": "Yes, No, or Partial",
        "completedTopicsDetails": "String summarizing what was actually completed",
        "taskAssign": "Yes or No",
        "doubts": "String summarizing any blockers or doubts",
        "discussionSummary": "String summarizing the discussion",
        "githubPushStatus": "Yes or No",
        "selfProjectStatus": "String summarizing project status",
        "mistakesFound": "If they made a mistake (like listing CSS under an HTML heading, or missing a final project status), describe it here. If no mistakes, leave empty.",
        "performanceScore": "A number between 0 and 100 representing how much of their planned tasks they actually completed.",
        "scoreReasoning": "A 1-sentence explanation of why you gave them this score."
      }

      Email Content:
      ${emailContent}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const textResult = response.text || "{}";
    // Strip markdown code block formatting if Gemini included it
    const cleanJson = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    // Save to Database
    let tracker = null;
    if (isMongoConfigured()) {
      await connectToDatabase();
      tracker = await DailyTracker.create({
        date: new Date().toLocaleDateString(),
        name: senderName || 'Unknown Trainee',
        ...parsedData,
        emailReviewStatus: parsedData.mistakesFound ? 'Action Required' : 'Reviewed'
      });
    }

    let autoReplyMessage = '';

    // SEND CORRECTION EMAIL EXCLUSIVELY TO nafisakhanampathan65@gmail.com
    // Policy: Never send emails to @nybinfotech.com
    const DEDICATED_CORRECTION_EMAIL = 'nafisakhanampathan65@gmail.com';

    if (parsedData.mistakesFound) {
      autoReplyMessage = `[Draft Prepared — No Auto-Reply Sent] Discrepancy logged for ${senderName}: ${parsedData.mistakesFound}. Saved to Drafts for manual review.`;
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
      tracker,
      autoReplyMessage
    });

  } catch (error) {
    console.error('AI Sync Error:', error);
    return NextResponse.json({ error: 'Failed to process email with AI' }, { status: 500 });
  }
}
