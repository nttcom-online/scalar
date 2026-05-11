import { resolve } from '@scalar/workspace-store/resolve'
import type { SchemaObject, SchemaReferenceType } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document'

import { getRefName } from './get-ref-name'

/**
 * Extract schema name from various schema formats
 *
 * Handles $ref, title, name, type, and schema dictionary lookup
 */
export const getModelNameFromSchema = (
  schemaOrRef: SchemaObject | SchemaReferenceType<SchemaObject>,
): string | null => {
  if (!schemaOrRef) {
    return null
  }

  const schema = resolve.schema(schemaOrRef)

  // Direct title/name properties - use direct property access for better performance
  if (schema.title) {
    return schema.title
  }

  if (schema.name) {
    return schema.name
  }

  if ('$ref' in schemaOrRef) {
    // Fall back to the schema key when the referenced schema has no human-friendly name.
    const refName = getRefName(schemaOrRef.$ref)
    if (refName) {
      // Strip hash-like prefix (e.g. "abc123def.TypeName" → "TypeName")
      const dotIndex = refName.indexOf('.')
      if (dotIndex > 0 && /^[0-9a-f]{16,}$/.test(refName.substring(0, dotIndex))) {
        return refName.substring(dotIndex + 1)
      }
      return refName
    }
  }

  return null
}
