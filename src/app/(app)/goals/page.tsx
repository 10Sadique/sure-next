import { getGoalsData } from "@/lib/data"
import { GoalsView } from "@/components/goals/goals-view"

export default async function GoalsPage() {
  const data = await getGoalsData()

  return (
    <div className="max-w-6xl mx-auto">
      <GoalsView goals={data.goals} />
    </div>
  )
}
