import { describe, expect, it } from 'vitest'

import {
  getOperationScopes,
  getOperationThrottlingInfo,
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

  it('returns the correct title key for time based limits', () => {
    expect(getRateLimitTitleKey('time')).toBe('apiReference.operationMeta.timeBasedRateLimit')
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
