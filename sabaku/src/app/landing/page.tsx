import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Focus, Layers, Keyboard, Code2, Link2, Zap } from 'lucide-react'

const Github = Code2

export const metadata: Metadata = {
  title: 'SABAKU — Flight Strip Task Management',
  description: 'One task at a time. Keyboard-first. Obsidian-native. For deep work.',
  openGraph: {
    title: 'SABAKU — Flight Strip Task Management',
    description: 'One task at a time. Keyboard-first. Obsidian-native. For deep work.',
    url: 'https://sabaku.kyren.app/landing',
    siteName: 'SABAKU',
    type: 'website',
  },
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <Link href="/landing" className="text-[18px] font-bold tracking-tight">
          SABAKU
        </Link>
        <div className="flex items-center gap-6 text-[13px]">
          <a href="#features" className="text-text-secondary hover:text-text-primary transition-colors">Features</a>
          <a href="#pricing" className="text-text-secondary hover:text-text-primary transition-colors">Pricing</a>
          <a
            href="https://github.com/masatonaut/kyren-app/tree/main/sabaku"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
          >
            <Github size={14} />
            GitHub
          </a>
          <Link
            href="/"
            className="px-3 py-1.5 text-[13px] bg-accent text-white rounded hover:bg-accent-hover transition-colors"
          >
            Try demo
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[11px] font-mono uppercase tracking-wider text-accent border border-accent/30 rounded-full">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          v0.2 · Early access
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-5">
          Stop multitasking.
          <br />
          <span className="text-accent">Start shipping.</span>
        </h1>

        <p className="text-lg text-text-secondary max-w-xl mx-auto mb-8 leading-relaxed">
          Flight strip task management. One active task. One timer. Zero distraction.
          Built for people who need to think.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-[14px] font-medium rounded hover:bg-accent-hover transition-colors"
          >
            Try the demo
            <ArrowRight size={16} />
          </Link>
          <a
            href="https://github.com/masatonaut/kyren-app/tree/main/sabaku"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 border border-border text-[14px] text-text-secondary hover:text-text-primary rounded transition-colors"
          >
            <Github size={16} />
            Star on GitHub
          </a>
        </div>

        <p className="mt-6 text-[12px] text-text-tertiary">
          No signup required · Works offline · Your data stays local
        </p>
      </section>

      {/* Preview */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-bg-secondary border border-border rounded-lg p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-priority-urg/60" />
            <div className="w-3 h-3 rounded-full bg-timer-active/60" />
            <div className="w-3 h-3 rounded-full bg-priority-nrm/60" />
            <span className="ml-3 text-[11px] text-text-tertiary font-mono">sabaku.kyren.app</span>
          </div>
          <div className="grid grid-cols-3 gap-3 font-mono text-[11px]">
            <StripPreviewCol title="ACTIVE" accent>
              <PreviewStrip id="FS-0042" priority="URG" title="KASHITE Resend API" timer="23:45" active />
            </StripPreviewCol>
            <StripPreviewCol title="QUEUE">
              <PreviewStrip id="FS-0043" priority="URG" title="Upwork proposal" />
              <PreviewStrip id="FS-0044" priority="NRM" title="Phrasely deploy" />
              <PreviewStrip id="FS-0045" priority="LOW" title="note draft" />
            </StripPreviewCol>
            <StripPreviewCol title="CLEARED">
              <PreviewStrip id="FS-0041" priority="NRM" title="OG image" cleared />
              <PreviewStrip id="FS-0040" priority="URG" title="Deploy check" cleared />
            </StripPreviewCol>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-20 border-t border-border">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          Why SABAKU works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Feature
            icon={Focus}
            title="One task at a time"
            body="Focus mode shows one active strip with a timer. No distractions, no multitasking. Like an air traffic controller handling one plane."
          />
          <Feature
            icon={Keyboard}
            title="Keyboard-first"
            body="n for new, s to start timer, d for done, q to queue back. Power users never touch the mouse."
          />
          <Feature
            icon={Link2}
            title="Obsidian-native"
            body="Auto-generate strips from your daily notes, Top 3, and TODO checkboxes. Zero input cost when you already write in Obsidian."
          />
          <Feature
            icon={Layers}
            title="Project grouping"
            body="Hashtags and file paths auto-assign projects. Filter the board by one project when you need to focus."
          />
          <Feature
            icon={Zap}
            title="Time tracking included"
            body="Every strip has a built-in timer that survives inactive tabs. See where your hours actually go per project."
          />
          <Feature
            icon={Github}
            title="Open source"
            body="Your data never leaves your browser by default. CLI tools and sync engine are MIT-licensed. Audit the code yourself."
          />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20 border-t border-border">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-3">
          Pricing
        </h2>
        <p className="text-center text-text-secondary mb-12">
          Free forever for solo use. Pay only when you need cross-device sync.
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          <PriceCard
            name="Hobby"
            price="$0"
            period="forever"
            features={[
              'Unlimited local strips',
              'Kanban + Focus views',
              'Keyboard shortcuts',
              'Timer + project grouping',
              'Export to JSON',
            ]}
            cta="Get started"
            ctaHref="/"
          />
          <PriceCard
            name="Pro"
            price="$8"
            period="/month"
            highlight
            features={[
              'Everything in Hobby',
              'Cross-device sync (Supabase)',
              'Obsidian Vault auto-sync (CLI)',
              'Unlimited history',
              'Project analytics',
              'Priority support',
            ]}
            cta="Join waitlist"
            ctaHref="https://github.com/masatonaut/kyren-app/tree/main/sabaku"
          />
          <PriceCard
            name="Lifetime"
            price="$49"
            period="one-time"
            features={[
              'Everything in Pro',
              'Pay once, use forever',
              'First 100 users only',
              'Gumroad fulfillment',
              'Early access to features',
            ]}
            cta="Notify me"
            ctaHref="https://github.com/masatonaut/kyren-app/tree/main/sabaku"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-10 border-t border-border text-[12px] text-text-tertiary">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p>
            Built by{' '}
            <a href="https://github.com/masatonaut" className="text-text-secondary hover:text-text-primary transition-colors">
              @masatonaut
            </a>
            {' · '}
            Part of the{' '}
            <span className="text-text-secondary">Kyren</span> product suite (KASHITE, YOMU, Phrasely, SABAKU).
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-text-secondary transition-colors">Demo</Link>
            <a href="https://github.com/masatonaut/kyren-app" target="_blank" rel="noopener noreferrer" className="hover:text-text-secondary transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Feature({ icon: Icon, title, body }: { icon: React.ElementType; title: string; body: string }) {
  return (
    <div className="p-5 border border-border rounded bg-bg-secondary">
      <div className="w-10 h-10 flex items-center justify-center bg-accent/10 text-accent rounded mb-3">
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <h3 className="text-[15px] font-medium mb-2">{title}</h3>
      <p className="text-[13px] text-text-secondary leading-relaxed">{body}</p>
    </div>
  )
}

function PriceCard({
  name, price, period, features, cta, ctaHref, highlight,
}: {
  name: string
  price: string
  period: string
  features: string[]
  cta: string
  ctaHref: string
  highlight?: boolean
}) {
  return (
    <div className={`p-6 border rounded bg-bg-secondary ${highlight ? 'border-accent' : 'border-border'}`}>
      {highlight && (
        <div className="inline-block px-2 py-0.5 mb-3 text-[10px] font-mono uppercase tracking-wider text-accent border border-accent/30 rounded">
          Recommended
        </div>
      )}
      <h3 className="text-[15px] font-medium mb-1">{name}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-[12px] text-text-tertiary">{period}</span>
      </div>
      <ul className="space-y-2 mb-6 text-[13px] text-text-secondary">
        {features.map(f => <li key={f}>· {f}</li>)}
      </ul>
      <Link
        href={ctaHref}
        className={`block text-center px-4 py-2 text-[13px] font-medium rounded transition-colors ${highlight ? 'bg-accent text-white hover:bg-accent-hover' : 'border border-border text-text-secondary hover:text-text-primary'}`}
      >
        {cta}
      </Link>
    </div>
  )
}

function StripPreviewCol({ title, accent, children }: { title: string; accent?: boolean; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded bg-bg-primary min-h-[140px]">
      <div className="px-3 py-2 border-b border-border">
        <span className={`text-[11px] font-medium tracking-wide ${accent ? 'text-accent' : 'text-text-secondary'}`}>
          {title}
        </span>
      </div>
      <div className="p-2 space-y-1">{children}</div>
    </div>
  )
}

function PreviewStrip({ id, priority, title, timer, active, cleared }: {
  id: string
  priority: 'URG' | 'NRM' | 'LOW'
  title: string
  timer?: string
  active?: boolean
  cleared?: boolean
}) {
  const prClass = priority === 'URG' ? 'bg-priority-urg/20 text-red-400'
    : priority === 'NRM' ? 'bg-priority-nrm/20 text-green-400'
    : 'bg-priority-low/20 text-neutral-400'
  return (
    <div className={`px-2 py-1.5 border border-border ${active ? 'border-l-accent border-l-2 bg-bg-tertiary' : ''} ${cleared ? 'opacity-50 line-through' : ''}`}>
      <div className="flex items-center gap-1.5">
        <span className="text-text-tertiary">{id}</span>
        <span className={`px-1 ${prClass}`}>{priority}</span>
        <span className="text-text-primary truncate flex-1 text-[10px]">{title}</span>
        {timer && <span className="text-timer-active">{timer}</span>}
      </div>
    </div>
  )
}
