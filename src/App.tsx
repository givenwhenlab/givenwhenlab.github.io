import { useEffect, useMemo, useRef, useState } from 'react'
import lab from './content/lab.json'
import publications from './content/publications.json'
import projects from './content/projects.json'

type DemoStep = 'idle' | 'running-1' | 'running-2' | 'running-3' | 'passed'
type Language = 'en' | 'pt'
type Theme = 'dark' | 'light'

const githubUrl = 'https://github.com/givenwhenlab'
const publication = publications[0]

const copy = {
  en: {
    nav: ['Research', 'Projects', 'About', 'Agents', 'MCP'],
    github: 'GitHub', human: 'Human', agent: 'Agent', demo: 'Illustrative demo',
    ready: 'Ready to illustrate', running: 'Running…', run: 'Run example', again: 'Run again',
    relevant: 'Relevant work', published: 'Published work · Dataset paper',
    researchDescription: 'GivenWhenThen is a dataset of complete BDD test scenarios mined from real-world open source projects. Each entry connects the human-readable feature file to its step definitions and associated system code, making the dataset useful for empirical studies and tools for automated testing.',
    readPaper: 'Read the paper', dataset: 'Explore the dataset', copy: 'Copy citation', copied: 'Copied citation',
    artifacts: 'Projects & artifacts',
    projectsTitle: <>Research, artifacts,<br /><em>and experiments.</em></>,
    projectsDescription: 'A growing shelf of work from the lab. Only confirmed resources are listed here; the paper is one part of a broader open-source scope.',
    open: 'Open resource', about: 'About the lab',
    aboutTitle: <>Readable specifications<br />for <em>reliable software.</em></>,
    aboutText: 'GivenWhenLab is an open-source initiative connecting research and practice in Behavior-Driven Development. We study how teams describe behavior, automate its verification, and build better evidence for software engineering.',
    aboutText2: 'Our scope spans legible specifications, test automation, datasets and empirical studies, developer tools, and experiments with AI applied to software testing.',
    repository: 'Explore the organization', footer: 'Researching better ways to describe and verify behavior.',
    focus: ['Gherkin as shared language', 'Evidence over hype', 'Open artifacts', 'Research into practice'],
  },
  pt: {
    nav: ['Pesquisa', 'Projetos', 'Sobre', 'Agentes', 'MCP'],
    github: 'GitHub', human: 'Humano', agent: 'Agente', demo: 'Demonstração ilustrativa',
    ready: 'Pronto para ilustrar', running: 'Executando…', run: 'Executar exemplo', again: 'Executar novamente',
    relevant: 'Trabalhos relevantes', published: 'Trabalho publicado · Artigo de dataset',
    researchDescription: 'GivenWhenThen é um dataset de cenários completos de testes BDD minerados de projetos open source reais. Cada entrada conecta o arquivo de features legível por humanos às definições de passos e ao código de sistema associado, apoiando estudos empíricos e ferramentas de testes automatizados.',
    readPaper: 'Ler o artigo', dataset: 'Explorar o dataset', copy: 'Copiar citação', copied: 'Citação copiada',
    artifacts: 'Projetos e artefatos',
    projectsTitle: <>Pesquisa, artefatos,<br /><em>e experimentos.</em></>,
    projectsDescription: 'Uma coleção crescente de trabalhos do laboratório. Apenas recursos confirmados são listados; o artigo é uma parte de um escopo open source mais amplo.',
    open: 'Abrir recurso', about: 'Sobre o laboratório',
    aboutTitle: <>Especificações legíveis<br />para software <em>confiável.</em></>,
    aboutText: 'GivenWhenLab é uma iniciativa open source que conecta pesquisa e prática em Behavior-Driven Development. Estudamos como equipes descrevem comportamentos, automatizam sua verificação e constroem evidências melhores para a engenharia de software.',
    aboutText2: 'Nosso escopo inclui especificações legíveis, automação de testes, datasets e estudos empíricos, ferramentas para desenvolvedores e experimentos com IA aplicada a testes de software.',
    repository: 'Explorar a organização', footer: 'Pesquisando formas melhores de descrever e verificar comportamentos.',
    focus: ['Gherkin como linguagem comum', 'Evidência antes do hype', 'Artefatos abertos', 'Pesquisa na prática'],
  },
} as const

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`brand ${compact ? 'brand-compact' : ''}`} href="/" aria-label="GivenWhenLab home">
      <img src="/logo-mark.png" alt="" />
      <span>GivenWhenLab</span>
    </a>
  )
}

