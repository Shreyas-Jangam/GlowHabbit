import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HabitData {
  habits: Array<{
    name: string;
    category: string;
    completionRate: number;
    currentStreak: number;
    isCompletedToday: boolean;
  }>;
  moodTrend: 'positive' | 'neutral' | 'negative';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  journalMood?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { habits, moodTrend, timeOfDay, journalMood } = await req.json() as HabitData;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const strugglingHabits = habits
      .filter(h => h.completionRate < 50)
      .map(h => h.name)
      .slice(0, 3);

    const completedToday = habits.filter(h => h.isCompletedToday).map(h => h.name);
    const notCompletedToday = habits.filter(h => !h.isCompletedToday).map(h => h.name);

    const systemPrompt = `You are a gentle, supportive wellness companion for a habit tracking app called GlowHabit. Your role is to provide calm, non-judgmental encouragement and practical suggestions.

PERSONALITY:
- Warm and understanding, like a caring friend
- Never pushy or demanding
- Focus on progress over perfection
- Use soft, encouraging language
- Acknowledge struggles without judgment

RESPONSE FORMAT:
Return a JSON object with these fields:
- "suggestion": A brief, kind suggestion (max 100 chars)
- "affirmation": A gentle affirmation (max 80 chars)
- "tip": Optional practical micro-tip (max 120 chars)

RULES:
- Keep responses short and calming
- Suggest easier alternatives when user is struggling
- Consider time of day for relevance
- Focus on one thing at a time
- Never use guilt or pressure`;

    const userContext = `
Time of day: ${timeOfDay}
Mood trend: ${moodTrend}
${journalMood ? `Recent journal mood: ${journalMood}` : ''}

Habits completed today: ${completedToday.length > 0 ? completedToday.join(', ') : 'None yet'}
Habits remaining: ${notCompletedToday.length > 0 ? notCompletedToday.join(', ') : 'All done!'}
${strugglingHabits.length > 0 ? `Habits needing support (low completion): ${strugglingHabits.join(', ')}` : ''}

Based on this context, provide a gentle, personalized suggestion that feels supportive and achievable.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContext },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Rate limit exceeded",
            fallback: {
              suggestion: "Take a moment to breathe. You're doing great.",
              affirmation: "Every small step counts.",
              tip: null
            }
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "Payment required",
            fallback: {
              suggestion: "Focus on one habit at a time today.",
              affirmation: "Progress, not perfection.",
              tip: null
            }
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse JSON from response
    let parsedContent;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      // Fallback if JSON parsing fails
      parsedContent = {
        suggestion: content.slice(0, 100),
        affirmation: "You're making progress, one step at a time.",
        tip: null
      };
    }

    return new Response(
      JSON.stringify(parsedContent),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("habit-suggestions error:", error);
    
    // Return a calm fallback instead of error
    return new Response(
      JSON.stringify({
        suggestion: "Be gentle with yourself today.",
        affirmation: "Every moment is a fresh start.",
        tip: null,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
