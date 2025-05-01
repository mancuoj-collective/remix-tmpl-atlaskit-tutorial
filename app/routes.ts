import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  layout('layouts/sidebar.tsx', [index('routes/home.tsx'), route('board', 'routes/board.tsx')]),
] satisfies RouteConfig
