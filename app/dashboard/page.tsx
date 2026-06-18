'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([])
  const [title, setTitle] = useState('')

  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*')
    setTasks(data || [])
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = async () => {
    if (!title) return

    await supabase.from('tasks').insert([
      { title, completed: false }
    ])

    setTitle('')
    fetchTasks()
  }

  const toggleTask = async (id: string, completed: boolean) => {
    await supabase
      .from('tasks')
      .update({ completed: !completed })
      .eq('id', id)

    fetchTasks()
  }

  const deleteTask = async (id: string) => {
    await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    fetchTasks()
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        📊 Dashboard
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          className="border p-2 rounded flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nouvelle tâche..."
        />
        <button
          className="bg-blue-500 text-white px-4 rounded"
          onClick={addTask}
        >
          Ajouter
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center bg-white shadow p-3 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id, task.completed)}
              />
              <span className={task.completed ? 'line-through' : ''}>
                {task.title}
              </span>
            </div>

            <button
              className="text-red-500"
              onClick={() => deleteTask(task.id)}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}