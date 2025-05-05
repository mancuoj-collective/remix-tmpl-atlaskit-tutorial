import { cn } from '@/lib/utils'
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { GripVerticalIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import invariant from 'tiny-invariant'

type Task = {
  id: string
  content: string
  status: TaskStatus
}

type TaskStatus = 'todo' | 'inProgress' | 'done'

function getTasks(): Task[] {
  return [
    { id: 'task-0', content: 'Organize a team-building event', status: 'todo' },
    { id: 'task-1', content: 'Create and maintain office inventory', status: 'inProgress' },
    { id: 'task-2', content: 'Update company website content', status: 'done' },
    { id: 'task-3', content: 'Plan and execute marketing campaigns', status: 'todo' },
    { id: 'task-4', content: 'Coordinate employee training sessions', status: 'done' },
    { id: 'task-5', content: 'Manage facility maintenance', status: 'done' },
    { id: 'task-6', content: 'Organize customer feedback surveys', status: 'todo' },
    { id: 'task-7', content: 'Coordinate travel arrangements', status: 'inProgress' },
  ]
}

function Status({ status }: { status: TaskStatus }) {
  const statusMap = {
    todo: { label: 'TODO', color: 'badge-primary' },
    inProgress: { label: 'In Progress', color: 'badge-info' },
    done: { label: 'Done', color: 'badge-success' },
  }

  return (
    <div className={`badge badge-sm badge-soft uppercase ${statusMap[status].color}`}>
      {statusMap[status].label}
    </div>
  )
}

type TaskState =
  | { type: 'idle' }
  | { type: 'preview' }
  | { type: 'isDragging' }
  | { type: 'isDraggingOver' }

function Task({ task }: { task: Task }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [state, setState] = useState<TaskState>({ type: 'idle' })

  useEffect(() => {
    const element = ref.current
    invariant(element, 'el is required')

    return draggable({
      element,
      onDragStart: () => setState({ type: 'isDragging' }),
      onDrop: () => setState({ type: 'idle' }),
    })
  })

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center text-sm bg-base-200 border border-base-300 rounded p-2 pl-0 hover:bg-base-300 hover:cursor-grab',
        {
          'opacity-50': state.type === 'isDragging',
        },
      )}
    >
      <div className="flex justify-center w-6 shrink-0">
        <GripVerticalIcon size={12} />
      </div>
      <span className="truncate grow shrink">{task.content}</span>
      <div className="flex justify-end w-[100px] shrink-0">
        <Status status={task.status} />
      </div>
    </div>
  )
}

export function List() {
  const [tasks, setTasks] = useState(() => getTasks())

  return (
    <div className="flex flex-col gap-2 border border-base-300 rounded p-3 w-[500px]">
      {tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  )
}
