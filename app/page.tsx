"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { loveConfig } from "../src/config/love-config";
import "./promises.css";

const heart = "♥";
const openWhen = [
  ["you’re angry with me", "You do not have to make your anger smaller for me. I hear that something I did hurt you, and I’m sorry. Take the room you need. I’ll be here, ready to listen without arguing."],
  ["you’re sad", "You never have to carry a difficult day alone. I hope you let this be a tiny reminder that your feelings matter, and that you are held in so many quiet ways."],
  ["you miss me", "Until I can be beside you, consider this a small piece of me reaching for your hand. I miss your laugh, your voice, and the comfort of simply being near you."],
  ["you’re overthinking", "Breathe with me: in, hold, out. You are not a burden. You are not too much. You are someone I care about deeply, exactly as you are."],
  ["you feel alone", "Even on the days the room feels too quiet, you are not invisible. You are loved, noticed, and worth showing up for."],
  ["you can’t sleep", "Let your shoulders soften. Tomorrow can wait a few hours. I hope the night is gentle with you, and that you wake up knowing you made it through."],
  ["you need motivation", "You have handled so much already. Take the next small step, then another. I believe in the person you are becoming."],
  ["you need reassurance", "You are deserving of patient, steady love. You do not need to earn care by being easy or cheerful all the time."],
  ["you need a hug", "Close your eyes for a second. This is me sending the longest, safest hug I can. No words needed—just warmth."],
  ["you forget how special you are", "Your gentleness, your honesty, your strange little habits, the way you care—none of it is ordinary to me. You are wonderfully, irreplaceably you."],
] as const;

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [sound, setSound] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [favourites, setFavourites] = useState<number[]>([]);
  const [openNote, setOpenNote] = useState<number | null>(null);
  const [hug, setHug] = useState(0);
  const [game, setGame] = useState({ level: 1, score: 0, active: false });
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  const [activePromise, setActivePromise] = useState<number | null>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const discovered = useMemo(() => new Set(revealed).size, [revealed]);

  useEffect(() => { const saved = localStorage.getItem("for-you-reasons"); if (saved) setRevealed(JSON.parse(saved)); }, []);
  useEffect(() => { localStorage.setItem("for-you-reasons", JSON.stringify(revealed)); }, [revealed]);
  useEffect(() => { if (!audio.current) return; sound ? audio.current.play().catch(() => setSound(false)) : audio.current.pause(); }, [sound]);
  useEffect(() => { if (!game.active) return; const t = window.setInterval(() => setGame(g => g.score >= 10 ? { ...g, active: false, level: Math.min(3, g.level + 1) } : { ...g, score: g.score + 1 }), 700 - game.level * 120); return () => clearInterval(t); }, [game.active, game.level]);

  const enter = () => { setOpened(true); setSound(true); setTimeout(() => document.getElementById("hey")?.scrollIntoView({ behavior: "smooth" }), 700); };
  const reveal = (i: number) => setRevealed(r => r.includes(i) ? r : [...r, i]);

  return <main className="site-shell">
    <audio ref={audio} loop src={loveConfig.audio.background} />
    <div className="grain" /><div className="petals" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i}>✦</i>)}</div>
    {!opened && <section className="opening" aria-label="A special delivery">
      <p className="eyebrow">A special delivery for the most precious person in my life</p>
      <button className="envelope" onClick={enter} aria-label="Open your letter"><span className="flap" /><span className="seal">{heart}</span><span className="letter-peek">for you</span></button>
      <p className="serif">Made with love, just for you.</p><button className="primary" onClick={enter}>Open Your Letter 💌</button>
    </section>}
    {opened && <>
      <button className="music" onClick={() => setSound(!sound)} aria-label={sound ? "Mute music" : "Play music"}>{sound ? "♫" : "♩"}</button>
      <nav className="chapter-nav"><a href="#hey">01</a><a href="#memories">03</a><a href="#reasons">04</a><a href="#gallery">08</a><a href="#last">13</a></nav>

      <section id="hey" className="hero chapter"><p className="eyebrow">chapter one</p><h1>Hey, Meri Jaan <em>♥</em></h1><div className="hero-copy"><p>I know you’re upset with me.</p><p>I know I haven’t been the reason behind your smile lately, and that is something I genuinely regret.</p><p>I wish I could sit beside you right now, hold your hand, listen to everything you’re feeling, and tell you how sorry I am.</p><p>So I made this little corner of the internet, just for you. Not to erase my mistakes, but to remind you how much you mean to me.</p></div><a href="#apology" className="primary">There’s something I want to tell you…</a></section>

      <section id="apology" className="chapter narrow"><p className="eyebrow">chapter two · in my own words</p><button className={`paper ${letterOpen ? "unfolded" : ""}`} onClick={() => setLetterOpen(true)}><span className="paper-hint">{letterOpen ? "" : "Tap to unfold"}</span>{letterOpen && <span className="letter-text">Meri jaan,<br/><br/>Mujhe pata hai ki meri wajah se tum hurt hui ho. Shayad maine tumhari feelings ko us waqt utna nahi samjha jitna mujhe samajhna chahiye tha.<br/><br/>Tumhara naraz hona bilkul valid hai. Main apni galti justify nahi karna chahta, aur na hi koi bahana banana chahta hoon.<br/><br/><strong>I am genuinely sorry.</strong><br/><br/>Main perfect nahi hoon, lekin main apni galtiyon se seekhna chahta hoon. Main chahta hoon ki meri wajah se tumhe sirf pyaar, respect aur comfort feel ho.<br/><br/>Tumhe jitna time chahiye, main respect karunga. Main bas chahta hoon ki tum jaano ki tumhari feelings mere liye matter karti hain.<br/><br/>I love you, meri jaan.<br/><i>— always, {loveConfig.fromName} {heart}</i></span>}</button></section>

      <section id="memories" className="chapter memories"><p className="eyebrow">chapter three</p><h2>Our little universe</h2><p className="section-intro">Every photograph is a small universe I’m grateful to share with you.</p><div className="timeline">{loveConfig.photos.slice(0, 6).map((photo, i) => <article className="polaroid" key={photo.src} style={{ transform: `rotate(${[-3,2,-1,4,-4,1][i]}deg)` }}><button onClick={() => setLightbox(i)}><img src={photo.src} alt={photo.caption} /></button><p>{photo.caption}</p><small>{["a beginning", "a little moment", "us", "one of my favourites", "more smiles", "today & always"][i]}</small></article>)}</div></section>

      <section id="reasons" className="chapter reasons"><p className="eyebrow">chapter four</p><h2>100 little reasons</h2><p className="section-intro">You’ve discovered {discovered} of 100 little reasons.</p><button className="text-button" onClick={() => reveal(Math.floor(Math.random() * 100))}>Reveal a random reason ✦</button><div className="reason-grid">{loveConfig.reasons.map((reason, i) => <button className={`reason ${revealed.includes(i) ? "seen" : ""}`} key={i} onClick={() => reveal(i)}>{revealed.includes(i) ? <><span>{reason}</span><b onClick={(e) => {e.stopPropagation();setFavourites(f => f.includes(i) ? f.filter(x => x !== i) : [...f, i]);}}>{favourites.includes(i) ? "♥" : "♡"}</b></> : <><small>little note no. {String(i + 1).padStart(3, "0")}</small><span className="mini-seal">♥</span></>}</button>)}</div>{discovered === 100 && <p className="unlock">You found every note. My final little secret: I choose you, again and again.</p>}</section>

      <section className="chapter open-when"><p className="eyebrow">chapter five</p><h2>Open when…</h2><div className="envelope-grid">{openWhen.map(([title, note], i) => <button key={title} className={`mini-envelope ${openNote === i ? "open" : ""}`} onClick={() => setOpenNote(openNote === i ? null : i)}><span>Open when {title}</span>{openNote === i && <strong>{note}</strong>}</button>)}</div></section>

      <section className="chapter game"><p className="eyebrow">chapter six</p><h2>Mission: make her smile</h2><div className="game-box"><div className="teddy">🧸</div><div className="heart-rain">{Array.from({length: 12}, (_, i) => <i key={i} style={{left: `${i*9}%`, animationDelay: `${i*.23}s`}}>♥</i>)}</div><p>Level {game.level} · {game.score}/10 hearts</p><button className="primary" onClick={() => setGame(g => ({...g, active: !g.active}))}>{game.active ? "Collecting…" : game.score >= 10 ? "Next level" : "Start collecting"}</button><small>Tap the button to guide our teddy. Every heart is a tiny smile.</small></div><p className="section-intro">Mission accomplished! But making you smile will always be my favourite mission.</p></section>

      <section className="chapter hug"><p className="eyebrow">chapter seven</p><h2>A virtual hug</h2><p>Distance can’t stop me from sending you the biggest hug.</p><div className="hug-stage"><span className="bear left">🧸</span><div className="hug-heart" style={{"--hug": `${hug}%`} as React.CSSProperties}>{hug}%</div><span className={`bear right ${hug === 100 ? "hugged" : ""}`}>🧸</span></div><button className="primary" onPointerDown={() => {let v=0; const t=setInterval(()=>{v+=5;setHug(v);if(v>=100)clearInterval(t)},50);}} onPointerUp={() => {}} >Hold for a Hug 🫂</button>{hug === 100 && <p className="section-intro">I wish this was a real hug. You deserve all the warmth and comfort in the world.</p>}</section>

      <section id="gallery" className="chapter gallery"><p className="eyebrow">chapter eight</p><h2>Our photo gallery</h2><div className="gallery-grid">{loveConfig.photos.map((photo, i) => <button key={photo.src} onClick={() => setLightbox(i)}><img src={photo.src} alt={photo.caption}/><span>{photo.caption}</span></button>)}</div></section>

      <section className="chapter stars"><p className="eyebrow">chapter nine</p><div className="constellation">{Array.from({length: 35},(_,i)=><i key={i} style={{left:`${(i*37)%96}%`,top:`${(i*53)%88}%`,animationDelay:`${i*.1}s`}}>✦</i>)}<b>♥</b></div><h2>Look at the stars</h2><p>If every star represented one thing I love about you, even the universe wouldn’t have enough stars.</p></section>

      <section id="promises" className="chapter promises"><p className="eyebrow">chapter ten</p><h2>My promises to you</h2><p className="section-intro">Swipe through these, or tap a card to bring a promise close.</p><div className="promise-track" aria-label="My promises">{loveConfig.promises.map((promise, i) => <button className={`promise-card ${activePromise === i ? "active" : ""}`} key={promise} onClick={() => setActivePromise(activePromise === i ? null : i)} aria-pressed={activePromise === i}><b>{String(i+1).padStart(2,"0")}</b><span>{promise}</span><small>{activePromise === i ? "A promise I want to live by ♥" : "Tap to hold this promise"}</small></button>)}</div></section>

      <section className="chapter voice"><p className="eyebrow">chapter eleven</p><h2>Listen to my heart</h2><p>Some feelings are better spoken than written.</p><div className="wave">{Array.from({length:28},(_,i)=><i key={i} style={{height:`${15+(i*17)%60}%`}}/>)}</div><button className="primary" onClick={() => setSound(!sound)}>{sound ? "Pause O Sanam" : "Play O Sanam"}</button></section>

      <section className="chapter future"><p className="eyebrow">chapter twelve</p><h2>Our future</h2><div>{["Places we want to visit", "Watching sunsets together", "Celebrating special occasions", "Supporting each other’s dreams", "Creating more beautiful memories", "Growing together"].map(x => <span key={x}>{x}</span>)}</div><p>There are so many pages of our story that are still unwritten. I hope we get to write them together.</p></section>

      <section id="last" className="chapter last"><p className="eyebrow">chapter thirteen · one last thing</p><div className="final-heart">♥</div><h2>For you, always.</h2><p>Out of all the people in this world, I’m grateful that our paths crossed.<br/><br/>I know a website cannot undo the things that hurt you. I know that saying sorry is not enough unless my actions reflect it.<br/><br/>But I hope this little experience reminds you that you are loved, appreciated, and incredibly special to me.<br/><br/>I’m sorry, meri jaan.<br/>I love you. ♥</p><div className="reply-buttons">{[["I want a hug ♥", "A hug is waiting for you—warm, patient, and with no questions asked."],["Let’s talk 💌", "Whenever you’re ready, I want to listen properly."],["I need some time 🌷", "Take all the time you need. Your space and peace matter to me."]].map(([label, message]) => <button key={label} onClick={() => setReply(message)}>{label}</button>)}</div>{reply && <p className="response">{reply}</p>}</section>
      {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}><button aria-label="Close image">×</button><img src={loveConfig.photos[lightbox].src} alt={loveConfig.photos[lightbox].caption}/><p>{loveConfig.photos[lightbox].caption}</p></div>}
    </>}
  </main>;
}
