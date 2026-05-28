export type OperationThrottlingInfo = {
  type?: string
  numberOfRequests?: number
  numberOfTimeUnits?: number
  timeUnit?: string
  replenishRate?: number
  requestedTokens?: number
  burstCapacity?: number
}

export type OperationVersionInfo = {
  versionNumber?: number | string
  latest?: boolean
  operationId?: string
}

export type OperationVersionBadge = {
  label: string
  latest: boolean
}

export type OperationRateLimitTimeUnitKey =
  | 'apiReference.operationMeta.timeUnits.second'
  | 'apiReference.operationMeta.timeUnits.seconds'
  | 'apiReference.operationMeta.timeUnits.minute'
  | 'apiReference.operationMeta.timeUnits.minutes'
  | 'apiReference.operationMeta.timeUnits.hour'
  | 'apiReference.operationMeta.timeUnits.hours'
  | 'apiReference.operationMeta.timeUnits.day'
  | 'apiReference.operationMeta.timeUnits.days'

export type OperationRateLimitTitleKey =
  | 'apiReference.operationMeta.requestRateLimit'
  | 'apiReference.operationMeta.timeBasedRateLimit'
  | 'apiReference.operationMeta.tokenBasedRateLimit'

type OperationMetadataExtensions = {
  operationId?: unknown
  'x-scopes'?: unknown
  'x-throttling-info'?: unknown
  'x-versions'?: unknown
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const asOperationMetadataExtensions = (value: unknown): OperationMetadataExtensions => (isRecord(value) ? value : {})

export const getOperationScopes = (operation: unknown): string[] => {
  const metadata = asOperationMetadataExtensions(operation)

  if (!Array.isArray(metadata['x-scopes'])) {
    return []
  }

  return metadata['x-scopes'].filter((scope): scope is string => typeof scope === 'string' && scope.trim().length > 0)
}

export const getOperationThrottlingInfo = (operation: unknown): OperationThrottlingInfo[] => {
  const metadata = asOperationMetadataExtensions(operation)

  if (!Array.isArray(metadata['x-throttling-info'])) {
    return []
  }

  return metadata['x-throttling-info'].filter((item): item is OperationThrottlingInfo => isRecord(item))
}

export const getOperationVersionBadges = (operation: unknown): OperationVersionBadge[] => {
  const metadata = asOperationMetadataExtensions(operation)
  const currentOperationId =
    typeof metadata.operationId === 'string' && metadata.operationId.trim().length > 0 ? metadata.operationId : null

  if (!currentOperationId || !Array.isArray(metadata['x-versions'])) {
    return []
  }

  return metadata['x-versions']
    .filter((item): item is OperationVersionInfo => isRecord(item))
    .filter((item) => item.operationId === currentOperationId)
    .map((item) => {
      const version = item.versionNumber

      if (typeof version !== 'number' && typeof version !== 'string') {
        return null
      }

      const normalizedVersion = String(version).trim()

      if (!normalizedVersion.length) {
        return null
      }

      return {
        label: `v${normalizedVersion}`,
        latest: item.latest === true,
      }
    })
    .filter((item): item is OperationVersionBadge => item !== null)
}

export const getRateLimitTitleKey = (type: string | undefined): OperationRateLimitTitleKey => {
  if (type === 'time') return 'apiReference.operationMeta.timeBasedRateLimit'
  if (type === 'token') return 'apiReference.operationMeta.tokenBasedRateLimit'
  return 'apiReference.operationMeta.requestRateLimit'
}

export const getRateLimitTimeUnitKey = (
  timeUnit: string | undefined,
  numberOfTimeUnits: number,
): OperationRateLimitTimeUnitKey => {
  const isPlural = numberOfTimeUnits > 1

  if (timeUnit === 's') {
    return isPlural ? 'apiReference.operationMeta.timeUnits.seconds' : 'apiReference.operationMeta.timeUnits.second'
  }

  if (timeUnit === 'h') {
    return isPlural ? 'apiReference.operationMeta.timeUnits.hours' : 'apiReference.operationMeta.timeUnits.hour'
  }

  if (timeUnit === 'd') {
    return isPlural ? 'apiReference.operationMeta.timeUnits.days' : 'apiReference.operationMeta.timeUnits.day'
  }

  return isPlural ? 'apiReference.operationMeta.timeUnits.minutes' : 'apiReference.operationMeta.timeUnits.minute'
}

export const getRateLimitPeriodValue = (
  rateLimit: OperationThrottlingInfo,
): {
  amount: number | null
  unitKey: OperationRateLimitTimeUnitKey
} => {
  const numberOfTimeUnits = rateLimit.numberOfTimeUnits ?? 0

  return {
    amount: numberOfTimeUnits > 1 ? numberOfTimeUnits : null,
    unitKey: getRateLimitTimeUnitKey(rateLimit.timeUnit, numberOfTimeUnits),
  }
}