function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    if (reducedMotion || !finePointer || !cursorRef.current) return

    const cursor = cursorRef.current
    document.body.classList.add('cursor-enhanced')
    const move = (event: PointerEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      cursor.classList.add('visible')
      cursor.classList.toggle('interactive', Boolean((event.target as Element).closest('a, button')))
    }
    const leave = () => cursor.classList.remove('visible')
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerleave', leave)
    return () => {
      document.body.classList.remove('cursor-enhanced')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerleave', leave)
    }
  }, [])

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />
}

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

function Header({ agentMode, onAgentMode, language, onLanguage, theme, onTheme }: { agentMode: boolean; onAgentMode: () => void; language: Language; onLanguage: () => void; theme: Theme; onTheme: () => void }) {
  const text = copy[language]
  return (
    <header className="site-header">
      <Logo />
      <nav aria-label="Primary navigation">
        <a href="/#research">{text.nav[0]}</a>
        <a href="/#projects">{text.nav[1]}</a>
        <a href="/#about">{text.nav[2]}</a>
        <a href="/agents/">{text.nav[3]}</a>
        <a href="/mcp/">{text.nav[4]}</a>
      </nav>
      <div className="header-actions">
        <button className={`mode-switch ${agentMode ? 'active' : ''}`} onClick={onAgentMode} type="button">
          <span>{agentMode ? text.agent : text.human}</span>
          <span className="mode-dot" aria-hidden="true" />
        </button>
        <button className="language-switch" type="button" onClick={onLanguage} aria-label="Change language">{language === 'en' ? 'PT-BR' : 'EN'}</button>
        <button className="theme-switch" type="button" onClick={onTheme} aria-label="Change color theme">{theme === 'dark' ? '☼' : '☾'}</button>
        <a className="github-link" href={githubUrl} target="_blank" rel="noreferrer">{text.github} <Arrow /></a>
      </div>
    </header>
  )
}

export function ScenarioDemo({ language }: { language: Language }) {
  const text = copy[language]
  const [step, setStep] = useState<DemoStep>('idle')
  const isComplete = step === 'passed'
  const activeStep = step === 'running-1' ? 1 : step === 'running-2' ? 2 : step === 'running-3' ? 3 : 0

  useEffect(() => {
    const timer = window.setTimeout(() => setStep('running-1'), 700)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (step === 'idle' || step === 'passed') return
    const timer = window.setTimeout(() => {
      setStep(step === 'running-1' ? 'running-2' : step === 'running-2' ? 'running-3' : 'passed')
    }, 560)
    return () => window.clearTimeout(timer)
  }, [step])

  return (
    <div className="scenario-demo" aria-label="Illustrative Gherkin scenario demo">
      <div className="demo-topbar">
        <span className="traffic-lights" aria-hidden="true"><i /><i /><i /></span>
        <span className="demo-file">confidence.feature</span>
        <span className="demo-label">{text.demo}</span>
      </div>
      <div className="terminal-command">
        <span className="prompt-mark">$</span> cucumber features/confidence.feature
        {step.startsWith('running') && <span className="typing-cursor" aria-hidden="true" />}
      </div>
      <div className={`code-editor ${isComplete ? 'complete' : ''}`}>
        <div className="code-line"><span className="line-number">01</span><span className="keyword">Feature:</span> Confidence in every change</div>
        <div className="code-line gap"><span className="line-number">02</span></div>
        <div className="code-line"><span className="line-number">03</span><span className="keyword">Scenario:</span> Deliver the expected behavior</div>
        <div className={`code-line step-line ${activeStep === 1 ? 'active' : ''}`}><span className="line-number">04</span><span className="gherkin">Given</span> a shared understanding of the requirements <StepIcon state={step} index={1} /></div>
        <div className={`code-line step-line ${activeStep === 2 ? 'active' : ''}`}><span className="line-number">05</span><span className="gherkin">When</span> the behavior is verified <StepIcon state={step} index={2} /></div>
        <div className={`code-line step-line ${activeStep === 3 ? 'active' : ''}`}><span className="line-number">06</span><span className="gherkin">Then</span> the expected outcome should hold <StepIcon state={step} index={3} /></div>
        {activeStep > 0 && <div className="execution-cursor" aria-hidden="true"><span /> running step {activeStep}/3</div>}
        {isComplete && (
          <div className="execution-result" aria-label="Illustrative Cucumber-style result">
            <div><span className="result-check">✓</span> 1 scenario <b>(1 passed)</b></div>
            <div><span className="result-check">✓</span> 3 steps <b>(3 passed)</b></div>
          </div>
        )}
      </div>
      <div className="demo-footer">
        <span className={`run-summary ${isComplete ? 'complete' : ''}`}>
          {isComplete ? (language === 'en' ? '1 scenario passed · 3 steps passed' : '1 cenário aprovado · 3 passos aprovados') : text.ready}
        </span>
        {step.startsWith('running') && <span className="progress-track"><span style={{ width: `${(activeStep / 3) * 100}%` }} /></span>}
        <button className="run-button" type="button" onClick={() => setStep(step.startsWith('running') ? 'idle' : 'running-1')} disabled={step.startsWith('running')}>
          {step.startsWith('running') ? text.running : isComplete ? text.again : text.run} <span aria-hidden="true">▶</span>
        </button>
      </div>
    </div>
  )
}

