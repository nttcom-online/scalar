<script setup lang="ts">
import { ScalarFormInputGroup, ScalarToggleInput } from '@scalar/components'
import type { ApiReferenceConfiguration } from '@scalar/types/api-reference'
import { useI18n } from 'vue-i18n'

type LayoutOptions = {
  showSidebar?: boolean
  defaultOpenFirstTag?: boolean
  defaultOpenAllTags?: boolean
  expandAllModelSections?: boolean
  expandAllResponses?: boolean
  hideClientButton?: boolean
  hideDarkModeToggle?: boolean
  hideModels?: boolean
  hideSearch?: boolean
  hideTestRequestButton?: boolean
  showOperationId?: boolean
}

const { configuration } = defineProps<{
  configuration?: Partial<ApiReferenceConfiguration>
}>()

const model = defineModel<LayoutOptions>({
  default: {},
})

function getValue(key: keyof LayoutOptions, defaultValue: boolean = false) {
  return model.value[key] ?? configuration?.[key] ?? defaultValue
}

function setValue(
  key: keyof LayoutOptions,
  value: boolean,
  defaultValue: boolean = false,
) {
  if (value !== defaultValue) {
    model.value = { ...model.value, [key]: value }
  } else {
    model.value = Object.fromEntries(
      Object.entries(model.value).filter(([k]) => key !== k),
    )
  }
}

const { t } = useI18n()
</script>
<template>
  <ScalarFormInputGroup>
    <ScalarToggleInput
      :modelValue="getValue('showSidebar', true)"
      @update:modelValue="(v) => setValue('showSidebar', !!v, true)">
      {{ t('apiReference.devTools.showSidebar') }}
    </ScalarToggleInput>
    <ScalarToggleInput
      :modelValue="getValue('defaultOpenFirstTag', true)"
      @update:modelValue="(v) => setValue('defaultOpenFirstTag', !!v, true)">
      Default Open First Tag
    </ScalarToggleInput>
    <ScalarToggleInput
      :modelValue="getValue('defaultOpenAllTags')"
      @update:modelValue="(v) => setValue('defaultOpenAllTags', !!v)">
      Default Open All Tags
    </ScalarToggleInput>
    <ScalarToggleInput
      :modelValue="getValue('expandAllModelSections')"
      @update:modelValue="(v) => setValue('expandAllModelSections', !!v)">
      Expand All Model Sections
    </ScalarToggleInput>
    <ScalarToggleInput
      :modelValue="getValue('expandAllResponses')"
      @update:modelValue="(v) => setValue('expandAllResponses', !!v)">
      Expand All Responses
    </ScalarToggleInput>
    <ScalarToggleInput
      :modelValue="getValue('hideClientButton')"
      @update:modelValue="(v) => setValue('hideClientButton', !!v)">
      {{ t('apiReference.devTools.hideClientButton') }}
    </ScalarToggleInput>
    <ScalarToggleInput
      :modelValue="getValue('hideDarkModeToggle')"
      @update:modelValue="(v) => setValue('hideDarkModeToggle', !!v)">
      {{ t('apiReference.devTools.hideDarkModeToggle') }}
    </ScalarToggleInput>
    <ScalarToggleInput
      :modelValue="getValue('hideModels')"
      @update:modelValue="(v) => setValue('hideModels', !!v)">
      {{ t('apiReference.devTools.hideModels') }}
    </ScalarToggleInput>
    <ScalarToggleInput
      :modelValue="getValue('hideSearch')"
      @update:modelValue="(v) => setValue('hideSearch', !!v)">
      {{ t('apiReference.devTools.hideSearch') }}
    </ScalarToggleInput>
    <ScalarToggleInput
      :modelValue="getValue('showOperationId')"
      @update:modelValue="(v) => setValue('showOperationId', !!v)">
      {{ t('apiReference.devTools.showOperationId') }}
    </ScalarToggleInput>
    <ScalarToggleInput
      :modelValue="getValue('hideTestRequestButton')"
      @update:modelValue="(v) => setValue('hideTestRequestButton', !!v)">
      {{ t('apiReference.devTools.hideTestRequestButton') }}
    </ScalarToggleInput>
  </ScalarFormInputGroup>
</template>
