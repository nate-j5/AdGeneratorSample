import { OpenAI } from "openai";

export async function POST(request) {
  const { userInput, tone, audience } = await request.json();

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const thread = await openai.beta.threads.create();

    // Map audience values to descriptions
    const audienceDescriptions = {
      "gen-z":
        "people born between 1997-2012, who value authenticity, digital experiences, and social consciousness",
      millennials:
        "people born between 1981-1996, who value experiences, work-life balance, and technological integration",
      "young-professionals":
        "career-focused individuals in their late 20s to early 40s, who value efficiency, quality, and professional growth",
      boomers:
        "people born between 1946-1964, who value reliability, tradition, and quality craftsmanship",
    };

    // Map tone values to descriptions
    const toneDescriptions = {
      professional: "formal, authoritative, and refined",
      casual: "relaxed, conversational, and approachable",
      humorous: "witty, playful, and entertaining",
      inspirational: "uplifting, motivational, and emotional",
      minimalist: "concise, direct, and simple",
    };

    const audienceDescription =
      audienceDescriptions[audience] ||
      audienceDescriptions["young-professionals"];
    const toneDescription =
      toneDescriptions[tone] || toneDescriptions["professional"];

    const promptContent = `
      Create compelling ad copy for this product/service: "${userInput}".
      
      Target audience: ${audienceDescription}
      Tone should be: ${toneDescription}
      
      Please provide four distinct parts:
      1. A headline (5-7 words max)
      2. A tagline (short phrase)
      3. A concise product description (2-3 sentences max)
      4. A call-to-action (1-3 words)
      
      Format your response as a JSON object with these keys: headline, tagline, description, callToAction.
      Do not include any explanation or additional text.
    `;

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: promptContent,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.ASSISTANT_ID,
      max_completion_tokens: 350,
    });

    // Poll for completion with improved error handling
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    let attempts = 0;
    const maxAttempts = 30; // Prevent infinite loops

    while (runStatus.status !== "completed" && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

      if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
        throw new Error(`Run ended with status: ${runStatus.status}`);
      }

      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error("Generation timed out");
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    let assistantResponse = messages.data
      .filter((msg) => msg.role === "assistant")
      .map((msg) => msg.content[0].text.value)
      .join("\n");

    let adContent;

    try {
      // Extract JSON from various formats
      if (assistantResponse.includes("```json")) {
        assistantResponse = assistantResponse
          .split("```json")[1]
          .split("```")[0]
          .trim();
      } else if (assistantResponse.includes("```")) {
        assistantResponse = assistantResponse
          .split("```")[1]
          .split("```")[0]
          .trim();
      }

      // Handle cases where JSON is not wrapped in code blocks
      if (
        assistantResponse.startsWith("{") &&
        assistantResponse.endsWith("}")
      ) {
        adContent = JSON.parse(assistantResponse);
      } else {
        throw new Error("Response not in expected JSON format");
      }

      // Validate required fields
      const requiredFields = [
        "headline",
        "tagline",
        "description",
        "callToAction",
      ];
      const missingFields = requiredFields.filter((field) => !adContent[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }
    } catch (error) {
      console.error("Error parsing JSON response:", error);

      // Create audience and tone specific fallbacks
      const fallbacks = {
        "gen-z": {
          headline: "Vibe Check: Approved",
          tagline: "No cap, just facts",
          description:
            "This is the moment you've been waiting for. A game-changer that hits different and lives rent-free in your mind.",
          callToAction: "Get It",
        },
        millennials: {
          headline: "Life Hack You Deserve",
          tagline: "Adulting just got easier",
          description:
            "Remember when things were complicated? Not anymore. This solution works as hard as you do, but without the burnout.",
          callToAction: "Try Now",
        },
        "young-professionals": {
          headline: "Elevate Your Standards",
          tagline: "Efficiency meets excellence",
          description:
            "Designed for those who understand that time is valuable. Our solution delivers results that speak for themselves.",
          callToAction: "Discover More",
        },
        boomers: {
          headline: "Quality You Can Trust",
          tagline: "Reliable, tested, proven",
          description:
            "Crafted with the attention to detail you appreciate. A dependable solution that delivers value without the complexity.",
          callToAction: "Learn More",
        },
      };

      adContent = fallbacks[audience] || {
        headline: "The Solution You Need",
        tagline: "Simple. Effective. Essential.",
        description:
          "We've created something that solves real problems with thoughtful design. Experience the difference today.",
        callToAction: "Start Now",
      };
    }

    return Response.json({ adContent });
  } catch (error) {
    console.error("Error:", error);

    return Response.json(
      {
        error: "Failed to generate ad content",
        adContent: {
          headline: "We'll Try Again",
          tagline: "Temporary pause",
          description:
            "We're having trouble generating your ad content right now. Please try again in a moment.",
          callToAction: "Retry",
        },
      },
      { status: 500 }
    );
  }
}