function ResearchSection({ language }: { language: Language }) {
  const text = copy[language]
  const [copied, setCopied] = useState(false)
  const citation = publication.bibtex
  const copyCitation = async () => {
    await navigator.clipboard.writeText(citation)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }
  return (
    <section className="research-section section-shell" id="research">
      <div className="section-kicker"><span>01</span><span>{text.relevant}</span></div>
      <div className="research-layout">
        <div>
          <p className="eyebrow">{text.published}</p>
          <h2>{publication.title}</h2>
          <p className="research-description">{text.researchDescription}</p>
          <div className="authors">
            <span>Luciano Belo de Alcântara Júnior</span>
            <span>João Eduardo Montandon</span>
            <span>Universidade Federal de Minas Gerais</span>
          </div>
          <div className="action-row">
            <a className="button button-primary" href={publication.pdf} target="_blank" rel="noreferrer">{text.readPaper} <Arrow /></a>
            <a className="text-link" href={publication.dataset} target="_blank" rel="noreferrer">{text.dataset} <Arrow /></a>
            <button className="text-link copy-button" type="button" onClick={copyCitation}>{copied ? 'Copied BibTeX' : 'Copy BibTeX'} <span aria-hidden="true">{copied ? '✓' : '⧉'}</span></button>
          </div>
        </div>
        <div className="research-facts" aria-label="Dataset facts">
          <div className="fact"><strong>2,289</strong><span>BDD test scenarios</span></div>
          <div className="fact"><strong>1,720</strong><span>open-source projects</span></div>
          <div className="fact wide"><strong>3</strong><span>linked artifacts per scenario</span><small>Feature files · step definitions · system code</small></div>
          <a className="doi-link" href={publication.doi} target="_blank" rel="noreferrer">DOI {publication.doi.replace('https://doi.org/', '')} <Arrow /></a>
        </div>
      </div>
    </section>
  )
}

function ProjectsSection({ language }: { language: Language }) {
  const text = copy[language]
  return (
    <section className="projects-section section-shell" id="projects">
      <div className="section-kicker"><span>02</span><span>{text.artifacts}</span></div>
      <div className="section-heading-row"><h2>{text.projectsTitle}</h2><p>{text.projectsDescription}</p></div>
      <div className="project-list">
        {projects.map((project) => (
          <article className="project-item" key={project.name}>
            <div className="project-index">0{projects.indexOf(project) + 1}</div>
            <div className="project-body"><p className="eyebrow">{project.type}</p><h3>{project.name}</h3><p>{project.description}</p></div>
            <a className="project-link" href={project.url} target="_blank" rel="noreferrer">{text.open} <Arrow /></a>
          </article>
        ))}
      </div>
    </section>
  )
}

function AboutSection({ language }: { language: Language }) {
  const text = copy[language]
  return (
    <section className="about-section section-shell" id="about">
      <div className="section-kicker"><span>03</span><span>{text.about}</span></div>
      <div className="about-layout">
        <h2>{text.aboutTitle}</h2>
        <div className="about-copy"><p>{text.aboutText}</p><p>{text.aboutText2}</p><a className="text-link" href={githubUrl} target="_blank" rel="noreferrer">{text.repository} <Arrow /></a></div>
      </div>
      <div className="principles">{text.focus.map((item) => <span key={item}>{item}</span>)}</div>
    </section>
  )
}

function Footer({ language }: { language: Language }) {
  const text = copy[language]
  return <footer className="site-footer"><Logo compact /><p>{text.footer}</p><div><a href={githubUrl} target="_blank" rel="noreferrer">{text.github}</a><a href="/#research">{text.nav[0]}</a><a href="/agents/">{text.nav[3]}</a><a href="/mcp/">MCP</a></div></footer>
}

