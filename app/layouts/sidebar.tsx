import { cn } from '@/lib/utils'
import { AppleIcon, CherryIcon } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'

const links = [
  { to: '/', icon: <AppleIcon className="size-4.5" />, label: 'Chess' },
  { to: '/board', icon: <CherryIcon className="size-4.5" />, label: 'Board' },
]

export default function SidebarLayout() {
  return (
    <div className="flex flex-col gap-6 items-center p-20 min-h-svh">
      <ul className="menu menu-horizontal bg-base-300 rounded-box gap-1.5">
        {links.map(({ to, icon, label }) => (
          <li key={label}>
            <NavLink
              to={to}
              className={({ isActive, isPending }) =>
                cn(
                  'tooltip tooltip-right',
                  isActive ? 'bg-base-100' : isPending ? 'opacity-60 bg-base-100' : '',
                )
              }
              data-tip={label}
            >
              {icon}
            </NavLink>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  )
}
