import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play, Music2, Fish, Trophy, Brain } from 'lucide-react';
import { interests, playlists, spotifyProfile } from '../data';
import './Interests.css';

const icons = { psicologia: Brain, pesca: Fish, esportes: Trophy, musica: Music2 };

function HobbyVideo({ src, poster, label, paused }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  // Each time the hobby is opened the clip restarts; it only plays while on screen.
  useEffect(() => { if (videoRef.current) videoRef.current.currentTime = 0; }, [src]);
  useEffect(() => {
    const video = videoRef.current;
    if (paused || !visible) video.pause();
    else video.play().catch(() => setPlaying(false));
  }, [src, paused, visible]);

  function toggle() {
    const video = videoRef.current;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  return <div className="hobby-video">
    <video ref={videoRef} src={src} poster={poster} muted loop playsInline preload="none" aria-label={`Vídeo do avatar de Marcus: ${label}`} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    <button className="hobby-video__toggle" onClick={toggle} aria-label={playing ? 'Pausar vídeo' : 'Reproduzir vídeo'}>{playing ? <Pause size={15} /> : <Play size={15} />}</button>
  </div>;
}

function SpotifyPlayer() {
  const [playlist, setPlaylist] = useState(playlists[0]);
  return <div className="hobby-spotify">
    <div className="hobby-spotify__chips" aria-label="Escolher playlist">{playlists.map(item => <button key={item.id} className={item.id === playlist.id ? 'active' : ''} aria-pressed={item.id === playlist.id} onClick={() => setPlaylist(item)}>{item.name}</button>)}</div>
    <iframe key={playlist.id} title={`Playlist ${playlist.name} no Spotify`} src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator`} width="100%" height="352" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
  </div>;
}

export default function Interests({ asset, paused }) {
  const [activeId, setActiveId] = useState('pesca');
  const active = interests.find(item => item.id === activeId);

  let stage;
  if (active.video) stage = <HobbyVideo src={asset(active.video)} poster={asset(active.poster)} label={active.label} paused={paused} />;
  else if (active.spotify) stage = <SpotifyPlayer />;
  else stage = <div className="hobby-avatar">
    <img src={asset('hobbies/marcus-corpo.webp')} alt="" width="434" height="980" />
    {active.tags && <div className="hobby-avatar__tags">{active.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
    {active.soon && <span className="hobby-avatar__soon"><span className="tiny-dot" /> {active.soon}</span>}
  </div>;

  return <section id="interesses" className="interests-section section-wrap" aria-labelledby="interests-title">
    <div className="section-heading"><div><span className="section-label">FORA DO CÓDIGO</span><h2 id="interests-title">Além da tela<span className="interests-accent">.</span></h2></div><p>O que me move quando desligo o editor.<br /> <span>Escolha um interesse e veja o avatar em ação.</span></p></div>
    <div className="interests-layout">
      <div className="interests-list" role="group" aria-label="Interesses">{interests.map((item, index) => {
        const Icon = icons[item.id];
        const selected = item.id === activeId;
        return <button key={item.id} className={`interest-item${selected ? ' active' : ''}`} aria-pressed={selected} aria-controls="interest-stage" onClick={() => setActiveId(item.id)}>
          <span className="interest-item__index">{String(index + 1).padStart(2, '0')}</span>
          <Icon size={18} aria-hidden="true" />
          <span className="interest-item__label">{item.label}</span>
          <span className="interest-item__kicker">{item.kicker}</span>
        </button>;
      })}</div>
      <div className="interest-panel">
        <div id="interest-stage" key={active.id} className={`interest-stage interest-stage--${active.id}${active.spotify ? ' is-music' : ''}`}>{stage}</div>
        <div className="interest-copy" aria-live="polite">
          <h3>{active.title}</h3>
          <p>{active.text}</p>
          {active.spotify && <a className="text-link" href={spotifyProfile} target="_blank" rel="noreferrer">Meu perfil no Spotify <ArrowUpRight size={15} /></a>}
        </div>
      </div>
    </div>
  </section>;
}
