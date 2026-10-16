import { Languages } from 'lucide-react';
import { toolGroups, languages } from '../data';
import './Toolbox.css';

export default function Toolbox({ asset }) {
  return <section id="ferramentas" className="toolbox-section section-wrap" aria-labelledby="toolbox-title">
    <div className="section-heading"><div><span className="section-label">FERRAMENTAS & IDIOMAS</span><h2 id="toolbox-title">Com o que eu construo<span className="toolbox-accent">.</span></h2></div><p>O que uso no dia a dia<br /> <span>e as línguas em que trabalho.</span></p></div>
    <div className="toolbox-layout">
      <div className="toolbox-groups">{toolGroups.map(group => <article key={group.id} className={`toolbox-group toolbox-group--${group.id}`}>
        <h3>{group.title}</h3>
        {group.note && <p>{group.note}</p>}
        <ul>{group.items.map(item => <li key={item.name}>{item.logo && <img src={asset(`${item.logo}.svg`)} alt="" data-logo={item.logo} width="14" height="14" />}{item.name}</li>)}</ul>
      </article>)}</div>
      <aside className="toolbox-languages" aria-labelledby="languages-title">
        <div className="toolbox-languages__head"><Languages size={18} aria-hidden="true" /><h3 id="languages-title">Idiomas</h3></div>
        <ul>{languages.map(language => <li key={language.name}>
          <div><strong>{language.name}</strong><span>{language.level}</span></div>
          <span className="toolbox-dots" role="img" aria-label={`${language.level}: ${language.value} de 5`}>{Array.from({ length: 5 }, (_, index) => <i key={index} className={index < language.value ? 'on' : ''} />)}</span>
        </li>)}</ul>
      </aside>
    </div>
  </section>;
}
