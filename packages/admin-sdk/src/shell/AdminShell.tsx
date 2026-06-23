/**
 * AdminShell — full-width topbar over a (sidebar + content) row.
 * Owns the mobile drawer open state. Data-agnostic: pages render their own
 * PageHeader inside `children`. Scattered `<Slot>`s expose the shell's chrome
 * (topbar ends, sidebar top/bottom, main before/after) to extensions.
 */
import { useState, type ComponentType, type ReactNode } from 'react'
import { Sidebar, type SidebarSection, type SidebarLinkProps } from './Sidebar.js'
import { Topbar } from './Topbar.js'
import { MobileDrawer } from './MobileDrawer.js'
import { Slot } from '../extensions/Slot.js'

export interface AdminShellProps {
  /** Sidebar sections (entity groups + extension groups), in display order. */
  sections: SidebarSection[]
  currentPath?: string
  LinkComponent?: ComponentType<SidebarLinkProps>
  brand?: string
  userMenu?: ReactNode
  children: ReactNode
}

export function AdminShell({
  sections,
  currentPath,
  LinkComponent,
  brand = 'LathaCMS',
  userMenu,
  children,
}: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Topbar brand={brand} onMenuClick={() => setDrawerOpen(true)}>
        <div className="flex items-center gap-3">
          <Slot zone="shell.topbar.start" className="flex items-center gap-2" />
          {userMenu}
          <Slot zone="shell.topbar.end" className="flex items-center gap-2" />
        </div>
      </Topbar>
      <div className="flex min-h-0 flex-1">
        <aside className="sticky top-(--header-height) h-[calc(100vh-var(--header-height))] max-[860px]:hidden">
          <Sidebar
            sections={sections}
            currentPath={currentPath}
            LinkComponent={LinkComponent}
          />
        </aside>
        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sections={sections}
          currentPath={currentPath}
          LinkComponent={LinkComponent}
        />
        <main className="min-w-0 flex-1 p-page">
          <div className="mx-auto w-full max-w-content-max">
            <Slot zone="shell.main.before" />
            {children}
            <Slot zone="shell.main.after" />
          </div>
        </main>
      </div>
    </div>
  )
}
