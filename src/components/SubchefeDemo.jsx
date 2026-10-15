import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, RotateCcw, ShieldCheck, Smartphone, Play, Check, ChartNoAxesCombined } from 'lucide-react';
import './SubchefeDemo.css';

const screens = [{ name: 'Hoje', route: '/' }, { name: 'Check-in', route: '/checkin' }, { name: 'Progresso', route: '/progresso' }];
const demoUrl = `${import.meta.env.BASE_URL}demos/subchefe/index.html`;

export default function SubchefeDemo() {
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [selectedScreen, setSelectedScreen] = useState('/');
  const frameRef = useRef(null);
  const isLocalFile = window.location.protocol === 'file:';
  useEffect(() => {
    const receive = event => {
      if (event.source !== frameRef.current?.contentWindow || event.origin !== window.location.origin) return;
      if (event.data?.type === 'subchefe-demo:ready') setReady(true);
      if (event.data?.type === 'subchefe-demo:route' && typeof event.data.route === 'string') {
        const route = event.data.route.replace(/^\/demos\/subchefe/, '') || '/';
        setSelectedScreen(route);
      }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);
  function navigate(route) {
    setSelectedScreen(route);
    frameRef.current?.contentWindow?.postMessage({ type: 'subchefe-demo:navigate', route }, window.location.origin);
  }
  function reset() { setReady(false); setSelectedScreen('/'); setGeneration(value => value + 1); }
  return <section id="subchefe" className="subchefe-section section-wrap" aria-labelledby="subchefe-title">
    <div className="subchefe-copy">
      <span className="section-label">DO MEU CELULAR PARA O SEU NAVEGADOR</span>
      <span className="subchefe-project-badge"><Smartphone size={13} /> Projeto pessoal · Android</span>
      <h2 id="subchefe-title">Conheça o <span>Subchefe.</span><br /> Uma rotina de cada vez.</h2>
      <p>Criei um app para acompanhar hábitos sem transformar um dia difícil em culpa. Um check-in curto se torna uma visão do dia, do progresso e do que muda na rotina.</p>
      <ul className="subchefe-features">
        <li><Check size={15} /><span>Check-in, diário e pontuação explicada</span></li>
        <li><ChartNoAxesCombined size={15} /><span>Média de sete dias e comparativos</span></li>
        <li><ShieldCheck size={15} /><span>Dados no aparelho e IA opcional</span></li>
      </ul>
      <div className="subchefe-stack">{['React Native', 'Expo', 'TypeScript', 'Kotlin'].map(item => <span key={item}>{item}</span>)}</div>
      <p className="subchefe-authorship">Desenvolvido com apoio do Claude Code. Eu defini o problema, as regras e as decisões de produto e validei o app no uso real.</p>
      <div className="subchefe-demo-notice"><span className="tiny-dot" /><p><strong>Experimente a interface real.</strong> Os registros desta demonstração são fictícios. Tempo de tela automático e notificações estão disponíveis no Android; a análise por IA aqui é ilustrativa.</p></div>
    </div>
    <div className="subchefe-demo-area">
      <div className="demo-screen-tabs" aria-label="Atalhos da demonstração">{screens.map(screen => <button key={screen.route} disabled={!ready} aria-pressed={selectedScreen === screen.route} onClick={() => navigate(screen.route)}>{screen.name}</button>)}</div>
      <div className="demo-phone"><div className="demo-phone-top"><span>Subchefe</span><span>DEMO</span></div><div className="demo-phone-screen">
        {!started ? <div className="demo-launch"><span className="demo-app-icon">S<span>↗</span></span><h3>Pequenos passos.<br />Uma rotina possível.</h3><p>Explore o app, faça um check-in e veja os gráficos com dados de exemplo.</p>{isLocalFile ? <p className="demo-file-notice">Para usar a demonstração, abra o portfólio pela prévia local ou por uma hospedagem web.</p> : <button className="button primary" onClick={() => setStarted(true)}><Play size={15} /> Experimentar o app <ArrowRight size={15} /></button>}<span className="demo-local-label"><ShieldCheck size={13} /> Nenhuma conta ou chave de API</span></div> : <><iframe ref={frameRef} key={generation} src={demoUrl} title="Demonstração interativa do Subchefe com dados fictícios" sandbox="allow-scripts allow-same-origin allow-modals" loading="lazy" /><span className={`demo-loading ${ready ? 'is-ready' : ''}`} role="status">{ready ? 'Demonstração pronta' : 'Abrindo demonstração…'}</span></>}
      </div><div className="demo-phone-bottom" /></div>
      <div className="demo-bottom-controls"><span>Interface do app · dados fictícios</span>{started ? <button onClick={reset}><RotateCcw size={13} /> Reiniciar demo</button> : <span><Smartphone size={13} /> Toque para explorar</span>}</div>
    </div>
  </section>;
}
