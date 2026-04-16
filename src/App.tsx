import { useEffect } from 'react'

function App() {
  // Preserve original IntersectionObserver fade-in for visual parity.
  // Will be replaced by motion's whileInView in Phase 3a.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('show')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08 }
    )
    document.querySelectorAll('.fade').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="w">
      <nav>
        <div className="logo">Kyren</div>
        <div className="nav-links">
          <a href="https://github.com/masatonaut" target="_blank" rel="noopener">GitHub</a>
          <a href="https://x.com/masatobuilds" target="_blank" rel="noopener">X</a>
          <a href="mailto:hey@kyren.app">Contact</a>
        </div>
      </nav>

      <section className="hero fade">
        <div>
          <h1>A small studio building focused tools for everyday life.</h1>
          <p>Each product solves one problem well. Nothing more, nothing less. Built in Tokyo with care.</p>
        </div>
        <div className="hero-metrics">
          <div><div className="mv">4</div><div className="ml">Products</div></div>
          <div><div className="mv">3</div><div className="ml">Live</div></div>
          <div><div className="mv">1</div><div className="ml">Engineer</div></div>
        </div>
      </section>

      <section className="sec">
        <div className="sh fade">Products</div>
        <div className="pgrid">
          <a href="https://kashite.kyren.app" className="card fade" target="_blank" rel="noopener">
            <div className="ct"><div className="ci" style={{ background: '#E85D3A' }}>K</div><span className="badge bl"><span className="bd"></span>Live</span></div>
            <div className="cn">KASHITE</div>
            <div className="cd">Track who borrowed what. Get it back.</div>
            <div className="cs"><span className="tech">Next.js</span><span className="tech">Supabase</span><span className="tech">Stripe</span></div>
            <div className="cta">Try it <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" /></svg></div>
          </a>
          <a href="https://yomu.kyren.app" className="card fade" target="_blank" rel="noopener">
            <div className="ct"><div className="ci" style={{ background: '#5B8DEF' }}>Y</div><span className="badge bl"><span className="bd"></span>Live</span></div>
            <div className="cn">YOMU</div>
            <div className="cd">AI reading assistant. Upload, ask, learn.</div>
            <div className="cs"><span className="tech">Next.js</span><span className="tech">Supabase</span><span className="tech">Claude API</span></div>
            <div className="cta">Try it <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" /></svg></div>
          </a>
          <a href="https://phrasely.kyren.app" className="card fade" target="_blank" rel="noopener">
            <div className="ct"><div className="ci" style={{ background: '#4CAF82' }}>P</div><span className="badge bl"><span className="bd"></span>Live</span></div>
            <div className="cn">Phrasely</div>
            <div className="cd">Write better English. Learn why it works.</div>
            <div className="cs"><span className="tech">Next.js</span><span className="tech">Supabase</span><span className="tech">Claude API</span></div>
            <div className="cta">Try it <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" /></svg></div>
          </a>
          <div className="card fade">
            <div className="ct"><div className="ci" style={{ background: '#D4A853' }}>S</div><span className="badge bb"><span className="bd"></span>Building</span></div>
            <div className="cn">SABAKU</div>
            <div className="cd">ATC-inspired task management. Visual, spatial.</div>
            <div className="cs"><span className="tech">Next.js</span><span className="tech">Supabase</span><span className="tech">DnD Kit</span></div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ borderTop: '1px solid var(--b)' }}>
        <div className="about-grid fade">
          <div>
            <h2>One engineer, building from Tokyo.</h2>
            <p>Kyren follows Kanso — the Japanese principle of simplicity. Strip away the unnecessary. Every tool does one thing well.</p>
            <p>No investor decks. No feature bloat. Just tools that solve real problems.</p>
            <div className="slinks">
              <a href="https://github.com/masatonaut" className="sl" target="_blank" rel="noopener"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>GitHub</a>
              <a href="https://x.com/masatobuilds" className="sl" target="_blank" rel="noopener"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" /></svg>X</a>
              <a href="https://masatonaut.dev" className="sl" target="_blank" rel="noopener"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6.5" /><path d="M1.5 8h13M8 1.5c-1.5 2-2.5 4-2.5 6.5s1 4.5 2.5 6.5c1.5-2 2.5-4 2.5-6.5s-1-4.5-2.5-6.5" /></svg>Portfolio</a>
            </div>
          </div>
          <div className="stack-col">
            <div><div className="scl">Frontend</div><div className="sci"><span className="st">Next.js</span><span className="st">React</span><span className="st">TypeScript</span><span className="st">Tailwind</span></div></div>
            <div><div className="scl">Backend</div><div className="sci"><span className="st">Supabase</span><span className="st">PostgreSQL</span><span className="st">Stripe</span></div></div>
          </div>
          <div className="stack-col">
            <div><div className="scl">AI</div><div className="sci"><span className="st">Claude API</span><span className="st">RAG</span></div></div>
            <div><div className="scl">Infra</div><div className="sci"><span className="st">Vercel</span><span className="st">GitHub Actions</span></div></div>
          </div>
        </div>
      </section>

      <footer>
        <div className="fr">
          <div className="ft">Built with <span>Next.js + Supabase</span>. Designed in Tokyo.</div>
          <div className="fl">
            <a href="https://github.com/masatonaut" target="_blank" rel="noopener">GitHub</a>
            <a href="https://x.com/masatobuilds" target="_blank" rel="noopener">X</a>
            <a href="mailto:hey@kyren.app">Contact</a>
          </div>
        </div>
        <div className="fb">
          <span className="fc">&copy; 2026 Kyren</span>
          <div className="fl">
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
            <a href="/tokushoho">Tokushoho</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
