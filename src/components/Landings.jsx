import { landings } from '../data';
import './Landings.css';

export default function Landings({ asset }) {
  return <section id="landing-pages" className="landings-section section-wrap" aria-labelledby="landings-title">
    <div className="section-heading"><div><span className="section-label">LANDING PAGES</span><h2 id="landings-title">Ideias com vitrine<span className="landings-accent">.</span></h2></div><p>Estudos de landing pages criados com IA,<br /> <span>do briefing ao layout final.</span></p></div>
    <div className="landings-grid">{landings.map(item => <article key={item.id} className="landing-card">
      <figure className="landing-shot">
        <div className="landing-shot__bar" aria-hidden="true"><span className="traffic-lights"><i /><i /><i /></span><span className="landing-shot__url">{item.domain}</span></div>
        <img src={asset(`landings/${item.id}.webp`)} alt={`Página inicial da landing page ${item.name}`} width="1120" height="700" loading="lazy" />
      </figure>
      <span className="landing-card__kind">{item.kind}</span>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <div className="tags">{item.stack.map(tag => <span key={tag}>{tag}</span>)}</div>
    </article>)}</div>
  </section>;
}
