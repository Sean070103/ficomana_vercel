'use client'

import { useCallback, useEffect, useState } from 'react'
import { Check, HardDrive, Loader2 } from 'lucide-react'
import { adminBtnPrimary, adminCard } from '@/lib/admin-ui'
import { EMAIL_STORAGE_SUB, getEmailStoragePeriod } from '@/lib/ops-subscriptions'
import { getOpsSubscriptionStatus, markOpsSubscriptionPaid } from '@/lib/data-store'
import { useOnAdminDbSync } from '@/components/admin-auto-sync'

/** Staff ops notes shown across admin — billing / infra reminders. */
export default function AdminOpsNotes() {
  const period = getEmailStoragePeriod()
  const [isPaid, setIsPaid] = useState(false)
  const [loading, setLoading] = useState(true)
  const [markingPaid, setMarkingPaid] = useState(false)

  const endLabel = period.periodEnd.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const refreshStatus = useCallback(async () => {
    const status = await getOpsSubscriptionStatus()
    if (status) setIsPaid(status.isPaid)
    setLoading(false)
  }, [])

  useEffect(() => {
    void refreshStatus()
  }, [refreshStatus])

  useOnAdminDbSync(() => {
    void refreshStatus()
  })

  const handleMarkPaid = async () => {
    setMarkingPaid(true)
    try {
      const ok = await markOpsSubscriptionPaid()
      if (ok) setIsPaid(true)
    } finally {
      setMarkingPaid(false)
    }
  }

  const warn = period.shouldNotify && !isPaid
  const urgent = warn && period.daysLeft <= 3

  return (
    <div
      className={`${adminCard} p-4 flex gap-3 items-start ${
        isPaid
          ? 'border-emerald-500/25 bg-emerald-500/[0.06]'
          : urgent
            ? 'border-red-500/30 bg-red-500/[0.08]'
            : warn
              ? 'border-amber-500/25 bg-amber-500/[0.07]'
              : 'border-amber-500/20 bg-amber-500/[0.05]'
      }`}
      role="note"
    >
      <div
        className={`rounded-lg border p-2 shrink-0 ${
          isPaid
            ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
            : urgent
              ? 'border-red-500/30 bg-red-500/15 text-red-300'
              : 'border-amber-500/30 bg-amber-500/15 text-amber-300'
        }`}
      >
        {isPaid ? <Check className="w-4 h-4" /> : <HardDrive className="w-4 h-4" />}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p
              className={`text-[10px] font-bold tracking-widest uppercase ${
                isPaid ? 'text-emerald-300/90' : urgent ? 'text-red-300/90' : 'text-amber-300/90'
              }`}
            >
              Ops note
              {isPaid ? ' · paid' : warn ? ' · renewal soon' : ''}
            </p>
            <p className="text-sm font-semibold text-white">{EMAIL_STORAGE_SUB.label}</p>
          </div>
          {!loading && !isPaid && (
            <button
              type="button"
              onClick={() => void handleMarkPaid()}
              disabled={markingPaid}
              className={`${adminBtnPrimary} shrink-0 px-4 py-2 inline-flex items-center gap-1.5`}
            >
              {markingPaid ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                'Mark paid'
              )}
            </button>
          )}
          {!loading && isPaid && (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 shrink-0">
              <Check className="w-3.5 h-3.5" />
              Paid
            </span>
          )}
        </div>
        <p className="text-[12px] text-white/65 leading-relaxed">
          {isPaid ? (
            <>
              This period is marked <strong className="text-emerald-300">paid</strong> through{' '}
              <strong className="text-white/85">{endLabel}</strong>. Renewal reminders are paused until the next billing
              cycle.
            </>
          ) : (
            <>
              Availed on <strong className="text-white/85">July 17, 2026</strong>. Current period ends{' '}
              <strong className="text-white/85">{endLabel}</strong>
              {period.daysLeft >= 0 ? (
                <>
                  {' '}
                  (<strong className="text-white/85">{period.daysLeft} day{period.daysLeft === 1 ? '' : 's'}</strong>{' '}
                  left).
                </>
              ) : (
                <>
                  {' '}
                  — <strong className="text-red-300">past due / renew now</strong>.
                </>
              )}{' '}
              Staff get a notification in the bell menu starting{' '}
              <strong className="text-white/85">{EMAIL_STORAGE_SUB.warnDaysBefore} days</strong> before renewal.
            </>
          )}
        </p>
        {!isPaid && warn && (
          <p className="text-[11px] text-white/45">
            After payment, click <strong className="text-white/65">Mark paid</strong> to clear this cycle&apos;s reminder.
          </p>
        )}
      </div>
    </div>
  )
}
