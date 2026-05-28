import { describe, expect, it } from 'vitest'

import {
  getOperationScopes,
  getOperationThrottlingInfo,
  getOperationVersionBadges,
  getRateLimitPeriodValue,
  getRateLimitTimeUnitKey,
  getRateLimitTitleKey,
} from './operation-metadata'

describe('operation-metadata', () => {
  it('returns string scopes only', () => {
    const scopes = getOperationScopes({
      'x-scopes': ['users:read', '', 123, 'users:write'],
    })

    expect(scopes).toStrictEqual(['users:read', 'users:write'])
  })

  it('returns throttling entries from x-throttling-info', () => {
    const throttlingInfo = getOperationThrottlingInfo({
      'x-throttling-info': [
        {
          type: 'time',
          numberOfRequests: 120,
          numberOfTimeUnits: 0,
          timeUnit: 'm',
        },
      ],
    })

    expect(throttlingInfo).toStrictEqual([
      {
        type: 'time',
        numberOfRequests: 120,
        numberOfTimeUnits: 0,
        timeUnit: 'm',
      },
    ])
  })

  it('returns the matching version badge from x-versions', () => {
    const versionBadges = getOperationVersionBadges({
      operationId: 'get-outbound-sms-message-logs-v3',
      'x-versions': [
        {
          versionNumber: 3,
          latest: true,
          operationId: 'get-outbound-sms-message-logs-v3',
        },
        {
          versionNumber: '1',
          latest: false,
          operationId: 'get-outbound-sms-message-logs',
        },
      ],
    })

    expect(versionBadges).toStrictEqual([
      {
        label: 'v3',
        latest: true,
      },
    ])
  })

  it('returns the non-latest badge when the current operationId matches an older version', () => {
    const versionBadges = getOperationVersionBadges({
      operationId: 'get-outbound-sms-message-logs',
      'x-versions': [
        {
          versionNumber: 3,
          latest: true,
          operationId: 'get-outbound-sms-message-logs-v3',
        },
        {
          versionNumber: 1,
          latest: false,
          operationId: 'get-outbound-sms-message-logs',
        },
      ],
    })

    expect(versionBadges).toStrictEqual([
      {
        label: 'v1',
        latest: false,
      },
    ])
  })

  it('filters invalid x-versions entries', () => {
    const versionBadges = getOperationVersionBadges({
      operationId: 'get-outbound-sms-message-logs-v3',
      'x-versions': [
        {
          versionNumber: '',
          operationId: 'get-outbound-sms-message-logs-v3',
        },
        {
          latest: true,
          operationId: 'get-outbound-sms-message-logs-v3',
        },
        'v3',
      ],
    })

    expect(versionBadges).toStrictEqual([])
  })

  it('returns no badge when the current operationId does not match any x-versions entry', () => {
    const versionBadges = getOperationVersionBadges({
      operationId: 'missing-operation-id',
      'x-versions': [
        {
          versionNumber: 3,
          latest: true,
          operationId: 'get-outbound-sms-message-logs-v3',
        },
      ],
    })

    expect(versionBadges).toStrictEqual([])
  })

  it('returns the correct title key for time based limits', () => {
    expect(getRateLimitTitleKey('time')).toBe('apiReference.operationMeta.timeBasedRateLimit')
  })

  it('returns the correct title key for token based limits', () => {
    expect(getRateLimitTitleKey('token')).toBe('apiReference.operationMeta.tokenBasedRateLimit')
  })

  it('returns the generic title key for unknown limit types', () => {
    expect(getRateLimitTitleKey('burst')).toBe('apiReference.operationMeta.requestRateLimit')
  })

  it('uses a singular minute key when time units are omitted', () => {
    expect(getRateLimitTimeUnitKey('m', 0)).toBe('apiReference.operationMeta.timeUnits.minute')
  })

  it('uses a plural minute key when time units are greater than one', () => {
    expect(getRateLimitTimeUnitKey('m', 10)).toBe('apiReference.operationMeta.timeUnits.minutes')
  })

  it('returns a period payload without an amount for single-unit limits', () => {
    expect(
      getRateLimitPeriodValue({
        numberOfTimeUnits: 0,
        timeUnit: 'm',
      }),
    ).toStrictEqual({
      amount: null,
      unitKey: 'apiReference.operationMeta.timeUnits.minute',
    })
  })

  it('returns a period payload with an amount for multi-unit limits', () => {
    expect(
      getRateLimitPeriodValue({
        numberOfTimeUnits: 10,
        timeUnit: 'm',
      }),
    ).toStrictEqual({
      amount: 10,
      unitKey: 'apiReference.operationMeta.timeUnits.minutes',
    })
  })
})
