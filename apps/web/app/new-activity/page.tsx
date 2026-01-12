'use client'

import { useState } from 'react'
import { createActivity } from '@/app/actions/activities'
import type { Activity } from '@/lib/types/activities'

export default function NewActivityPage() {
  const [title, setTitle] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [recurrenceWeekday, setRecurrenceWeekday] = useState<string>('')
  const [recurrenceStartTime, setRecurrenceStartTime] = useState('')
  const [recurrenceEndTime, setRecurrenceEndTime] = useState('')
  const [recurrenceStartsOn, setRecurrenceStartsOn] = useState('')
  const [recurrenceEndsOn, setRecurrenceEndsOn] = useState('')
  const [result, setResult] = useState<Activity | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Hardcoded test UUIDs for minimal scaffolding
  const TEST_HOUSEHOLD_ID = '00000000-0000-0000-0000-000000000001'
  const TEST_CHILD_ID = '00000000-0000-0000-0000-000000000002'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Convert datetime-local to ISO string for Supabase
      const startAtISO = new Date(startAt).toISOString()
      const endAtISO = new Date(endAt).toISOString()

      // Prepare recurrence fields
      const recurrenceWeekdayNum = recurrenceWeekday ? parseInt(recurrenceWeekday, 10) : null
      const recurrenceStartTimeValue = recurrenceStartTime || null
      const recurrenceEndTimeValue = recurrenceEndTime || null
      const recurrenceStartsOnValue = recurrenceStartsOn || null
      const recurrenceEndsOnValue = recurrenceEndsOn || null

      const activity = await createActivity(
        TEST_HOUSEHOLD_ID,
        TEST_CHILD_ID,
        title,
        startAtISO,
        endAtISO,
        recurrenceWeekdayNum,
        recurrenceStartTimeValue,
        recurrenceEndTimeValue,
        recurrenceStartsOnValue,
        recurrenceEndsOnValue
      )

      setResult(activity)
      console.log('Created activity:', activity)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create activity'
      setError(errorMessage)
      console.error('Error creating activity:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Activity</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">
            Activity Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label htmlFor="startAt" className="block mb-1">
            Start Time
          </label>
          <input
            type="datetime-local"
            id="startAt"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label htmlFor="endAt" className="block mb-1">
            End Time
          </label>
          <input
            type="datetime-local"
            id="endAt"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="pt-4 mt-4 border-t border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Recurrence (Optional)</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="recurrenceWeekday" className="block mb-1">
                Day of Week
              </label>
              <select
                id="recurrenceWeekday"
                value={recurrenceWeekday}
                onChange={(e) => setRecurrenceWeekday(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">Select a day</option>
                <option value="0">Sunday</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
              </select>
            </div>

            <div>
              <label htmlFor="recurrenceStartTime" className="block mb-1">
                Start Time
              </label>
              <input
                type="time"
                id="recurrenceStartTime"
                value={recurrenceStartTime}
                onChange={(e) => setRecurrenceStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="recurrenceEndTime" className="block mb-1">
                End Time
              </label>
              <input
                type="time"
                id="recurrenceEndTime"
                value={recurrenceEndTime}
                onChange={(e) => setRecurrenceEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="recurrenceStartsOn" className="block mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="recurrenceStartsOn"
                value={recurrenceStartsOn}
                onChange={(e) => setRecurrenceStartsOn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="recurrenceEndsOn" className="block mb-1">
                End Date (Optional)
              </label>
              <input
                type="date"
                id="recurrenceEndsOn"
                value={recurrenceEndsOn}
                onChange={(e) => setRecurrenceEndsOn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h2 className="font-bold mb-2">Activity Created Successfully!</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </main>
  )
}
