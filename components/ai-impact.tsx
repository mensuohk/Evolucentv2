import { GoogleGenerativeAI } from "@google/generative-ai"
import { prisma } from "@/src/db"

let _aiImpactModel: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null
function getAIImpactModel() {
  if (_aiImpactModel) return _aiImpactModel
  const key = process.env.GOOGLE_AI_API_KEY
  if (!key) return null
  _aiImpactModel = new GoogleGenerativeAI(key).getGenerativeModel({ model: "gemini-1.5-flash" })
  return _aiImpactModel
}

interface AIImpactProps {
  project: {
    id: string
    title: string
    description: string
    impactSummary: string | null
  }
}

async function generateAndStoreImpactSummary(project: {
  id: string
  title: string
  description: string
}): Promise<string> {
  const model = getAIImpactModel()
  if (!model) throw new Error("AI not configured")

  const prompt =
    `Summarize the following civic project's goals into exactly 3 concise bullet points ` +
    `for a public transparency ledger. Return only the 3 bullets, each starting with '•'.\n\n` +
    `Project: ${project.title}\n\n${project.description}`

  const result = await model.generateContent(prompt)
  const summary = result.response.text()

  // updateMany with the null guard prevents concurrent renders from racing to write
  await prisma.project.updateMany({
    where: { id: project.id, impactSummary: null },
    data: { impactSummary: summary },
  })

  return summary
}

export async function AIImpact({ project }: AIImpactProps) {
  if (!getAIImpactModel()) {
    return null
  }

  let summary = project.impactSummary

  if (!summary) {
    try {
      summary = await generateAndStoreImpactSummary(project)
    } catch {
      return null // non-fatal — AI summary is an enhancement, not core UI
    }
  }

  const bullets = summary
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("•"))

  if (bullets.length === 0) return null

  return (
    <section className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-evolucent-off-white p-6 dark:bg-card shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="rounded-full border border-civic-green/20 bg-civic-green/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-civic-green">
          AI Verified
        </span>
        <h2 className="font-display text-base font-bold text-foreground">
          Key Outcomes
        </h2>
      </div>
      <ul className="flex flex-col gap-3.5">
        {bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-foreground/80">
            <span className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full bg-gold-light text-[10px] font-bold text-gold-dark">
              ✓
            </span>
            <span>{bullet.replace(/^•\s*/, "")}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
