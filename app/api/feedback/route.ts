import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const FALLBACK_MESSAGE = `Based on your current habits, small changes can make a real difference. Consider reducing your most impactful activity—whether it's driving less, lowering energy use, or cutting back on deliveries. Even minor adjustments compound over time to reduce your environmental footprint.`

export async function POST(request: Request) {
  try {
    const { transport, energy, consumption } = await request.json()

    // Check if AI feedback is enabled
    const aiEnabled = process.env.ENABLE_AI_FEEDBACK === 'true'
    
    if (!aiEnabled) {
      return NextResponse.json({ feedback: FALLBACK_MESSAGE })
    }

    const prompt = `You are an environmental impact advisor. A user has these weekly habits:
- Driving: ${transport}/100 (0=no driving, 100=max driving)
- Energy usage: ${energy}/100 (0=minimal, 100=maximum)
- Consumption: ${consumption}/100 (0=minimal, 100=maximum)

Provide brief, actionable feedback (3-4 sentences max) that:
1. Identifies their most impactful habit
2. Gives one specific, practical suggestion to improve
3. Is encouraging but honest

Keep it conversational and direct. No bullet points or headers.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    })

    const feedback = completion.choices[0].message.content

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error('OpenAI API error:', error)
    // Return fallback message instead of error
    return NextResponse.json({ feedback: FALLBACK_MESSAGE })
  }
}
