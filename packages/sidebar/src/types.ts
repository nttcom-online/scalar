import type { TraversedEntry } from '@scalar/workspace-store/schemas/navigation'

export type SidebarVersionBadge = {
  label: string
  latest: boolean
  latestLabel?: string
}

/**
 * A local re-export of TraversedEntry used in the sidebar components
 */
/**
 * Sidebar `Item` may include an injected, localized display title.
 * We keep it optional to avoid changing upstream navigation types.
 */
export type Item = TraversedEntry & {
  displayTitle?: string
  versionBadges?: SidebarVersionBadge[]
}

export type Layout = 'client' | 'reference'