function AgentView() {
  return <main className="agent-page"><div className="agent-heading"><span className="agent-tag">AGENT VIEW · v1</span><h1>GivenWhenLab</h1><p>{lab.description}</p></div><div className="agent-block"><h2>Scope</h2><p>{lab.scope}</p><p>{lab.focus.join(' · ')}</p></div><div className="agent-block"><h2>Publications</h2><a href="/data/publications.json">Structured publication index ↗</a><p><strong>{publication.title}</strong><br />{publication.authors.join(' · ')}<br />{publication.venue} · <a href={publication.doi}>DOI</a> · <a href={publication.dataset}>Dataset</a></p></div><div className="agent-block"><h2>Projects &amp; datasets</h2><a href="/data/projects.json">Structured project index ↗</a>{projects.map((project) => <p key={project.name}><strong>{project.name}</strong> — {project.description}<br /><a href={project.url}>{project.url}</a></p>)}</div><div className="agent-block"><h2>Machine-readable resources</h2><p><a href="/llms.txt">llms.txt</a> · <a href="/llms-full.txt">llms-full.txt</a> · <a href="/data/lab.json">lab.json</a> · <a href="/data/publications.json">publications.json</a> · <a href="/data/projects.json">projects.json</a></p><p className="muted">These files make the lab easier for agents to read. They do not promise universal discovery or compatibility.</p></div></main>
}

function MpcPage({ kind }: { kind: 'mcp' | 'agents' }) {
  const isMcp = kind === 'mcp'
  return <main className="simple-page"><span className="agent-tag">{isMcp ? 'MCP' : 'AGENT MODE'}</span><h1>{isMcp ? 'Structured access,<br /><em>without the fiction.</em>' : 'A concise surface<br /><em>for agents.</em>'}</h1><p className="lead">{isMcp ? 'GitHub Pages is static, so this site does not host a remote MCP server. The structured resources below are already available for local or downstream integrations.' : 'Switch between a visual experience for humans and a text-first view designed to be easy for automated tools to inspect.'}</p>{isMcp && <div className="mcp-status"><span className="status-dot" /> Remote MCP endpoint not deployed.</div>}<div className="resource-list">{(isMcp ? ['get_lab_info', 'list_publications', 'get_publication', 'list_projects', 'get_dataset_info', 'get_citation'] : ['Agent view', 'llms.txt', 'llms-full.txt', 'lab.json', 'publications.json', 'projects.json']).map((item) => <div className="resource-row" key={item}><span>{item}</span><span>{isMcp ? 'read-only resource' : 'available'} ↗</span></div>)}</div><a className="button button-primary" href={isMcp ? '/agents/' : '/data/lab.json'}>{isMcp ? 'Read agent resources' : 'Open structured data'} <Arrow /></a></main>
}

function App() {
  const [agentMode, setAgentMode] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('gwl-language')
    return saved === 'pt' ? 'pt' : 'en'
  })
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('gwl-theme')
    return saved === 'light' ? 'light' : 'dark'
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('gwl-theme', theme)
  }, [theme])
  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en'
    localStorage.setItem('gwl-language', language)
  }, [language])
  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0)
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])
  const toggleLanguage = () => setLanguage((current) => current === 'en' ? 'pt' : 'en')
  const toggleTheme = () => setTheme((current) => current === 'dark' ? 'light' : 'dark')
  const path = window.location.pathname
  const page = useMemo(() => path.startsWith('/agents') ? 'agents' : path.startsWith('/mcp') ? 'mcp' : 'home', [path])
  const header = <><Cursor /><div className="scroll-progress" aria-hidden="true"><span style={{ width: `${scrollProgress}%` }} /></div><Header agentMode={agentMode} onAgentMode={() => setAgentMode(!agentMode)} language={language} onLanguage={toggleLanguage} theme={theme} onTheme={toggleTheme} /></>
  if (agentMode || page === 'agents') return <>{header}<AgentView /><Footer language={language} /></>
  if (page === 'mcp') return <>{header}<MpcPage kind="mcp" /><Footer language={language} /></>
  return <>{header}<main><section className="hero section-shell"><div className="hero-copy"><p className="eyebrow lime">GIVENWHENLAB · OPEN SOURCE RESEARCH</p><h1>Clear scenarios.<br /><em>Executable specs.</em><br />Confident releases.</h1><p className="hero-description">{lab.description}</p><div className="action-row"><a className="button button-primary" href="#research">{language === 'en' ? 'Explore the research' : 'Explorar a pesquisa'} <Arrow /></a><a className="text-link" href={githubUrl} target="_blank" rel="noreferrer">{language === 'en' ? 'View on GitHub' : 'Ver no GitHub'} <Arrow /></a></div></div><ScenarioDemo language={language} /></section><ResearchSection language={language} /><ProjectsSection language={language} /><AboutSection language={language} /></main><Footer language={language} /></>
}

function StepIcon({ state, index }: { state: DemoStep; index: number }) {
  const current = state === 'passed' ? 4 : state === 'running-1' ? 1 : state === 'running-2' ? 2 : state === 'running-3' ? 3 : 0
  const status = current >= index ? 'passed' : current === index - 1 ? 'running' : 'waiting'
  return <span className={`step-icon ${status}`} aria-label={status}>{status === 'passed' ? '✓' : status === 'running' ? '·' : '○'}</span>
}

export default App
