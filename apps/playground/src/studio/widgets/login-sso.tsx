/**
 * Example widget — injected into the pre-auth login screen.
 *
 * `login.*` zones render on the sign-in page (outside the Studio shell), so a
 * widget here needs no session. This one adds a divider + an SSO button below
 * the sign-in button via `login.form.after`; `login.aside`, `login.header`,
 * `login.form.before`, and `login.footer` are the other login zones.
 */

import { defineWidgetConfig, type WidgetContext } from '@kon10/start'
import { Button } from '@kon10/ui'
import { KeyRound } from 'lucide-react'

export const config = defineWidgetConfig({ zone: 'login.form.after' })

export default function LoginSso(_props: WidgetContext) {
  return (
    <>
      <div className="flex items-center gap-inline text-caption text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => alert('Demo only — wire this to your SSO provider.')}
      >
        <KeyRound />
        Continue with SSO
      </Button>
    </>
  )
}
