import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Types for the AI summary request
interface SummaryRequest {
  type: "exercise" | "session" | "workshop";
  exerciseId?: string;
  sessionNumber?: number;
  data: Record<string, unknown>;
}

// Get the appropriate prompt based on the summary type
function getPrompt(request: SummaryRequest): string {
  const { type, exerciseId, sessionNumber, data } = request;

  if (type === "exercise" && exerciseId) {
    return getExercisePrompt(exerciseId, data);
  }

  if (type === "session" && sessionNumber) {
    return getSessionPrompt(sessionNumber, data);
  }

  if (type === "workshop") {
    return getWorkshopPrompt(data);
  }

  throw new Error("Invalid summary type or missing required fields");
}

function getExercisePrompt(exerciseId: string, data: Record<string, unknown>): string {
  const basePrompt = `You are an AI strategy consultant analyzing workshop data for a financial services organization planning their first AI implementation. Provide a concise, insightful summary (2-3 sentences) that highlights patterns, risks, or opportunities. Be specific and actionable. Do not use bullet points.`;

  switch (exerciseId) {
    case "ai-icebreakers":
      return `${basePrompt}

Analyze this team's AI readiness based on their icebreaker responses:
${JSON.stringify(data, null, 2)}

Consider: team alignment on AI impact expectations, optimism levels, and which cognitive biases they've identified as relevant to their organization.`;

    case "working-principles":
      return `${basePrompt}

Analyze these AI governance principles the team has defined:
${JSON.stringify(data, null, 2)}

Consider: whether the principles are comprehensive, if there are gaps, and how well the do's and don'ts translate to actionable guidance.`;

    case "tradeoff-navigator":
      return `${basePrompt}

Analyze the strategic tradeoff positions this team has selected:
${JSON.stringify(data, null, 2)}

Consider: the overall risk appetite (conservative vs aggressive), consistency across decisions, and implications for their AI implementation approach.`;

    case "friction-map":
      return `${basePrompt}

Analyze these friction points the team has identified:
${JSON.stringify(data, null, 2)}

Consider: patterns across process areas, severity distribution, and which friction points might be good candidates for AI automation.`;

    case "opportunity-scoring":
      return `${basePrompt}

Analyze how this team has scored their AI opportunities:
${JSON.stringify(data, null, 2)}

Consider: the balance between quick wins and strategic bets, whether scoring seems calibrated, and any opportunities that might be misclassified.`;

    case "priority-matrix":
      return `${basePrompt}

Analyze this team's priority matrix distribution:
${JSON.stringify(data, null, 2)}

Consider: whether they have a healthy mix of quick wins to build momentum, and strategic opportunities for long-term impact.`;

    case "dot-voting":
      return `${basePrompt}

Analyze the dot voting results and pilot selection:
${JSON.stringify(data, null, 2)}

Consider: whether the selected pilot is a good choice for a first AI implementation, alignment with earlier decisions, and any concerns about scope.`;

    case "mvp-spec":
      return `${basePrompt}

Analyze this MVP specification:
${JSON.stringify(data, null, 2)}

Consider: whether the scope is appropriately minimal, if the tools selected are appropriate, and whether human checkpoints are in the right places.`;

    case "pilot-plan":
      return `${basePrompt}

Analyze this pilot plan:
${JSON.stringify(data, null, 2)}

Consider: whether the duration and test user selection are appropriate, if the metrics will actually measure success, and any gaps in the plan.`;

    case "roadmap-builder":
      return `${basePrompt}

Analyze this 90-day roadmap:
${JSON.stringify(data, null, 2)}

Consider: whether the milestones are realistic, if dependencies are properly sequenced, and any risks to the timeline.`;

    default:
      return `${basePrompt}

Analyze this workshop data:
${JSON.stringify(data, null, 2)}

Provide insights on patterns, risks, or opportunities.`;
  }
}

function getSessionPrompt(sessionNumber: number, data: Record<string, unknown>): string {
  const sessionTitles: Record<number, string> = {
    1: "AI Strategy Foundation",
    2: "Find the Friction",
    3: "Design the Pilot",
    4: "Create the 90-Day Roadmap",
    5: "Empower Teams",
  };

  return `You are an AI strategy consultant reviewing a completed workshop session. Provide a concise executive summary (3-4 sentences) of the key decisions made in Session ${sessionNumber}: ${sessionTitles[sessionNumber]}.

Session data:
${JSON.stringify(data, null, 2)}

Highlight: the most important decisions, how they connect to the overall AI implementation strategy, and any recommendations for the next session.`;
}

function getWorkshopPrompt(data: Record<string, unknown>): string {
  return `You are an AI strategy consultant reviewing a complete AI implementation workshop. Provide an executive summary (4-5 sentences) of the entire workshop journey.

Workshop data:
${JSON.stringify(data, null, 2)}

Highlight: the organization's AI readiness, their chosen pilot project, key governance decisions, and likelihood of success. End with one concrete recommendation for their next step.`;
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI summaries not configured", fallback: true },
        { status: 503 }
      );
    }

    const body: SummaryRequest = await request.json();

    // Validate request
    if (!body.type || !body.data) {
      return NextResponse.json(
        { error: "Missing required fields: type and data" },
        { status: 400 }
      );
    }

    const prompt = getPrompt(body);

    // Call Claude Haiku for fast, cost-effective summaries
    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract text from response
    const summary =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({
      summary,
      timestamp: new Date().toISOString(),
      model: message.model,
    });
  } catch (error) {
    console.error("AI Summary error:", error);

    // Return a graceful error that allows fallback
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate summary",
        fallback: true,
      },
      { status: 500 }
    );
  }
}
