import type { SchemaObject } from '@scalar/workspace-store/schemas/v3.1/strict/openapi-document'
import { describe, expect, it } from 'vitest'

import { shouldDisplayHeading } from './should-display-heading'

describe('should-display-heading', () => {
  describe('shouldDisplayHeading', () => {
    it('returns true when name is provided even if value is undefined', () => {
      expect(shouldDisplayHeading(undefined, 'propertyName')).toBe(true)
    })

    it('returns true when required is true even if value and name are undefined', () => {
      expect(shouldDisplayHeading(undefined, undefined, true)).toBe(true)
    })

    it('returns true when schema has deprecated property', () => {
      const schema = {
        type: 'string',
        deprecated: true,
      } as SchemaObject

      expect(shouldDisplayHeading(schema)).toBe(true)
    })

    it('returns true when schema has const value', () => {
      const schema = {
        type: 'string',
        const: 'fixed-value',
      } as SchemaObject

      expect(shouldDisplayHeading(schema)).toBe(true)
    })

    it('returns true when schema has single enum value', () => {
      const schema = {
        type: 'string',
        enum: ['only-value'],
      } as SchemaObject

      expect(shouldDisplayHeading(schema)).toBe(true)
    })

    it('returns true when schema has contentMediaType', () => {
      const schema = {
        contentMediaType: 'application/json',
      } as SchemaObject

      expect(shouldDisplayHeading(schema)).toBe(true)
    })

    it('returns true when schema has min/max properties constraints', () => {
      const schema = {
        minProperties: 1,
        maxProperties: 5,
      } as SchemaObject

      expect(shouldDisplayHeading(schema)).toBe(true)
    })

    it('returns true when schema has xml name', () => {
      const schema = {
        xml: {
          name: 'XmlTag',
        },
      } as SchemaObject

      expect(shouldDisplayHeading(schema)).toBe(true)
    })
  })
})
