export type UseClipboardOptions = {
  /**
   * A function that will be called when the text is copied to the clipboard
   */
  notify?: (message: string) => void
  /**
   * Optional locale-based notifier: called with 'copied' or 'failed' and should return a localized message
   */
  localeNotify?: (type: 'copied' | 'failed') => string
}
