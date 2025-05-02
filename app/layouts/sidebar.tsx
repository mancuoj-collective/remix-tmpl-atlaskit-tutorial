import { cn } from '@/lib/utils'
import { AppleIcon, CherryIcon, CitrusIcon } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'

const links = [
  { to: '/', icon: <AppleIcon className="size-4.5" />, label: 'Chess' },
  { to: '/list', icon: <CitrusIcon className="size-4.5" />, label: 'List' },
  { to: '/board', icon: <CherryIcon className="size-4.5" />, label: 'Board' },
]

export default function SidebarLayout() {
  return (
    <div className="flex flex-col gap-7 items-center p-20 min-h-svh">
      <ul className="menu menu-horizontal bg-base-300 rounded-box gap-1.5">
        {links.map(({ to, icon, label }) => (
          <li key={label}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(isActive ? 'bg-base-100' : '')
              }
              viewTransition
            >
              {icon}
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  )
}
