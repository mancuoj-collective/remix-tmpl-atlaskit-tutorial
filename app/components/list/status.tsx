import type { TCardStatus } from './types'

export function Status({ status }: { status: TCardStatus }) {
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
