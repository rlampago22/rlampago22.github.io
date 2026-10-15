import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { ArrowUpRight, ArrowDown, ArrowRight, Github, Instagram, Mail, MessageCircle, Copy, Check, X, Menu, Pause, Play, MapPin, Terminal, Code2, ExternalLink, Sparkles, Plus, Minus } from 'lucide-react';
import DecryptedText from './components/DecryptedText';
import Folder from './components/Folder';
import InteractiveAvatar from './components/InteractiveAvatar';
import KineticTitle from './components/KineticTitle';
import SubchefeDemo from './components/SubchefeDemo';
import Interests from './components/Interests';
import AboutIntro from './components/AboutIntro';
import Journey from './components/Journey';
import Toolbox from './components/Toolbox';
import Landings from './components/Landings';
import Intro, { shouldShowIntro } from './components/Intro';
import { projects, papers, email, github, instagram, orcid, lattes } from './data';

const asset = (name) => globalThis.__PORTFOLIO_ASSETS__?.[name] || `${import.meta.env.BASE_URL}assets/${name}`;
const models = [
  { id: 'openai', name: 'ChatGPT / Codex', role: 'Desenvolver & refinar', color: '#76aa98', code: ['// Uma etapa do meu fluxo de trabalho', 'const task = context.nextStep;', 'const change = implement(task);', 'review(change);', 'exportContext({ decisions, nextSteps });'], description: 'Implementação, revisão de código e registro das decisões para a próxima etapa.' },
  { id: 'claude', name: 'Claude', role: 'Estruturar & revisar', color: '#c18b72', code: ['# Contexto antes de código', 'read(project_requirements)', 'review(architecture)', 'validate(test_scenarios)', 'handoff(decisions, open_questions)'], description: 'Discussão de arquitetura, leitura de requisitos e revisão de cenários de teste.' },
  { id: 'gemini', name: 'Gemini', role: 'Explorar & conectar', color: '#91a6d4', code: ['# A próxima ferramenta recebe o essencial', 'context = load("handoff.md")', 'explore(context.references)', 'document(context.findings)', 'continue_from(context.next_step)'], description: 'Exploração de referências, documentação e continuidade do contexto de trabalho.' },
];

// Shortcuts to Marcus's profiles, shown at the bottom of the hero.
const socials = [
  { label: 'GitHub', href: github, icon: Github },
  { label: 'Instagram', href: instagram, icon: Instagram },
  { label: 'Currículo Lattes', href: lattes, text: 'Lattes' },
  { label: 'ORCID', href: orcid, text: 'ORCID' },
  { label: 'E-mail', href: `mailto:${email}`, icon: Mail },
  { label: 'WhatsApp', href: 'https://wa.me/5553999357192', icon: MessageCircle },
];

function Logo({ name, ...props }) { return <img src={asset(`${name}.svg`)} alt="" {...props} />; }
function SectionLabel({ children }) { return <span className="section-label">{children}</span>; }

function useMediaQuery(queryString) {
  const [reduced, setReduced] = useState(() => window.matchMedia(queryString).matches);
  useEffect(() => {
    const query = window.matchMedia(queryString);
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [queryString]);
  return reduced;
}

function ProjectDialog({ project, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!project) return;
    dialog.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = oldOverflow; if (dialog.open) dialog.close(); };
  }, [project]);
  return <dialog ref={dialogRef} className="project-dialog" onCancel={onClose} onClick={event => { if (event.target === dialogRef.current) onClose(); }} aria-labelledby="dialog-title">
    {project && <>
      <button className="icon-button dialog-close" onClick={onClose} aria-label="Fechar projeto"><X size={21} /></button>
      <SectionLabel>{project.label}</SectionLabel>
      <h2 id="dialog-title">{project.title}</h2>
      <p className="dialog-intro">{project.short}</p>
      <p>{project.detail}</p>
      <div className="project-flow">{project.flow.map((item, index) => <span key={item}>{index > 0 && <ArrowRight size={16} />}<b>{item}</b></span>)}</div>
      <div className="tags">{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div>
      {project.demo && <a className="button primary" href={project.demo} onClick={onClose}><Play size={17} /> Experimentar demonstração <ArrowRight size={17} /></a>}
      {project.repository !== null && <a className="button primary" href={project.repository || `${github}/${project.id}`} target="_blank" rel="noreferrer"><Github size={17} /> Explorar repositório <ArrowUpRight size={17} /></a>}
    </>}
  </dialog>;
}

