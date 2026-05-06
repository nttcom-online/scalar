<script lang="ts" setup>
import { ScalarWrappingText } from '@scalar/components'
import { computed } from 'vue'

import type { Item } from '@/types'

const { item, operationTitleSource } = defineProps<{
  /**
   * The sidebar item to render.
   */
  item: Item
  /**
   * The source of the operation title.
   */
  operationTitleSource?: 'path' | 'summary'
}>()

const displayText = computed(() =>
  operationTitleSource === 'path' && 'path' in item
    ? (item.path as string)
    : (item.displayTitle ?? (item.title as string)),
)

const versionBadges = computed(() => item.versionBadges ?? [])
</script>
<template>
  <ScalarWrappingText
    v-if="item.type === 'model' || item.type === 'example'"
    preset="property"
    :text="item.title" />
  <div
    v-else
    class="sidebar-item-label">
    <span class="sidebar-item-label-text">
      <ScalarWrappingText :text="displayText" />
    </span>
    <div
      v-if="versionBadges.length"
      class="sidebar-item-badges">
      <span
        v-for="versionBadge in versionBadges"
        :key="versionBadge.label"
        class="sidebar-item-badge-group">
        <span class="sidebar-item-badge">
          {{ versionBadge.label }}
        </span>
        <span
          v-if="versionBadge.latest"
          class="sidebar-item-badge sidebar-item-badge-latest">
          {{ versionBadge.latestLabel ?? 'Latest' }}
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.sidebar-item-label {
  display: inline-flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.sidebar-item-label-text {
  min-width: 0;
}

.sidebar-item-badges {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 4px;
}

.sidebar-item-badge-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
}

.sidebar-item-badge {
  color: var(--scalar-sidebar-color-2, var(--scalar-color-2));
  background: var(--scalar-sidebar-background-2, var(--scalar-background-2));
  border: var(--scalar-border-width) solid
    var(--scalar-sidebar-border-color, var(--scalar-border-color));
  border-radius: 9999px;
  padding: 2px 6px;
  font-size: 10px;
  line-height: 1;
  font-family: var(--scalar-font-code);
  white-space: nowrap;
}

.sidebar-item-badge-latest {
  color: var(--scalar-color-green);
  background: color-mix(in srgb, var(--scalar-color-green), transparent 90%);
  border-color: transparent;
}
</style>
