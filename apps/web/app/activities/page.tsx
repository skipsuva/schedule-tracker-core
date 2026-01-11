import { getActivities } from '@/app/actions/activities'

export default async function ActivitiesPage() {
  const activities = await getActivities()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Activities</h1>
      
      <ul className="space-y-4">
        {activities.map((activity) => (
          <li key={activity.id} className="border-b pb-4">
            <div>
              <strong>{activity.title}</strong>
            </div>
            <div className="text-sm text-gray-600">
              <div>ID: {activity.id}</div>
              <div>Household ID: {activity.household_id}</div>
              <div>Child ID: {activity.child_id}</div>
              <div>Start: {new Date(activity.start_at).toLocaleString()}</div>
              <div>End: {new Date(activity.end_at).toLocaleString()}</div>
              <div>Created: {new Date(activity.created_at).toLocaleString()}</div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
