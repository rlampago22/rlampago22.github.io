import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, MapPin, GraduationCap, Brain, Sparkles, BadgeCheck, Instagram } from 'lucide-react';
import { aboutText, aboutFacts, graduationProgress, instagram } from '../data';
import WarpText from './WarpText';
import SplitText from './SplitText';
import './AboutIntro.css';

// The paragraph rises in word by word the first time it scrolls into view.
// With the site's animations paused it is shown as plain text.
function AboutText({ text, paused }) {
  if (paused) return <p className="reveal-text">{text}</p>;
  return <SplitText
    text={text}
    tag="p"
    className="reveal-text"
    splitType="words"
    delay={28}
    duration={0.9}
    ease="power3.out"
    from={{ opacity: 0, y: 26 }}
    to={{ opacity: 1, y: 0 }}
    threshold={0.15}
    rootMargin="-60px"
    textAlign="left"
  />;
}

const factIcons = { origem: MapPin, curso: GraduationCap, interesses: Brain, bolsas: BadgeCheck };

// Falls back to the initials until public/assets/marcus-foto.jpg exists.
function AboutPhoto({ src }) {
  const [failed, setFailed] = useState(false);
  return <span className="about-file__avatar">{failed ? <span aria-hidden="true">MQ</span> : <img src={src} alt="Foto de Marcus Querol" width="96" height="96" onError={() => setFailed(true)} />}</span>;
}

export default function AboutIntro({ paused, asset }) {
  return <section id="sobre" className="about-intro section-wrap" aria-labelledby="about-intro-title">
    <div className="about-intro__head">
      <span className="section-label">O HUMANO POR TRÁS DO CÓDIGO</span>
      <h2 id="about-intro-title" className="visually-hidden">Curiosidade como ponto de partida.</h2>
      <WarpText
        className="about-intro__warp"
        text={'Curiosidade como\nponto de partida.'}
        color="#29262d"
        fontFamily="'Space Grotesk', sans-serif"
        fontWeight={500}
        fontSize="clamp(2.6rem, 7.4vw, 6.6rem)"
        letterSpacing="-0.045em"
        lineHeight={1.02}
        warpStrength={0.09}
        speed={0.5}
        pointerInfluence={0.4}
        pointerStrength={0.42}
        refraction={0.03}
        paused={paused}
        decorative
      />
    </div>
    <div className="about-intro__text">
      <AboutText text={aboutText} paused={paused} />
      <div className="about-intro__links">
        <a className="text-link" href="#trajetoria">Minha trajetória <ArrowUpRight size={15} /></a>
        <a className="text-link" href={instagram} target="_blank" rel="noreferrer"><Instagram size={15} /> @marcusqueroll <ArrowUpRight size={15} /></a>
      </div>
    </div>
    <div className="about-file" aria-label="Ficha resumida">
      <span className="about-file__tab">sobre-mim.md</span>
      <div className="about-file__body">
        <div className="about-file__head"><AboutPhoto src={asset('marcus-foto.jpg')} /><div><strong>Marcus Querol</strong><span>20 anos · estudante, pesquisador e desenvolvedor</span></div></div>
        <dl>{aboutFacts.map(fact => {
          const Icon = factIcons[fact.id] || Sparkles;
          return <div key={fact.id}><dt><Icon size={14} aria-hidden="true" />{fact.label}</dt><dd>{fact.value}</dd></div>;
        })}</dl>
        <div className="about-file__progress">
          <div><span>Graduação concluída</span><b>{graduationProgress}%</b></div>
          <div className="about-file__bar" role="progressbar" aria-valuenow={graduationProgress} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso da graduação"><motion.i initial={{ width: 0 }} whileInView={{ width: `${graduationProgress}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: 'easeOut' }} /></div>
        </div>
      </div>
    </div>
  </section>;
}
