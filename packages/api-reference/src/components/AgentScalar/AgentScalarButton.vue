<script setup lang="ts">
import { ScalarIconSparkle } from '@scalar/icons'
import { useI18n } from 'vue-i18n'

import { useAgentContext } from '@/hooks/use-agent'

const agentContext = useAgentContext()
const { t } = useI18n()
</script>

<template>
  <button
    class="bg-sidebar-b-search text-sidebar-c-2 hover:text-sidebar-c-1 flex items-center gap-1.5 rounded border px-2 text-base whitespace-nowrap"
    type="button"
    @click="agentContext?.toggleAgent()">
    <ScalarIconSparkle />
    {{ t('apiReference.askAgent.label') }}
  </button>
</template>
