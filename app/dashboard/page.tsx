'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState<'all' | 'done' | 'pending'>('all')
  const [user, setUser] = useState<any>(null)

  const fetchTasks = async () => {
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) return

    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)

    setTasks(data || [])
  }

  useEffect(() => {
    const loadData = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const currentUser = userData.user

      setUser(currentUser)

      if (currentUser) {
        const { data } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', currentUser.id)

        setTasks(data || [])
      }
    }

    loadData()
  }, [])

  const addTask = async () => {
    if (!title) return

    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) return

    await supabase.from('tasks').insert([
      {
        title,
        completed: false,
        user_id: user.id
      }
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

  if (!user) {
      return (
        <div className="h-screen flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      )
    }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">
          📊 Dashboard
        </h1>
        
        <div className="flex justify-center gap-2 mb-6">
          {['all', 'done', 'pending'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <p>Total</p>
            <p className="text-xl font-bold">{tasks.length}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p>Completed</p>
            <p className="text-xl font-bold">
              {tasks.filter(t => t.completed).length}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p>Pending</p>
            <p className="text-xl font-bold">
              {tasks.filter(t => !t.completed).length}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nouvelle tâche..."
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-lg transition"
            onClick={addTask}
          >
            Ajouter
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-bold">{tasks.length}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Done</p>
            <p className="text-xl font-bold">
              {tasks.filter(t => t.completed).length}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-xl font-bold">
              {tasks.filter(t => !t.completed).length}
            </p>
          </div>
        </div>

        <ul className="space-y-2">
          {tasks
            .filter((task) => {
              if (filter === 'done') return task.completed
              if (filter === 'pending') return !task.completed
              return true
            })
            .map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id, task.completed)}
                />
                <span
                  className={`transition-all duration-200 ${
                    task.completed ? 'line-through opacity-50' : ''
                  }`}
                >
                  {task.title}
                </span>
              </div>

              <button
                className="text-red-400 hover:text-red-600 transition"
                onClick={() => deleteTask(task.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}