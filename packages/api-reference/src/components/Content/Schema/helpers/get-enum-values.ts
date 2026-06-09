import { resolve } from '@scalar/workspace-store/resolve'
import type { DiscriminatorObject, SchemaObject } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document'
import { isArraySchema } from '@scalar/workspace-store/schemas/v3.1/strict/type-guards'

/**
 * Extract enum values from schema or array items
 *
 * @param value - The schema object to extract enum values from
 * @param discriminator - Discriminator config from parent schema
 * @param propertyName - Current property name
 * @returns Array of enum values, or empty array if no enum found
 */
export const getEnumValues = (
  value: SchemaObject | undefined,
  discriminator?: DiscriminatorObject,
  propertyName?: string,
): unknown[] => {
  if (!value) {
    return []
  }

  // Check for enum directly on the schema
  if (value.enum) {
    return value.enum
  }

  // For discriminator properties without explicit enum, use mapping keys.
  if (propertyName && discriminator?.propertyName === propertyName && discriminator.mapping) {
    const mappingValues = Object.keys(discriminator.mapping)
    if (mappingValues.length > 0) {
      return mappingValues
    }
  }

  // Check for enum in array items (resolving $ref if present)
  if (isArraySchema(value) && typeof value.items === 'object') {
    const resolvedItems = resolve.schema(value.items)
    if (resolvedItems && 'enum' in resolvedItems && resolvedItems.enum) {
      return resolvedItems.enum
    }
  }

  return []
}
