<script setup lang="ts">
import type { OperationObject } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  getOperationScopes,
  getOperationThrottlingInfo,
  getRateLimitPeriodValue,
  getRateLimitTitleKey,
} from '@/features/Operation/helpers/operation-metadata'

type OperationWithMetadata = OperationObject & {
  'x-scopes'?: unknown
  'x-throttling-info'?: unknown
}

type DisplayRateLimit = {
  title: string
  value?: string
  lines?: string[]
}

const { operation } = defineProps<{
  operation: OperationWithMetadata
}>()

const { t } = useI18n()

const scopes = computed(() => getOperationScopes(operation))

const requestRateLimits = computed<DisplayRateLimit[]>(() => [
  ...getOperationThrottlingInfo(operation)
    .filter(
      (rateLimit) =>
        rateLimit.type !== 'token' &&
        typeof rateLimit.numberOfRequests === 'number',
    )
    .map((rateLimit) => {
      const period = getRateLimitPeriodValue(rateLimit)
      const periodLabel = [period.amount, t(period.unitKey)]
        .filter((value) => value !== null)
        .join(' ')

      return {
        title: t(getRateLimitTitleKey(rateLimit.type)),
        value: `${rateLimit.numberOfRequests} ${t('apiReference.operationMeta.requests')} / ${periodLabel}`,
      }
    }),
  ...getOperationThrottlingInfo(operation)
    .filter((rateLimit) => rateLimit.type === 'token')
    .map((rateLimit) => {
      const burst = `${t('apiReference.operationMeta.burst')}: ${rateLimit.burstCapacity} ${t('apiReference.operationMeta.requests')}`
      const refill = `${t('apiReference.operationMeta.refill')}: ${rateLimit.replenishRate} ${t('apiReference.operationMeta.requests')} / ${t('apiReference.operationMeta.timeUnits.second')}`
      return {
        title: t(getRateLimitTitleKey(rateLimit.type)),
        lines: [burst, refill],
      }
    }),
])

const hasMetadata = computed(
  () => scopes.value.length > 0 || requestRateLimits.value.length > 0,
)
</script>

<template>
  <div
    v-if="hasMetadata"
    class="mt-6 space-y-6">
    <div v-if="scopes.length">
      <div class="text-c-1 mt-3 mb-3 leading-[1.45] font-medium">
        {{ t('apiReference.operationMeta.scopes') }}
      </div>
      <div class="flex flex-wrap gap-2 text-sm">
        <span
          v-for="scope in scopes"
          :key="scope"
          class="text-c-2 bg-b-2 rounded-full border px-2.5 py-1 font-mono leading-none">
          {{ scope }}
        </span>
      </div>
    </div>

    <div v-if="requestRateLimits.length">
      <div class="text-c-1 mt-3 mb-3 leading-[1.45] font-medium">
        {{ t('apiReference.operationMeta.requestRateLimits') }}
      </div>
      <div class="space-y-3 text-sm">
        <div
          v-for="(rateLimit, index) in requestRateLimits"
          :key="`${rateLimit.title}-${index}`"
          class="bg-b-1 rounded-lg border px-3 py-2.5">
          <div class="text-c-1 font-medium">
            {{ rateLimit.title }}
          </div>
          <div
            v-if="rateLimit.lines"
            class="text-c-2 mt-1 space-y-0.5">
            <div
              v-for="(line, lineIndex) in rateLimit.lines"
              :key="lineIndex">
              • {{ line }}
            </div>
          </div>
          <div
            v-else
            class="text-c-2 mt-1">
            {{ rateLimit.value }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
