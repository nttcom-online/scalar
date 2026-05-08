import type { InjectionKey } from 'vue'

/**
 * Injection key for sharing the parsed document's components.schemas
 * with deeply nested Schema components.
 * Used to resolve discriminator.mapping $ref strings to actual schema objects.
 */
export const DOCUMENT_SCHEMAS_SYMBOL = Symbol() as InjectionKey<Record<string, any> | undefined>
