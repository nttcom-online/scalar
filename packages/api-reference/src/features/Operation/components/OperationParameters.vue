<script setup lang="ts">
import type { WorkspaceEventBus } from '@scalar/workspace-store/events'
import { getResolvedRef } from '@scalar/workspace-store/helpers/get-resolved-ref'
import type {
  ParameterObject,
  ReferenceType,
  RequestBodyObject,
} from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { shouldIgnoreEntity } from '@/features/Operation/helpers/should-ignore-entity'
import type { OperationProps } from '@/features/Operation/Operation.vue'

import ParameterList from './ParameterList.vue'
import RequestBody from './RequestBody.vue'

const { parameters = [], requestBody } = defineProps<{
  breadcrumb?: string[]
  parameters?: ReferenceType<ParameterObject>[]
  requestBody?: RequestBodyObject | undefined
  eventBus: WorkspaceEventBus | null
  options: Pick<
    OperationProps['options'],
    'hideModels' | 'orderRequiredPropertiesFirst' | 'orderSchemaPropertiesBy'
  >
}>()

/** Thread the selected request body content type up to the layout */
const selectedContentType = defineModel<string>('selectedContentType')

/** Use a single loop to reduce parameters by type(in) */
const splitParameters = computed(() =>
  (parameters ?? []).reduce(
    (acc, p) => {
      const parameter = getResolvedRef(p)
      // Filter out ignored parameters
      if (!shouldIgnoreEntity(parameter)) {
        acc[parameter.in].push(parameter)
      }
      return acc
    },
    { cookie: [], header: [], path: [], query: [] } as Record<
      'cookie' | 'header' | 'path' | 'query',
      ParameterObject[]
    >,
  ),
)
const { t } = useI18n()
</script>
<template>
  <!-- Path parameters-->
  <ParameterList
    :breadcrumb="breadcrumb ? [...breadcrumb, 'path'] : undefined"
    :eventBus="eventBus"
    :options="options"
    :parameters="splitParameters['path']">
    <template #title>{{ t('apiClient.labels.pathParameters') }}</template>
  </ParameterList>

  <!-- Query parameters -->
  <ParameterList
    :breadcrumb="breadcrumb ? [...breadcrumb, 'query'] : undefined"
    :eventBus="eventBus"
    :options="options"
    :parameters="splitParameters['query']">
    <template #title>{{ t('apiClient.labels.queryParameters') }}</template>
  </ParameterList>

  <!-- Headers -->
  <ParameterList
    :breadcrumb="breadcrumb ? [...breadcrumb, 'headers'] : undefined"
    :eventBus="eventBus"
    :options="options"
    :parameters="splitParameters['header']">
    <template #title>{{ t('apiClient.labels.headers') }}</template>
  </ParameterList>

  <!-- Cookies -->
  <ParameterList
    :breadcrumb="breadcrumb ? [...breadcrumb, 'cookies'] : undefined"
    :eventBus="eventBus"
    :options="options"
    :parameters="splitParameters['cookie']">
    <template #title>{{ t('apiClient.labels.cookies') }}</template>
  </ParameterList>

  <!-- Request body -->
  <RequestBody
    v-if="requestBody"
    v-model:selectedContentType="selectedContentType"
    :breadcrumb="breadcrumb ? [...breadcrumb, 'body'] : undefined"
    :eventBus="eventBus"
    :options="options"
    :requestBody="requestBody">
    <template #title>{{ t('apiClient.labels.requestBody') }}</template>
  </RequestBody>
</template>
