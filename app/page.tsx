// Triggering Vercel rebuild to inject the Supabase environment variables
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

interface Todo {
  id: string | number;
  name: string;
}

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <main className="min-h-screen bg-[#09090b] text-white p-12">
      <h1 className="text-2xl font-bold mb-6">Supabase Live Connection Test</h1>
      
      {todos && todos.length > 0 ? (
        <ul className="space-y-2">
          {todos.map((todo: Todo) => (
            <li key={todo.id} className="p-3 bg-white/5 rounded-xl border border-white/5">
              {todo.name}
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-6 bg-white/5 rounded-xl border border-white/5 text-zinc-400">
          No todos found or table &apos;todos&apos; is empty/not created yet.
        </div>
      )}
    </main>
  )
}
