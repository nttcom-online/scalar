<script setup lang="ts">
import type { WorkspaceEventBus } from '@scalar/workspace-store/events'
import { useI18n } from 'vue-i18n'

import { Section, SectionHeader } from '@/components/Section'
import SectionContainer from '@/components/Section/SectionContainer.vue'
import SectionContainerAccordion from '@/components/Section/SectionContainerAccordion.vue'
import SectionHeaderTag from '@/components/Section/SectionHeaderTag.vue'
import ShowMoreButton from '@/components/ShowMoreButton.vue'

defineProps<{
  id: string
  isCollapsed: boolean
  eventBus: WorkspaceEventBus
  layout: 'classic' | 'modern'
}>()
const { t } = useI18n()
</script>
<template>
  <!-- Modern Layout Model Container -->
  <SectionContainer
    v-if="layout === 'modern'"
    id="model">
    <Section
      :id="id"
      :aria-label="t('apiReference.models.label')"
      @intersecting="() => eventBus?.emit('intersecting:nav-item', { id })">
      <SectionHeader>
        <SectionHeaderTag :level="2">{{
          t('apiReference.models.label')
        }}</SectionHeaderTag>
      </SectionHeader>
      <template v-if="!isCollapsed">
        <slot />
      </template>
      <template v-else>
        <ShowMoreButton
          :id
          class="top-0"
          @click="() => eventBus.emit('toggle:nav-item', { id, open: true })">
        </ShowMoreButton>
      </template>
    </Section>
  </SectionContainer>
  <!-- Classic Layout Model Container -->
  <SectionContainerAccordion
    v-else
    :aria-label="t('apiReference.models.label')"
    class="pb-12"
    :modelValue="!isCollapsed"
    @update:modelValue="
      () => eventBus?.emit('toggle:nav-item', { id, open: isCollapsed })
    ">
    <template #title>
      <SectionHeader :level="2">{{
        t('apiReference.models.label')
      }}</SectionHeader>
    </template>
    <slot />
  </SectionContainerAccordion>
</template>
