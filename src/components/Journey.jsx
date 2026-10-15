import { motion } from 'motion/react';
import { HeartPulse, Building2, GraduationCap } from 'lucide-react';
import { journey } from '../data';
import './Journey.css';

const icons = { 'pet-saude': HeartPulse, gestao: Building2, graduacao: GraduationCap };

function Block({ label, children }) {
  return <div className="journey-card__block"><span>{label}</span><p>{children}</p></div>;
}

export default function Journey() {
  return <section id="trajetoria" className="journey-section section-wrap" aria-labelledby="journey-title">
    <div className="section-heading"><div><span className="section-label">APRENDER. CONSTRUIR. COMPARTILHAR.</span><h2 id="journey-title">Minha trajetória<span className="journey-accent">.</span></h2></div><p>Bolsas, pesquisa e a graduação.<br /> <span>O contexto de cada uma e o que eu faço lá.</span></p></div>
    <div className="journey-grid">{journey.map(item => {
      const Icon = icons[item.id];
      return <article key={item.id} className={`journey-card journey-card--${item.id}`}>
        <header>
          <span className="journey-card__icon"><Icon size={19} aria-hidden="true" /></span>
          <div><span className="journey-card__date">{item.date}</span><span className="journey-card__role">{item.role}</span></div>
        </header>
        <h3>{item.title}</h3>
        <span className="journey-card__org">{item.org}</span>
        <div className="journey-card__blocks">
          {item.context && <Block label="O contexto">{item.context}</Block>}
          {item.course && <Block label="O curso">{item.course}</Block>}
          {item.group && <Block label="O grupo">{item.group}</Block>}
          {item.work && <Block label="O que eu faço">{item.work}</Block>}
        </div>
        {item.progress != null && <div className="journey-card__progress">
          <div><span>Graduação concluída</span><b>{item.progress}%</b></div>
          <div className="journey-card__bar" role="progressbar" aria-valuenow={item.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso da graduação"><motion.i initial={{ width: 0 }} whileInView={{ width: `${item.progress}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: 'easeOut' }} /></div>
        </div>}
        <div className="tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      </article>;
    })}</div>
  </section>;
}
