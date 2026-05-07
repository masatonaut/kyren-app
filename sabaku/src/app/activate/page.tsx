import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Award } from 'lucide-react'
import ActivateForm from './ActivateForm'

export const metadata: Metadata = {
  title: 'Activate Lifetime License — SABAKU',
  description: 'Activate your SABAKU Lifetime license purchased on Gumroad.',
}

export default function ActivatePage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center px-4">
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-1 text-[13px] text-text-tertiary hover:text-text-secondary">
        <ArrowLeft size={14} />
        Back
      </Link>

      <div className="w-full max-w-sm">
        <div className="w-12 h-12 flex items-center justify-center bg-accent/10 text-accent rounded-full mb-4 mx-auto">
          <Award size={24} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-center mb-2">Activate Lifetime</h1>
        <p className="text-[13px] text-text-secondary text-center mb-8">
          Enter your license key from Gumroad to unlock Pro features forever.
        </p>

        <ActivateForm />

        <p className="mt-8 text-[12px] text-text-tertiary text-center">
          Don't have a license yet?{' '}
          <Link href="/pricing" className="text-accent hover:underline">View pricing</Link>
        </p>
      </div>
    </div>
  )
}
