import { cn } from '@/lib/utils'
import {
  type Edge,
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview'
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview'
import { GripVerticalIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal, flushSync } from 'react-dom'
import invariant from 'tiny-invariant'
import { DropIndicator } from './drop-indicator'

type TaskStatus = 'todo' | 'inProgress' | 'done'

type Task = {
  id: string
  content: string
  status: TaskStatus
}

const taskDataKey = Symbol('task')

type TaskData = {
  [taskDataKey]: true
  taskId: Task['id']
}

function getTaskData(task: Task): TaskData {
  return {
    [taskDataKey]: true,
    taskId: task.id,
  }
}

function isTaskData(data: Record<string | symbol, unknown>): data is TaskData {
  return data[taskDataKey] === true
}

function getTasks(): Task[] {
  return [
    { id: 'task-0', content: 'AAA', status: 'todo' },
    { id: 'task-1', content: 'BBB', status: 'inProgress' },
    { id: 'task-2', content: 'CCC', status: 'done' },
    { id: 'task-3', content: 'DDD', status: 'todo' },
    { id: 'task-4', content: 'EEE', status: 'done' },
    { id: 'task-5', content: 'FFF', status: 'done' },
    { id: 'task-6', content: 'GGG', status: 'todo' },
    { id: 'task-7', content: 'HHH', status: 'inProgress' },
  ]
}

function Status({ status }: { status: TaskStatus }) {
  const statusMap = {
    todo: { label: 'TODO', color: 'bg-blue-100' },
    inProgress: { label: 'In Progress', color: 'bg-yellow-100' },
    done: { label: 'Done', color: 'bg-green-100' },
  }

  return (
    <div className="flex justify-end w-[150px] shrink-0">
      <div
        className={`border border-neutral-300 rounded-md px-2 py-1 uppercase ${statusMap[status].color}`}
      >
        {statusMap[status].label}
      </div>
    </div>
  )
}

type TaskState =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement }
  | { type: 'isDragging' }
  | { type: 'isDraggingOver'; closestEdge: Edge | null }

function Task({ task }: { task: Task }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [state, setState] = useState<TaskState>({ type: 'idle' })

  useEffect(() => {
    const element = ref.current
    invariant(element, 'el is required')

    return combine(
      draggable({
        element,
        getInitialData: () => getTaskData(task),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({ x: '16px', y: '8px' }),
            render: ({ container }) => {
              setState({ type: 'preview', container })
            },
          })
        },
        onDragStart: () => setState({ type: 'isDragging' }),
        onDrop: () => setState({ type: 'idle' }),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          if (source.element === element) return false
          return isTaskData(source.data)
        },
        getData: ({ input }) => {
          const data = getTaskData(task)
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ['top', 'bottom'],
          })
        },
        getIsSticky: () => true,
        onDragEnter: ({ self }) => {
          const closestEdge = extractClosestEdge(self.data)
          setState({ type: 'isDraggingOver', closestEdge })
        },
        onDrag: ({ self }) => {
          const closestEdge = extractClosestEdge(self.data)
          setState((current) => {
            if (current.type === 'isDraggingOver' && current.closestEdge === closestEdge)
              return current
            return { type: 'isDraggingOver', closestEdge }
          })
        },
        onDragLeave: () => setState({ type: 'idle' }),
        onDrop: () => setState({ type: 'idle' }),
      }),
    )
  })

  return (
    <>
      <div className="relative">
        <div
          ref={ref}
          data-task-id={task.id}
          className={cn(
            'flex items-center text-sm  border border-neutral-300 rounded p-2 pl-0 hover:cursor-grab',
            {
              'opacity-50': state.type === 'isDragging',
            },
          )}
        >
          <div className="flex justify-center w-6 shrink-0">
            <GripVerticalIcon size={12} />
          </div>
          <span className="truncate grow shrink">{task.content}</span>
          <Status status={task.status} />
        </div>
        {state.type === 'isDraggingOver' && state.closestEdge ? (
          <DropIndicator edge={state.closestEdge} gap="10px" />
        ) : null}
      </div>
      {state.type === 'preview' ? createPortal(<DragPreview task={task} />, state.container) : null}
    </>
  )
}

function DragPreview({ task }: { task: Task }) {
  return <div className="border-solid rounded p-2 bg-neutral-100 text-sm">{task.content}</div>
}

export function List() {
  const [tasks, setTasks] = useState(() => getTasks())

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => isTaskData(source.data),
      onDrop: ({ location, source }) => {
        const target = location.current.dropTargets[0]
        if (!target) return

        const sourceData = source.data
        const targetData = target.data
        if (!isTaskData(sourceData) || !isTaskData(targetData)) return

        const indexOfSource = tasks.findIndex((task) => task.id === sourceData.taskId)
        const indexOfTarget = tasks.findIndex((task) => task.id === targetData.taskId)
        if (indexOfSource < 0 || indexOfTarget < 0) return

        const closestEdgeOfTarget = extractClosestEdge(targetData)

        flushSync(() => {
          setTasks(
            reorderWithEdge({
              list: tasks,
              startIndex: indexOfSource,
              indexOfTarget,
              closestEdgeOfTarget,
              axis: 'vertical',
            }),
          )
        })

        const element = document.querySelector(`[data-task-id="${sourceData.taskId}"]`)
        if (element instanceof HTMLElement) {
          element.animate([{ backgroundColor: 'oklch(92.2% 0 0)' }, {}], {
            easing: 'ease-in-out',
            duration: 1000,
            iterations: 1,
          })
        }
      },
    })
  })

  return (
    <div className="flex flex-col gap-2.5 border border-neutral-300 rounded p-3 w-[500px]">
      {tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  )
}