function Playground({ paused }) {
  const [activeModel, setActiveModel] = useState(0);
  const [handoffs, setHandoffs] = useState(0);
  const current = models[activeModel];
  function handoff() { setActiveModel(index => (index + 1) % models.length); setHandoffs(count => count + 1); }
  return <section className="playground section-wrap" id="laboratorio" aria-labelledby="lab-title">
    <div className="lab-intro">
      <SectionLabel>MEU JEITO DE CONSTRUIR</SectionLabel>
      <h2 id="lab-title">Ferramentas diferentes.<br /> <span>O mesmo contexto.</span></h2>
      <p>Uso IA no processo de engenharia, conectando ferramentas, decisões e próximos passos. O trabalho continua mesmo quando o agente muda.</p>
      <div className="lab-note"><span className="tiny-dot" /> Demonstração interativa do fluxo</div>
      <button className="text-link" onClick={handoff}>Simular passagem de contexto <ArrowRight size={17} /></button>
    </div>
    <div className="code-window">
      <div className="window-top"><span className="traffic-lights"><i /><i /><i /></span><span>contexto / workspace</span><Code2 size={15} /></div>
      <div className="model-switcher" aria-label="Escolher ferramenta">{models.map((model, index) => <button key={model.id} className={index === activeModel ? 'selected' : ''} onClick={() => setActiveModel(index)} aria-pressed={index === activeModel}><Logo name={model.id} /><span>{model.name}</span></button>)}</div>
      <div className="code-content" aria-live="polite">
        <div className="code-file"><span style={{ background: current.color }} />{current.role}<span className="demo-tag">DEMO</span></div>
        <div className="code-lines">{current.code.map((line, index) => <div key={`${current.id}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><code>{index === 4 ? <DecryptedText text={line} animateOn="view" speed={25} maxIterations={8} pauseMotion={paused} /> : line}</code></div>)}</div>
        <p className="code-caption">{current.description}</p>
      </div>
      <div className="code-status"><span><span className="tiny-dot" /> {handoffs ? 'Contexto transferido na demonstração' : 'Contexto pronto para continuar'}</span><span>handoff.md <Check size={13} /></span></div>
    </div>
  </section>;
}

// Starts collapsed so visitors choose whether to open the full list of publications.
function Publications() {
  const [open, setOpen] = useState(false);
  const venues = [...new Set(papers.map(paper => paper.label.split(' · ')[0]))];
  return <div className="publications">
    <button className="publications-toggle" aria-expanded={open} aria-controls="paper-list" onClick={() => setOpen(value => !value)}>
      <span className="publications-count"><b>{String(papers.length).padStart(2, '0')}</b> publicações</span>
      <span className="publications-venues">{venues.map(venue => <i key={venue}>{venue}</i>)}</span>
      <span className="publications-action">{open ? 'Recolher' : 'Ver todas'} {open ? <Minus size={16} /> : <Plus size={16} />}</span>
    </button>
    <AnimatePresence initial={false}>{open && <motion.div id="paper-list" className="paper-list" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }} style={{ overflow: 'hidden' }}>
      {papers.map(paper => <article className="paper" key={paper.title}><div className="paper-meta"><span>{paper.label}</span><small>{paper.role}</small></div><div className="paper-title"><h3>{paper.url ? <a href={paper.url} target="_blank" rel="noreferrer">{paper.title}</a> : paper.title}</h3><span>{paper.topic}</span></div>{paper.url ? <a className="paper-link" href={paper.url} target="_blank" rel="noreferrer" aria-label={`Ler artigo: ${paper.title}`}><ArrowUpRight size={23} /></a> : <span className="paper-publisher">{paper.kind || 'Resumo'}</span>}</article>)}
    </motion.div>}</AnimatePresence>
  </div>;
}

function MiniTerminal() {
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([{ command: 'hello', response: 'Olá! Este é o meu terminal de apresentação. Digite help para explorar.' }]);
  const outputRef = useRef(null);
  useEffect(() => { if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight; }, [history]);
  const commands = {
    help: 'Comandos: whoami · projetos · pesquisa · ia · stack · contato · clear',
    whoami: 'Marcus Querol Jr. · 20 anos, natural de Uruguaiana. Engenharia de Software na UNIPAMPA, Alegrete/RS. IA, psicologia, Saúde Digital e ferramentas para agentes de IA.',
    projetos: projects.map(project => `${project.title} → ${project.repository === null ? 'projeto local, sem repositório público' : project.repository || `${github}/${project.id}`}`).join('\n'),
    pesquisa: 'App SAE (SBSC 2026) · Recomendação em tempo real (ERBD 2026) · Engenharia de Software e Saúde Digital para pessoas idosas (Springer) · RPC Peixes e VER-SUS (SIEPE 2026) · relatos na II Mostra PET-Saúde Digital. Lista completa na seção Pesquisa.',
    ia: 'Orquestração entre Codex, Claude, Gemini e Antigravity. Contexto preservado, decisões registradas e continuidade entre ferramentas.',
    stack: 'Python · TypeScript · JavaScript · Kotlin · SQL · Java\nReact Native · Expo · Streamlit · Playwright · pytest · Git',
    contato: `${email}\n${github}\nInstagram: @marcusqueroll\nWhatsApp: (53) 99935-7192`,
  };
  function run(value) {
    const command = value.trim().toLowerCase();
    if (!command) return;
    setInput('');
    if (command === 'clear') { setHistory([]); return; }
    setHistory(items => [...items.slice(-11), { command: value.trim(), response: commands[command] || `Comando não encontrado: ${value.trim()}. Digite help.` }]);
  }
  return <div className={`mini-terminal ${expanded ? 'expanded' : ''}`}>
    <button className="terminal-toggle" aria-expanded={expanded} aria-controls="terminal-panel" onClick={() => setExpanded(value => !value)}><span><Terminal size={18} /> Prefere explorar pelo terminal?</span>{expanded ? <Minus size={18} /> : <Plus size={18} />}</button>
    {expanded && <div id="terminal-panel"><div className="terminal-output" ref={outputRef} role="log" aria-live="polite">{history.map((item, index) => <div key={index}><b>marcus@portfolio ~ $ {item.command}</b><p>{item.response}</p></div>)}</div><form onSubmit={event => { event.preventDefault(); run(input); }}><label htmlFor="terminal-input">$</label><input autoComplete="off" spellCheck="false" id="terminal-input" aria-label="Comando do terminal" value={input} onChange={event => setInput(event.target.value)} placeholder="Digite help e pressione Enter" /><button aria-label="Executar comando"><ArrowRight size={18} /></button></form><div className="terminal-shortcuts">{['whoami', 'projetos', 'stack', 'contato'].map(command => <button key={command} onClick={() => run(command)}>{command}</button>)}</div></div>}
  </div>;
}

export default function App() {
  const compactFolders = useMediaQuery('(max-width: 600px)');
  const [motionPaused, setMotionPaused] = useState(false);
  const [introActive, setIntroActive] = useState(shouldShowIntro);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const paused = motionPaused;
  const copyTimeout = useRef(null);
  useEffect(() => () => clearTimeout(copyTimeout.current), []);
  useEffect(() => { document.documentElement.dataset.motion = paused ? 'paused' : 'running'; }, [paused]);
  // The AI logos around the portrait shy away from the cursor and grow a little as it gets close.
  useEffect(() => {
    const hero = document.querySelector('.hero');
    const badges = [...document.querySelectorAll('.orbit')];
    const offsets = new Map(badges.map(badge => [badge, { x: 0, y: 0 }]));
    const reset = () => badges.forEach(badge => { offsets.set(badge, { x: 0, y: 0 }); badge.style.translate = ''; badge.style.scale = ''; delete badge.dataset.near; });
    if (paused || !hero) { reset(); return undefined; }
    const radius = 170;
    const move = event => {
      if (event.pointerType === 'touch') return;
      badges.forEach(badge => {
        const box = badge.getBoundingClientRect();
        const offset = offsets.get(badge);
        const dx = event.clientX - (box.left + box.width / 2 - offset.x);
        const dy = event.clientY - (box.top + box.height / 2 - offset.y);
        const distance = Math.hypot(dx, dy) || 1;
        const pull = Math.max(0, 1 - distance / radius);
        const next = { x: (-dx / distance) * 26 * pull, y: (-dy / distance) * 26 * pull };
        offsets.set(badge, next);
        badge.style.translate = `${next.x.toFixed(1)}px ${next.y.toFixed(1)}px`;
        badge.style.scale = (1 + 0.16 * pull).toFixed(3);
        if (pull > 0.35) badge.dataset.near = ''; else delete badge.dataset.near;
      });
    };
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', reset);
    return () => { hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', reset); reset(); };
  }, [paused]);
  useEffect(() => { try { localStorage.removeItem('portfolio-motion'); } catch {} }, []);
  function toggleMotion() { setMotionPaused(value => !value); }
  async function copyEmail() {
    try { await navigator.clipboard.writeText(email); setCopyStatus('E-mail copiado!'); }
    catch { setCopyStatus(`Copie o endereço: ${email}`); }
    clearTimeout(copyTimeout.current); copyTimeout.current = setTimeout(() => setCopyStatus(''), 5000);
  }
  return <MotionConfig reducedMotion={paused ? 'always' : 'never'}><AnimatePresence>{introActive && <Intro key="intro" onDone={() => setIntroActive(false)} />}</AnimatePresence><div className="site-shell">
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header">
      <a href="#inicio" className="brand" aria-label="Marcus Querol, início"><span className="brand-symbol">m.</span><span>marcus querol<span className="brand-dot">.</span></span></a>
      <nav className={mobileMenu ? 'navigation is-open' : 'navigation'} aria-label="Principal">
        {[['Sobre mim', 'sobre'], ['Projetos', 'projetos'], ['Demo', 'subchefe'], ['Trajetória', 'trajetoria'], ['Interesses', 'interesses'], ['Pesquisa', 'pesquisa']].map(([title, id]) => <a href={`#${id}`} key={id} onClick={() => setMobileMenu(false)}>{title}</a>)}
        <a className="nav-contact" href="#contato" onClick={() => setMobileMenu(false)}>Vamos conversar <ArrowUpRight size={15} /></a>
      </nav>
      <div className="header-controls"><button className="icon-button motion-toggle" onClick={toggleMotion} aria-label={motionPaused ? 'Ativar animações' : 'Pausar animações'} aria-pressed={motionPaused} title={motionPaused ? 'Ativar animações' : 'Pausar animações'}>{paused ? <Play size={15} /> : <Pause size={15} />}</button><button className="icon-button mobile-menu" onClick={() => setMobileMenu(value => !value)} aria-label={mobileMenu ? 'Fechar menu' : 'Abrir menu'} aria-expanded={mobileMenu}>{mobileMenu ? <X size={21} /> : <Menu size={21} />}</button></div>
    </header>
    <main id="conteudo">
      <section id="inicio" className="hero" aria-labelledby="hero-title">
        <div className="hero-topline"><span className="hero-greeting">OLÁ, EU SOU O MARCUS <span>↘</span></span><span className="availability"><span className="tiny-dot" /> Aberto a projetos e conexões</span></div>
        <h1 id="hero-title"><KineticTitle text="Marcus Querol" paused={paused} /></h1>
        <div className="hero-scene">
          <div className="hero-description"><div className="small-rule" /><p>Entre código,<br /> pesquisa e <em>possibilidades.</em></p><span>Engenharia de Software<br /> & orquestração de IA</span></div>
          <InteractiveAvatar src={asset('marcus-3d.webp')} eyes={{ left: { eye: asset('eyes/eye-left.webp'), iris: asset('eyes/iris-left.webp') }, right: { eye: asset('eyes/eye-right.webp'), iris: asset('eyes/iris-right.webp') } }} paused={paused || introActive} onRequestMotion={() => setMotionPaused(false)} alt="Retrato 3D de Marcus Querol usando uma boina bordô" />
          <div className="orbit orbit-openai" aria-hidden="true"><Logo name="openai" /><span>ChatGPT</span></div>
          <div className="orbit orbit-claude" aria-hidden="true"><Logo name="claude" /><span>Claude</span></div>
          <div className="orbit orbit-gemini" aria-hidden="true"><Logo name="gemini" /><span>Gemini</span></div>
          <div className="hero-note"><span className="note-mark">*</span><p>Conecto ferramentas.<br /> Transformo ideias<br /> em software útil.</p><a href="#sobre">Um pouco sobre mim <ArrowUpRight size={15} /></a></div>
          <span className="code-fragment fragment-one" aria-hidden="true">&lt;ideia /&gt;</span><span className="code-fragment fragment-two" aria-hidden="true">context.connect()</span>
        </div>
        <div className="hero-bottom"><div className="hero-location"><MapPin size={15} /><span>Alegrete, RS · Brasil</span></div><a className="button primary" href="#projetos">Explore meus projetos <ArrowDown size={17} /></a><nav className="hero-github hero-socials" aria-label="Minhas redes">{socials.map(item => <a key={item.label} href={item.href} target={item.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" aria-label={item.label} title={item.label} className={item.icon ? 'hero-social hero-social--icon' : 'hero-social'}>{item.icon ? <item.icon size={15} aria-hidden="true" /> : item.text}</a>)}</nav></div>
        <div className="expertise-strip"><span>ENGENHARIA DE SOFTWARE</span><i>✳</i><span>AGENTES DE IA</span><i>✳</i><span>OPEN SOURCE</span><i>✳</i><span>SAÚDE DIGITAL</span><i>✳</i><span>IDEIAS EM MOVIMENTO</span></div>
      </section>

      <AboutIntro paused={paused} asset={asset} />

      <section id="projetos" className="projects-section section-wrap" aria-labelledby="projects-title">
        <div className="section-heading"><div><SectionLabel>DO CONTEXTO À CONSTRUÇÃO</SectionLabel><h2 id="projects-title"><DecryptedText text="Ideias fora da pasta." animateOn="view" speed={35} maxIterations={12} pauseMotion={paused} encryptedClassName="scrambled" /></h2></div><p>Ferramentas que resolvem problemas reais.<br /> <span>Abra uma pasta e explore o que tem dentro.</span></p></div>
        <div className="projects-toolbar"><span className="projects-count"><b>{String(projects.length).padStart(2, '0')}</b> projetos</span><span className="folder-hint">Um clique abre novas possibilidades <ArrowDown size={14} /></span></div>
        <div className="project-grid">{projects.map(project => <article className={`project-card project-card--${project.id}${project.featured ? ' project-card--featured' : ''}${project.wide ? ' project-card--wide' : ''}`} key={project.id}>
          {project.image ? <figure className="project-figure"><img src={asset(project.image)} alt={project.imageAlt} width="1400" height="862" loading="lazy" /><figcaption>{project.highlights.map(item => <span key={item}>{item}</span>)}</figcaption></figure> : <div className="project-folder-stage" style={{ '--folder-tint': project.color }}><Folder layout={compactFolders ? 'stack' : 'spread'} label={project.label} color={project.color} theme="light" size={0.94} items={[{ title: project.flow[0], description: 'Ponto de partida' }, { title: project.flow[1], description: project.short }, { title: project.flow[2], description: project.stack.join(' · ') }]} draggable={false} zoomOnClick={true} intro={false} pauseMotion={paused} /></div>}
          <div className="project-category">{project.label}<span className="project-dot" /></div><h3>{project.title}</h3><p>{project.description}</p><div className="tags">{project.stack.slice(0, 2).map(tag => <span key={tag}>{tag}</span>)}</div><button className="project-details" onClick={() => setSelectedProject(project)} aria-label={`Conhecer projeto ${project.title}`}>Conhecer projeto <ArrowUpRight size={17} /></button>
        </article>)}</div>
        <a href={`${github}?tab=repositories`} target="_blank" rel="noreferrer" className="all-projects"><Github size={17} /> Outros experimentos moram no GitHub <ArrowUpRight size={15} /></a>
      </section>

      <Landings asset={asset} />
      <SubchefeDemo />
      <Playground paused={paused} />

      <Journey />
      <Toolbox asset={asset} />

      <Interests asset={asset} paused={paused} />

      <section id="pesquisa" className="research-section section-wrap" aria-labelledby="research-title"><div className="section-heading"><div><SectionLabel>CONHECIMENTO QUE CIRCULA</SectionLabel><h2 id="research-title">Da pergunta à publicação.</h2></div><p>Pesquisa em software, dados<br /> e cuidado com as pessoas.</p></div><Publications /><div className="talk-note"><Sparkles size={18} /><p>Também compartilho ideias em palestras, como <strong>“A Inteligência Artificial no Meio Acadêmico”</strong>, na Semana Acadêmica de Engenharia de Aquicultura da UNIPAMPA.</p></div><MiniTerminal /></section>

      <section id="contato" className="contact-section section-wrap" aria-labelledby="contact-title"><div className="contact-copy"><SectionLabel>UMA CONVERSA PODE SER O COMEÇO</SectionLabel><h2 id="contact-title">Tem uma ideia?<br /> Vamos <em>construir.</em><ArrowUpRight /></h2><p>Projetos, oportunidades, pesquisa ou uma boa troca sobre tecnologia. Meu contato está logo aqui.</p><div className="contact-links"><a href={`mailto:${email}`}>{email} <ArrowUpRight size={18} /></a><button className="icon-button" onClick={copyEmail} aria-label="Copiar e-mail">{copyStatus === 'E-mail copiado!' ? <Check size={17} /> : <Copy size={17} />}</button></div><span className="copy-status" role="status">{copyStatus}</span><div className="contact-socials"><a className="text-link" href={github} target="_blank" rel="noreferrer"><Github size={17} /> @rlampago22 <ArrowUpRight size={15} /></a><a className="text-link" href={instagram} target="_blank" rel="noreferrer"><Instagram size={17} /> @marcusqueroll <ArrowUpRight size={15} /></a><a className="text-link" href={lattes} target="_blank" rel="noreferrer">Currículo Lattes <ArrowUpRight size={15} /></a><a className="text-link" href={orcid} target="_blank" rel="noreferrer">ORCID <ArrowUpRight size={15} /></a></div></div><form className="contact-form" onSubmit={event => { event.preventDefault(); const text = encodeURIComponent(`Olá, Marcus! Sou ${contactName.trim()}. ${contactMessage.trim()}`); window.open(`https://wa.me/5553999357192?text=${text}`, '_blank', 'noopener,noreferrer'); }}><label htmlFor="contact-name">Como posso te chamar?</label><input id="contact-name" name="name" autoComplete="name" required maxLength={100} placeholder="Seu nome" value={contactName} onChange={event => setContactName(event.target.value)} /><label htmlFor="contact-message">O que vamos tirar do papel?</label><textarea id="contact-message" name="message" required rows={3} maxLength={2000} placeholder="Me conte um pouco da sua ideia…" value={contactMessage} onChange={event => setContactMessage(event.target.value)} /><button className="button primary" type="submit">Continuar no WhatsApp <ArrowUpRight size={17} /></button><span>Você revisa a mensagem antes de enviar.</span></form></section>
    </main>
    <footer className="site-footer"><a className="brand" href="#inicio"><span className="brand-symbol">m.</span><span>Ideias em movimento.</span></a><span>© {new Date().getFullYear()} Marcus Querol</span><a href="#inicio">De volta ao topo <ArrowUpRight size={15} /></a></footer>
    <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
  </div></MotionConfig>;
}





