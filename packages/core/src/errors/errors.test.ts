import assert from 'node:assert/strict'
import { test } from 'node:test'

import { noopErrorReporter } from './index.js'
import type { ErrorReporter, ErrorReportContext } from './index.js'

test('noopErrorReporter drops the exception and never throws', () => {
  assert.doesNotThrow(() => {
    noopErrorReporter.captureException(new Error('boom'))
    noopErrorReporter.captureException('a string reason', { severity: 'fatal' })
  })
})

test('a real reporter receives the error and context', () => {
  const seen: Array<{ error: unknown; context?: ErrorReportContext }> = []
  const reporter: ErrorReporter = {
    captureException(error, context) {
      seen.push({ error, context })
    },
  }

  const err = new Error('kaboom')
  reporter.captureException(err, {
    severity: 'error',
    tags: { surface: 'rpc', action: 'create' },
    extra: { requestId: 'abc' },
  })

  assert.equal(seen.length, 1)
  assert.equal(seen[0]!.error, err)
  assert.deepEqual(seen[0]!.context, {
    severity: 'error',
    tags: { surface: 'rpc', action: 'create' },
    extra: { requestId: 'abc' },
  })
})
