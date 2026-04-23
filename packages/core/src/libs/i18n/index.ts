import { type I18n, createI18n } from 'vue-i18n'

export type ScalarLocale = 'en' | 'ja' | (string & {})
export type ScalarMessageValue = string | ScalarMessageSchema
export type ScalarMessageSchema = {
  [key: string]: ScalarMessageValue
}
export type ScalarMessages = Record<string, ScalarMessageSchema>
export type ScalarMessageInput = Partial<Record<ScalarLocale, ScalarMessageSchema>>

const coreMessages = {} satisfies ScalarMessageInput

const isMessageSchema = (value: ScalarMessageValue | undefined): value is ScalarMessageSchema =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const mergeMessageSchema = (
  base: ScalarMessageSchema = {},
  override: ScalarMessageSchema = {},
): ScalarMessageSchema => {
  const merged: ScalarMessageSchema = { ...base }

  for (const [key, value] of Object.entries(override)) {
    const existingValue = merged[key]

    merged[key] =
      isMessageSchema(existingValue) && isMessageSchema(value) ? mergeMessageSchema(existingValue, value) : value
  }

  return merged
}

export const mergeScalarMessages = (...messageSets: Array<ScalarMessageInput | undefined>): ScalarMessages => {
  const mergedMessages: ScalarMessages = {}

  for (const messageSet of messageSets) {
    if (!messageSet) {
      continue
    }

    for (const [locale, schema] of Object.entries(messageSet)) {
      mergedMessages[locale] = mergeMessageSchema(mergedMessages[locale], schema)
    }
  }

  return mergedMessages
}

export const createScalarI18n = (options?: {
  locale?: ScalarLocale
  fallbackLocale?: ScalarLocale
  messages?: ScalarMessageInput
}): I18n => {
  const locale = options?.locale ?? 'en'
  const fallbackLocale = options?.fallbackLocale ?? 'en'
  const messages = mergeScalarMessages(coreMessages, options?.messages)

  return createI18n({
    legacy: false,
    locale,
    fallbackLocale,
    messages,
  })
}

export const scalarCoreMessages = coreMessages

export default createScalarI18n
