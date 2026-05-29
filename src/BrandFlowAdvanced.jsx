import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Type, Download, Moon, Sun, Settings, Loader, CheckCircle, AlertCircle, Save, Trash2, BookMarked, Plus, Music } from 'lucide-react';

const BrandFlowAdvanced = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('logo');
  const [showSettings, setShowSettings] = useState(false);
  const [showBrandKit, setShowBrandKit] = useState(false);
  const [showSoundPanel, setShowSoundPanel] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(3);
  const [animationStyle, setAnimationStyle] = useState('pulse');
  const [colorScheme, setColorScheme] = useState('pink');
  const [selectedSound, setSelectedSound] = useState('whoosh');
  const [soundVolume, setSoundVolume] = useState(70);
  const [soundTiming, setSoundTiming] = useState('start');
  const [enableSound, setEnableSound] = useState(true);
  const [playingPreview, setPlayingPreview] = useState(null);
  const [createdAnimations, setCreatedAnimations] = useState([]);
  const [animationPreview, setAnimationPreview] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [notification, setNotification] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [animProgress, setAnimProgress] = useState(0);
  const [brandingKits, setBrandingKits] = useState([]);
  const [brandingKit, setBrandingKit] = useState({ name: 'My Brand', primaryColor: '#ec4899', secondaryColor: '#9333ea' });
  const [filters, setFilters] = useState({ brightness: 100, contrast: 100, saturation: 100, glow: 0 });

  const fileInputRef = useRef(null);
  const liveCanvasRef = useRef(null);
  const recordCanvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const audioCtxRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const colorSchemes = {
    pink:   ['#ec4899','#f472b6','#9333ea','#db2777'],
    purple: ['#9333ea','#c084fc','#ec4899','#7c3aed'],
    cyan:   ['#06b6d4','#67e8f9','#3b82f6','#0891b2'],
    gold:   ['#f59e0b','#fcd34d','#ef4444','#d97706'],
    rainbow:['#ec4899','#f59e0b','#06b6d4','#10b981'],
  };

  const colors = darkMode ? {
    bg:'bg-black', surface:'bg-neutral-900', text:'text-white',
    textSecondary:'text-neutral-300', accentBorder:'border-pink-600',
    cardBg:'bg-neutral-800', input:'bg-neutral-800 text-white border-neutral-700',
  } : {
    bg:'bg-white', surface:'bg-pink-50', text:'text-neutral-900',
    textSecondary:'text-neutral-600', accentBorder:'border-pink-600',
    cardBg:'bg-pink-100', input:'bg-white text-neutral-900 border-pink-200',
  };

  const showNotif = (message, type='success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ---- REAL AUDIO via Web Audio API ----
  const getAudioCtx = () => {
    if (!audioCtxRef.current)
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtxRef.current;
  };

  const playSound = useCallback((type, vol = 70) => {
    if (!enableSound) return;
    try {
      const ctx = getAudioCtx();
      const master = ctx.createGain();
      master.gain.value = vol / 100;
      master.connect(ctx.destination);
      const osc = (type2, freq, dur, envFn) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type2; o.frequency.value = freq;
        o.connect(g); g.connect(master);
        envFn(g.gain, ctx.currentTime);
        o.start(ctx.currentTime); o.stop(ctx.currentTime + dur);
      };
      const ramp = (param, from, to, dur) => {
        param.setValueAtTime(from, ctx.currentTime);
        param.exponentialRampToValueAtTime(to, ctx.currentTime + dur);
      };
      if (type === 'whoosh') {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.connect(g); g.connect(master);
        o.frequency.setValueAtTime(1200, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.5);
        g.gain.setValueAtTime(0.9, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        o.start(); o.stop(ctx.currentTime + 0.5);
      } else if (type === 'pop') {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.connect(g); g.connect(master);
        o.frequency.setValueAtTime(500, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);
        g.gain.setValueAtTime(1, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        o.start(); o.stop(ctx.currentTime + 0.12);
      } else if (type === 'chime') {
        [523,659,784,1047].forEach((f, i) => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = 'sine'; o.frequency.value = f;
          o.connect(g); g.connect(master);
          const t = ctx.currentTime + i*0.13;
          g.gain.setValueAtTime(0.001, t);
          g.gain.linearRampToValueAtTime(0.5, t+0.05);
          g.gain.exponentialRampToValueAtTime(0.001, t+0.7);
          o.start(t); o.stop(t+0.7);
        });
      } else if (type === 'power') {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sawtooth'; o.connect(g); g.connect(master);
        o.frequency.setValueAtTime(80, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.4);
        g.gain.setValueAtTime(0.6, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        o.start(); o.stop(ctx.currentTime + 0.4);
      } else if (type === 'glitch') {
        for (let i=0;i<8;i++) {
          const o=ctx.createOscillator(),g=ctx.createGain();
          o.type='square'; o.frequency.value=200+Math.random()*2000;
          o.connect(g); g.connect(master);
          const t=ctx.currentTime+i*0.04;
          g.gain.setValueAtTime(0.2,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.03);
          o.start(t); o.stop(t+0.03);
        }
      } else if (type === 'shimmer') {
        for (let i=0;i<10;i++) {
          const o=ctx.createOscillator(),g=ctx.createGain();
          o.type='sine'; o.frequency.value=2000+Math.random()*4000;
          o.connect(g); g.connect(master);
          const t=ctx.currentTime+i*0.07;
          g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(0.12,t+0.03);
          g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
          o.start(t); o.stop(t+0.25);
        }
      } else if (type === 'boom') {
        const buf=ctx.createBuffer(1,ctx.sampleRate*0.6,ctx.sampleRate);
        const d=buf.getChannelData(0);
        for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2.5);
        const src=ctx.createBufferSource(), g=ctx.createGain();
        const lpf=ctx.createBiquadFilter(); lpf.type='lowpass'; lpf.frequency.value=180;
        src.buffer=buf; src.connect(lpf); lpf.connect(g); g.connect(master);
        g.gain.setValueAtTime(2.5,ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.6);
        src.start(); src.stop(ctx.currentTime+0.6);
      } else if (type === 'typewriter') {
        for(let i=0;i<14;i++) {
          const o=ctx.createOscillator(),g=ctx.createGain();
          o.type='square'; o.frequency.value=700+Math.random()*500;
          o.connect(g); g.connect(master);
          const t=ctx.currentTime+i*0.09;
          g.gain.setValueAtTime(0.15,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.06);
          o.start(t); o.stop(t+0.06);
        }
      } else if (type === 'sparkle') {
        for(let i=0;i<12;i++) {
          const o=ctx.createOscillator(),g=ctx.createGain();
          o.type='sine'; o.frequency.value=3000+Math.random()*5000;
          o.connect(g); g.connect(master);
          const t=ctx.currentTime+Math.random()*0.6;
          g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(0.08,t+0.02);
          g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
          o.start(t); o.stop(t+0.18);
        }
      } else if (type === 'wave') {
        const o=ctx.createOscillator(),lfo=ctx.createOscillator(),lg=ctx.createGain(),g=ctx.createGain();
        lfo.frequency.value=5; lg.gain.value=60;
        lfo.connect(lg); lg.connect(o.frequency);
        o.type='sine'; o.frequency.value=250; o.connect(g); g.connect(master);
        g.gain.setValueAtTime(0,ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.45,ctx.currentTime+0.25);
        g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+1.3);
        lfo.start(); o.start(); lfo.stop(ctx.currentTime+1.3); o.stop(ctx.currentTime+1.3);
      } else if (type === 'bell') {
        [880,1108,1318,1760].forEach((f,i)=>{
          const o=ctx.createOscillator(),g=ctx.createGain();
          o.type='sine'; o.frequency.value=f; o.connect(g); g.connect(master);
          const t=ctx.currentTime+i*0.015;
          g.gain.setValueAtTime(0.35,t); g.gain.exponentialRampToValueAtTime(0.001,t+1.2);
          o.start(t); o.stop(t+1.2);
        });
      } else if (type === 'cyber') {
        const o=ctx.createOscillator(),g=ctx.createGain();
        o.type='sawtooth'; o.connect(g); g.connect(master);
        o.frequency.setValueAtTime(40,ctx.currentTime);
        o.frequency.linearRampToValueAtTime(1500,ctx.currentTime+0.7);
        o.frequency.linearRampToValueAtTime(40,ctx.currentTime+1.4);
        g.gain.setValueAtTime(0.25,ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+1.4);
        o.start(); o.stop(ctx.currentTime+1.4);
      }
    } catch(e){ console.log('audio',e); }
  }, [enableSound]);

  const soundLibrary = {
    whoosh:{name:'✨ Elegant Whoosh',cat:'Transition'},
    pop:{name:'🔷 Bright Pop',cat:'Accent'},
    chime:{name:'🎵 Success Chime',cat:'Uplifting'},
    power:{name:'⚡ Power Whoosh',cat:'Impact'},
    glitch:{name:'🔧 Digital Glitch',cat:'Modern'},
    shimmer:{name:'✨ Magic Shimmer',cat:'Fantasy'},
    boom:{name:'💥 Deep Boom',cat:'Bass'},
    typewriter:{name:'⌨️ Typewriter',cat:'Mechanical'},
    sparkle:{name:'💫 Sparkle',cat:'Soft'},
    wave:{name:'🌊 Wave',cat:'Organic'},
    bell:{name:'🔔 Bell Ring',cat:'Gentle'},
    cyber:{name:'🔍 Cyber Scan',cat:'Tech'},
  };

  // ---- CANVAS DRAWING ----
  const drawFrame = useCallback((ctx, img, text, frame, fps, duration, style, schemeKey, w, h, isText) => {
    const totalFrames = fps * duration;
    const t = (frame % totalFrames) / totalFrames;
    const scheme = colorSchemes[schemeKey] || colorSchemes.pink;
    ctx.clearRect(0, 0, w, h);

    // Background
    const bg = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)*0.8);
    bg.addColorStop(0, scheme[0]+'33');
    bg.addColorStop(0.5, scheme[2]+'18');
    bg.addColorStop(1, '#00000099');
    ctx.fillStyle = bg; ctx.fillRect(0,0,w,h);

    // Animated background rings
    for(let r=0; r<3; r++){
      const radius = (80+r*70) + Math.sin(t*Math.PI*2+r)*15;
      const alpha = (0.08 + r*0.04) * (0.5+0.5*Math.sin(t*Math.PI*2-r));
      ctx.beginPath();
      ctx.arc(w/2, h/2, radius, 0, Math.PI*2);
      ctx.strokeStyle = scheme[r%4];
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    if (!isText && img) {
      // LOGO ANIMATION
      ctx.save(); ctx.translate(w/2, h/2);
      let sc=1, rot=0, tx=0, ty=0, alpha=1, blur=0;

      if(style==='pulse'){
        sc = 0.82 + 0.18*Math.sin(t*Math.PI*4);
        alpha = 0.6 + 0.4*Math.abs(Math.sin(t*Math.PI*2));
      } else if(style==='rotate'){
        rot = t*Math.PI*2;
        sc = t<0.15 ? t/0.15*0.9+0.1 : 1;
        alpha = Math.min(t*5,1);
      } else if(style==='slide'){
        tx = t<0.2 ? (t/0.2-1)*w*0.6 : t>0.8 ? (t-0.8)/0.2*w*0.6 : 0;
        alpha = t<0.2 ? t/0.2 : t>0.8 ? 1-(t-0.8)/0.2 : 1;
      } else if(style==='zoom'){
        sc = t<0.4 ? t/0.4*1.1 : t>0.7 ? 1.1-(t-0.7)/0.3*0.6 : 1.1;
        alpha = t<0.15 ? t/0.15 : t>0.8 ? 1-(t-0.8)/0.2 : 1;
      } else if(style==='glitch'){
        tx = frame%6===0?(Math.random()-0.5)*18:0;
        ty = frame%8===0?(Math.random()-0.5)*10:0;
        alpha = 0.7+0.3*Math.random();
      } else if(style==='neon'){
        sc = 0.95+0.05*Math.sin(t*Math.PI*6);
        ctx.shadowColor = scheme[0];
        ctx.shadowBlur = 30+30*Math.abs(Math.sin(t*Math.PI*4));
      } else if(style==='float'){
        ty = Math.sin(t*Math.PI*2)*20;
        sc = 0.95+0.05*Math.cos(t*Math.PI*2);
      } else if(style==='spin3d'){
        sc = Math.abs(Math.cos(t*Math.PI*2))*0.3+0.7;
        ctx.scale(sc, 1);
        sc=1;
      }

      ctx.globalAlpha = Math.max(0,Math.min(1,alpha));
      ctx.rotate(rot); ctx.translate(tx, ty); ctx.scale(sc, sc);

      // Glow ring behind logo
      const grd = ctx.createRadialGradient(0,0,60,0,0,140);
      grd.addColorStop(0, scheme[0]+'55'); grd.addColorStop(1,'transparent');
      ctx.fillStyle = grd; ctx.fillRect(-140,-140,280,280);

      const s = Math.min(w,h)*0.45;
      ctx.drawImage(img, -s/2, -s/2, s, s);
      ctx.restore();

      // Glitch color splits
      if(style==='glitch' && frame%5===0){
        ctx.save(); ctx.globalAlpha=0.35; ctx.globalCompositeOperation='screen';
        ctx.translate(w/2,h/2);
        const s2=Math.min(w,h)*0.45;
        ctx.fillStyle=scheme[0];
        ctx.translate(-8,0); ctx.drawImage(img,-s2/2,-s2/2,s2,s2);
        ctx.translate(16,0); ctx.fillStyle=scheme[1]; ctx.drawImage(img,-s2/2,-s2/2,s2,s2);
        ctx.restore();
      }
    } else if (isText && text) {
      // TEXT ANIMATION
      ctx.save();
      ctx.textAlign='center'; ctx.textBaseline='middle';
      const fsize = Math.min(120, w/(text.length*0.62));
      let tx=w/2, ty=h/2, sc=1, alpha=1;

      if(style==='elegant-fade'){
        alpha = t<0.25?t/0.25 : t>0.75?(1-t)/0.25 : 1;
        ctx.font=`900 ${fsize}px 'Arial Black',Arial`;
        ctx.globalAlpha=alpha;
        ctx.shadowColor=scheme[1]; ctx.shadowBlur=25;
        ctx.fillStyle='#fff'; ctx.fillText(text,tx,ty);
      } else if(style==='dynamic-slide'){
        const offX = t<0.35?(t/0.35-1)*w*0.7 : t>0.65?(t-0.65)/0.35*w*0.7 : 0;
        alpha = t<0.2?t/0.2 : t>0.8?1-(t-0.8)/0.2 : 1;
        ctx.globalAlpha=alpha;
        ctx.font=`900 ${fsize}px 'Arial Black',Arial`;
        ctx.fillStyle='#fff'; ctx.shadowColor=scheme[0]; ctx.shadowBlur=20;
        ctx.fillText(text,tx+offX,ty);
      } else if(style==='typewriter'){
        const chars=Math.floor(t*text.length*1.4);
        const shown=text.substring(0,Math.min(chars,text.length));
        ctx.font=`900 ${fsize}px monospace`;
        ctx.fillStyle='#fff'; ctx.shadowColor=scheme[0]; ctx.shadowBlur=15;
        ctx.fillText(shown+(frame%20<10?'▮':''),tx,ty);
      } else if(style==='bouncy'){
        const bounce=Math.abs(Math.sin(t*Math.PI*4))*38;
        sc=0.4+t*0.6;
        ctx.translate(tx,ty); ctx.scale(sc,sc); ctx.translate(0,-bounce);
        ctx.font=`900 ${fsize}px 'Arial Black',Arial`;
        ctx.strokeStyle=scheme[1]; ctx.lineWidth=5;
        ctx.strokeText(text,0,0);
        ctx.fillStyle='#fff'; ctx.fillText(text,0,0);
      } else if(style==='glitch'){
        ctx.font=`900 ${fsize}px monospace`;
        if(frame%3===0){
          ctx.globalAlpha=0.7;
          ctx.fillStyle=scheme[0]; ctx.fillText(text,tx+7,ty-2);
          ctx.fillStyle=scheme[2]; ctx.fillText(text,tx-7,ty+2);
        }
        ctx.globalAlpha=Math.min(t*3,1);
        ctx.fillStyle='#fff'; ctx.fillText(text,tx,ty);
      } else if(style==='neon'){
        const glow=20+40*Math.abs(Math.sin(t*Math.PI*3));
        ctx.globalAlpha=Math.min(t*2,1);
        ctx.font=`900 ${fsize}px 'Arial Black',Arial`;
        ctx.strokeStyle=scheme[1]; ctx.lineWidth=7;
        ctx.shadowColor=scheme[0]; ctx.shadowBlur=glow;
        ctx.strokeText(text,tx,ty);
        ctx.fillStyle='#ffffff';
        ctx.shadowBlur=glow*2;
        ctx.fillText(text,tx,ty);
      } else if(style==='float'){
        const offsetY=Math.sin(t*Math.PI*2)*18;
        alpha=t<0.2?t/0.2:t>0.8?1-(t-0.8)/0.2:1;
        ctx.globalAlpha=alpha;
        ctx.font=`900 ${fsize}px 'Arial Black',Arial`;
        ctx.fillStyle='#fff'; ctx.shadowColor=scheme[0]; ctx.shadowBlur=20;
        ctx.fillText(text,tx,ty+offsetY);
      }
      ctx.restore();
    }

    // Floating particles
    for(let i=0;i<8;i++){
      const angle=(frame*0.06+i*0.785)%(Math.PI*2);
      const r2 = (isText?Math.min(w,h)*0.38:Math.min(w,h)*0.36)+Math.sin(frame*0.12+i*1.1)*18;
      const px=w/2+Math.cos(angle)*r2, py=h/2+Math.sin(angle)*r2;
      const ps=2.5+Math.sin(frame*0.08+i)*1.5;
      ctx.globalAlpha=0.55+0.45*Math.abs(Math.sin(frame*0.06+i));
      ctx.beginPath(); ctx.arc(px,py,ps,0,Math.PI*2);
      ctx.fillStyle=scheme[i%4]; ctx.fill();
    }
    ctx.globalAlpha=1;
  }, []);

  // ---- LIVE PREVIEW LOOP ----
  const startLivePreview = useCallback(() => {
    const canvas = liveCanvasRef.current;
    if (!canvas) return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const isText = activeTab==='text';
    canvas.width = isText?700:500; canvas.height = isText?350:500;
    const ctx = canvas.getContext('2d');
    let frame=0;
    let img=null;
    if(!isText && logoPreview){
      img=new Image(); img.src=logoPreview;
    }
    const loop=()=>{
      drawFrame(ctx,img,textInput,frame,30,animationDuration,animationStyle,colorScheme,canvas.width,canvas.height,isText);
      frame++;
      animFrameRef.current=requestAnimationFrame(loop);
    };
    animFrameRef.current=requestAnimationFrame(loop);
  }, [logoPreview,textInput,animationStyle,colorScheme,animationDuration,activeTab,drawFrame]);

  useEffect(()=>{
    startLivePreview();
    return()=>{if(animFrameRef.current)cancelAnimationFrame(animFrameRef.current);};
  },[startLivePreview]);

  // ---- RECORD REAL VIDEO ----
  const generateAnimation = async () => {
    const isText = activeTab==='text';
    if(!isText&&!logoPreview){showNotif('Please upload an image','error');return;}
    if(isText&&!textInput.trim()){showNotif('Please enter text','error');return;}

    setLoading(true); setAnimProgress(0);
    if(soundTiming==='start') playSound(selectedSound, soundVolume);

    const canvas = recordCanvasRef.current;
    const isTextAnim = isText;
    canvas.width = isTextAnim?700:500;
    canvas.height = isTextAnim?350:500;
    const ctx = canvas.getContext('2d');
    const fps=30, dur=animationDuration;
    const totalFrames=fps*dur;

    let img=null;
    if(!isTextAnim && logoPreview){
      img=await new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.src=logoPreview;});
    }

    // Use MediaRecorder to capture real video
    let videoBlob = null;
    try {
      const stream = canvas.captureStream(fps);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm' : 'video/mp4';

      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8000000 });
      const chunks = [];
      recorder.ondataavailable = e => { if(e.data.size>0) chunks.push(e.data); };

      const recordDone = new Promise(res => { recorder.onstop = ()=>{ videoBlob=new Blob(chunks,{type:mimeType}); res(); }; });

      recorder.start(100);

      // Animate + record
      await new Promise(resolve => {
        let frame=0;
        const midFrame = Math.floor(totalFrames*0.5);
        const render=()=>{
          drawFrame(ctx,img,textInput,frame,fps,dur,animationStyle,colorScheme,canvas.width,canvas.height,isTextAnim);
          setAnimProgress(Math.round((frame/totalFrames)*100));
          if(frame===midFrame && soundTiming==='beat') playSound(selectedSound,soundVolume);
          frame++;
          if(frame<totalFrames) setTimeout(render, 1000/fps);
          else resolve();
        };
        render();
      });

      recorder.stop();
      await recordDone;
    } catch(e){
      console.log('MediaRecorder error:',e);
      // Fallback: save as PNG
      drawFrame(ctx,img,textInput,Math.floor(totalFrames*0.4),fps,dur,animationStyle,colorScheme,canvas.width,canvas.height,isTextAnim);
    }

    if(soundTiming==='end') playSound(selectedSound,soundVolume);

    const url = videoBlob ? URL.createObjectURL(videoBlob) : canvas.toDataURL('image/png');
    const isVideo = !!videoBlob;
    const mimeExt = videoBlob ? (videoBlob.type.includes('mp4')?'mp4':'webm') : 'png';

    const animData={
      id:Date.now(), type:isText?'text':'logo',
      url, isVideo, mimeExt,
      blob:videoBlob,
      text:textInput,
      originalImage:isText?null:logoPreview,
      style:animationStyle, colorScheme,
      duration:dur,
      sound:enableSound?selectedSound:null,
      soundVolume, soundTiming,
      timestamp:new Date().toLocaleString(),
    };

    setCreatedAnimations(prev=>[animData,...prev]);
    setAnimationPreview(animData);
    setLoading(false); setAnimProgress(0);
    showNotif('🎉 Animation video ready!','success');
    playSound('chime',soundVolume);
  };

  const downloadAnimation = (anim) => {
    const link=document.createElement('a');
    if(anim.blob){
      link.href=URL.createObjectURL(anim.blob);
    } else {
      link.href=anim.url;
    }
    link.download=`brandflow-${anim.type}-${anim.id}.${anim.mimeExt}`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    playSound('chime',soundVolume);
    showNotif('Download started! 🎉','success');
  };

  const handleFileUpload=(e)=>{
    const file=e.target.files[0]; if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{setLogoPreview(ev.target.result);playSound('pop',soundVolume);};
    reader.readAsDataURL(file);
  };

  const saveDraft=()=>{
    setDrafts(prev=>[{id:Date.now(),type:activeTab,data:activeTab==='logo'?{preview:logoPreview}:{text:textInput},settings:{animationDuration,animationStyle,colorScheme,selectedSound,soundVolume},timestamp:new Date().toLocaleString()},...prev]);
    showNotif('Draft saved!');
  };

  const logoStyles=[['pulse','Pulse & Glow'],['rotate','Spin & Zoom'],['slide','Slide In'],['zoom','Zoom Burst'],['glitch','Glitch FX'],['neon','Neon Glow'],['float','Floating'],['spin3d','3D Flip']];
  const textStyles=[['elegant-fade','Elegant Fade'],['dynamic-slide','Dynamic Slide'],['typewriter','Typewriter'],['bouncy','Bouncy'],['glitch','Glitch FX'],['neon','Neon Glow'],['float','Float Up']];

  return (
    <div className={`min-h-screen ${colors.bg} transition-colors duration-300`}>
      <canvas ref={recordCanvasRef} style={{display:'none'}}/>

      {/* HEADER */}
      <header className={`${colors.surface} border-b ${colors.accentBorder} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-pink-600 w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl font-black">B</div>
            <div><h1 className={`text-2xl font-black ${colors.text}`}>BrandFlow Pro</h1><p className={`text-xs ${colors.textSecondary}`}>Professional Animation + Sound 🎵</p></div>
          </div>
          <div className="flex gap-2">
            {[[showSoundPanel,setShowSoundPanel,Music,'Sound'],[showSettings,setShowSettings,Settings,'Settings'],[showBrandKit,setShowBrandKit,BookMarked,'Kit']].map(([st,fn,Icon,t])=>(
              <button key={t} onClick={()=>fn(!st)} className={`p-2 rounded-lg border border-pink-600 ${colors.surface} hover:scale-110 transition-all`}><Icon className="w-5 h-5 text-pink-400"/></button>
            ))}
            <button onClick={()=>setDarkMode(!darkMode)} className={`p-2 rounded-lg border border-pink-600 ${colors.surface} hover:scale-110 transition-all`}>
              {darkMode?<Sun className="w-5 h-5 text-pink-400"/>:<Moon className="w-5 h-5 text-pink-600"/>}
            </button>
          </div>
        </div>
      </header>

      {notification&&(
        <div className={`fixed top-20 right-4 p-4 rounded-xl flex items-center gap-2 z-50 shadow-xl ${notification.type==='success'?'bg-green-500':'bg-red-500'} text-white`}>
          {notification.type==='success'?<CheckCircle size={20}/>:<AlertCircle size={20}/>}
          {notification.message}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* SOUND PANEL */}
        {showSoundPanel&&(
          <div className={`${colors.cardBg} rounded-2xl p-6 mb-6 border-2 border-pink-600`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${colors.text} flex items-center gap-2`}><Music size={20}/> Sound Library</h2>
              <button onClick={()=>setShowSoundPanel(false)} className={`text-2xl ${colors.textSecondary} hover:text-red-400`}>✕</button>
            </div>
            <div className={`${colors.surface} rounded-xl p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4`}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={enableSound} onChange={e=>setEnableSound(e.target.checked)} className="w-4 h-4 accent-pink-600"/>
                <span className={`${colors.text} font-semibold`}>Enable Sound</span>
              </label>
              <div><label className={`block ${colors.textSecondary} text-sm mb-1`}>Volume: {soundVolume}%</label><input type="range" min="0" max="100" value={soundVolume} onChange={e=>setSoundVolume(+e.target.value)} className="w-full"/></div>
              <div><label className={`block ${colors.textSecondary} text-sm mb-1`}>When to play</label>
                <select value={soundTiming} onChange={e=>setSoundTiming(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}>
                  <option value="start">At Start</option><option value="beat">On Beat</option><option value="end">At End</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(soundLibrary).map(([key,s])=>(
                <div key={key} onClick={()=>{setSelectedSound(key);playSound(key,soundVolume);setPlayingPreview(key);setTimeout(()=>setPlayingPreview(null),1200);}}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${selectedSound===key?'border-pink-600 bg-pink-600 bg-opacity-20':'border-neutral-600'}`}>
                  <div className="flex justify-between items-center mb-1"><span className={`${colors.text} font-bold text-xs`}>{s.name}</span>{playingPreview===key&&<span className="text-green-400 text-xs animate-bounce">▶</span>}</div>
                  <span className={`${colors.textSecondary} text-xs`}>{s.cat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {showSettings&&(
          <div className={`${colors.cardBg} rounded-2xl p-6 mb-6 border-2 border-pink-600`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${colors.text}`}>⚙️ Settings</h2>
              <button onClick={()=>setShowSettings(false)} className="text-2xl text-neutral-400 hover:text-red-400">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={`block ${colors.text} font-semibold mb-2 text-sm`}>Duration: {animationDuration}s</label><input type="range" min="2" max="8" value={animationDuration} onChange={e=>setAnimationDuration(+e.target.value)} className="w-full"/></div>
              <div>
                <label className={`block ${colors.text} font-semibold mb-2 text-sm`}>Filters</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(filters).map(([k,v])=>(
                    <div key={k}><label className={`${colors.textSecondary} text-xs block`}>{k}: {v}{k==='glow'?'px':'%'}</label><input type="range" min="0" max={k==='glow'?30:200} value={v} onChange={e=>setFilters(f=>({...f,[k]:+e.target.value}))} className="w-full"/></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BRAND KIT */}
        {showBrandKit&&(
          <div className={`${colors.cardBg} rounded-2xl p-6 mb-6 border-2 border-pink-600`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${colors.text}`}>🎨 Branding Kit</h2>
              <button onClick={()=>setShowBrandKit(false)} className="text-2xl text-neutral-400 hover:text-red-400">✕</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className={`${colors.surface} rounded-xl p-4`}>
                <input type="text" value={brandingKit.name} onChange={e=>setBrandingKit(k=>({...k,name:e.target.value}))} placeholder="Kit Name" className={`w-full px-3 py-2 rounded border ${colors.input} mb-3 text-sm`}/>
                <div className="flex gap-2 mb-3">
                  <div className="flex-1"><label className={`${colors.textSecondary} text-xs`}>Primary</label><input type="color" value={brandingKit.primaryColor} onChange={e=>setBrandingKit(k=>({...k,primaryColor:e.target.value}))} className="w-full h-10 rounded cursor-pointer"/></div>
                  <div className="flex-1"><label className={`${colors.textSecondary} text-xs`}>Secondary</label><input type="color" value={brandingKit.secondaryColor} onChange={e=>setBrandingKit(k=>({...k,secondaryColor:e.target.value}))} className="w-full h-10 rounded cursor-pointer"/></div>
                </div>
                <button onClick={()=>{setBrandingKits(k=>[...k,{...brandingKit,id:Date.now()}]);showNotif('Kit saved!');}} className="w-full py-2 rounded-lg text-white font-bold text-sm bg-pink-600 hover:bg-pink-700 flex items-center justify-center gap-2"><Plus size={14}/>Save Kit</button>
              </div>
              <div className={`${colors.surface} rounded-xl p-4`}>
                <p className={`${colors.text} font-bold mb-2`}>Saved ({brandingKits.length})</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {brandingKits.map(k=>(
                    <div key={k.id} className={`${colors.cardBg} p-2 rounded flex items-center justify-between`}>
                      <div className="flex items-center gap-2"><div className="w-6 h-6 rounded" style={{background:`linear-gradient(135deg,${k.primaryColor},${k.secondaryColor})`}}/><span className={`${colors.text} text-sm`}>{k.name}</span></div>
                      <button onClick={()=>setBrandingKits(bk=>bk.filter(x=>x.id!==k.id))} className="text-red-400"><Trash2 size={14}/></button>
                    </div>
                  ))}
                  {brandingKits.length===0&&<p className={`${colors.textSecondary} text-sm`}>No kits yet</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['logo','text'].map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab===tab?'bg-pink-600 text-white shadow-lg shadow-pink-600/30':`${colors.cardBg} ${colors.text} hover:scale-105`}`}>
              {tab==='logo'?<><Upload className="w-5 h-5 inline mr-2"/>Logo Animator</>:<><Type className="w-5 h-5 inline mr-2"/>Text Animator</>}
            </button>
          ))}
          <button onClick={()=>setShowGallery(!showGallery)} className={`px-6 py-3 rounded-xl font-bold transition-all ml-auto ${colors.cardBg} ${colors.text} hover:scale-105`}>📸 Gallery ({createdAnimations.length})</button>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT: Controls */}
          <div className={`${colors.cardBg} rounded-2xl p-8`}>
            <h2 className={`text-2xl font-black ${colors.text} mb-6`}>{activeTab==='logo'?'📸 Upload Logo':'✍️ Enter Text'}</h2>

            {activeTab==='logo'?(
              <div onClick={()=>fileInputRef.current?.click()} className="border-2 border-dashed border-pink-500 rounded-2xl p-8 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-600 hover:bg-opacity-5 transition-all min-h-52 flex items-center justify-center mb-4">
                {logoPreview
                  ? <img src={logoPreview} alt="Logo" className="max-h-48 mx-auto rounded-xl shadow-xl" style={{filter:`brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) drop-shadow(0 0 ${filters.glow}px #ec4899)`}}/>
                  : <div><Upload className="w-16 h-16 text-pink-500 mx-auto mb-3"/><p className={`${colors.text} font-bold text-lg`}>Click to upload</p><p className={`${colors.textSecondary} text-sm`}>PNG, JPG, SVG — any logo</p></div>
                }
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden"/>
              </div>
            ):(
              <div className="mb-4">
                <input type="text" value={textInput} onChange={e=>setTextInput(e.target.value)} placeholder="Your Brand Name..." maxLength="18"
                  className={`w-full px-5 py-4 rounded-xl border-2 border-pink-600 ${colors.input} text-2xl font-black focus:outline-none focus:ring-4 focus:ring-pink-600 focus:ring-opacity-30 mb-2`}/>
                <p className={`${colors.textSecondary} text-sm`}>{textInput.length}/18 characters</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className={`block ${colors.text} font-bold mb-2 text-sm uppercase tracking-wide`}>Animation Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {(activeTab==='logo'?logoStyles:textStyles).map(([v,l])=>(
                    <button key={v} onClick={()=>setAnimationStyle(v)} className={`py-2 px-3 rounded-xl text-sm font-semibold transition-all ${animationStyle===v?'bg-pink-600 text-white shadow-lg':'bg-opacity-20 border border-pink-600 border-opacity-30'} ${colors.text}`}>{l}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block ${colors.text} font-bold mb-2 text-sm uppercase tracking-wide`}>Color Theme</label>
                <div className="flex gap-2">
                  {Object.entries(colorSchemes).map(([key,s])=>(
                    <button key={key} onClick={()=>setColorScheme(key)} className={`flex-1 h-12 rounded-xl border-3 transition-all ${colorScheme===key?'border-white scale-110 shadow-lg':'border-transparent opacity-70'}`} style={{background:`linear-gradient(135deg,${s[0]},${s[2]})`,borderWidth:colorScheme===key?3:2,borderColor:colorScheme===key?'white':'transparent'}}>
                      {colorScheme===key&&<span className="text-white font-black text-sm">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`${colors.surface} p-3 rounded-xl flex items-center justify-between`}>
                <span className={`${colors.text} text-sm font-semibold`}>🎵 {enableSound?soundLibrary[selectedSound]?.name:'Sound Off'}</span>
                <button onClick={()=>setShowSoundPanel(true)} className="text-xs text-pink-400 underline font-semibold">Change Sound</button>
              </div>

              {loading&&(
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className={colors.textSecondary}>Recording video...</span><span className="text-pink-400 font-bold">{animProgress}%</span></div>
                  <div className="w-full bg-neutral-700 rounded-full h-3"><div className="bg-gradient-to-r from-pink-600 to-purple-600 h-3 rounded-full transition-all duration-200" style={{width:`${animProgress}%`}}/></div>
                </div>
              )}

              <button onClick={generateAnimation} disabled={loading||(activeTab==='logo'?!logoPreview:!textInput.trim())}
                className={`w-full py-4 rounded-xl font-black text-white text-lg flex items-center justify-center gap-3 transition-all shadow-xl ${!loading&&(activeTab==='logo'?logoPreview:textInput.trim())?'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-pink-600/30 hover:scale-105':'bg-gray-600 cursor-not-allowed opacity-50'}`}>
                {loading?<><Loader className="w-6 h-6 animate-spin"/>Recording... {animProgress}%</>:<>✨ Generate Animation + Sound</>}
              </button>

              <button onClick={saveDraft} className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 transition-all">
                <Save size={18}/> Save Draft
              </button>
            </div>
          </div>

          {/* RIGHT: Preview */}
          <div className={`${colors.cardBg} rounded-2xl p-8`}>
            <h2 className={`text-2xl font-black ${colors.text} mb-4`}>{animationPreview?'🎬 Your Animation':'👁️ Live Preview'}</h2>

            {animationPreview?(
              <div className="space-y-4">
                <div className="bg-black rounded-2xl overflow-hidden">
                  {animationPreview.isVideo?(
                    <video src={animationPreview.url} autoPlay loop muted playsInline className="w-full rounded-2xl" style={{maxHeight:'320px'}}/>
                  ):(
                    <img src={animationPreview.url} alt="Result" className="w-full rounded-2xl" style={{maxHeight:'320px',objectFit:'contain'}}/>
                  )}
                </div>
                <div className={`${colors.surface} p-3 rounded-xl text-sm`}>
                  <p className={colors.textSecondary}><strong>Style:</strong> {animationPreview.style} | <strong>Duration:</strong> {animationPreview.duration}s | <strong>Format:</strong> {animationPreview.mimeExt.toUpperCase()}</p>
                  {animationPreview.sound&&<p className={`${colors.textSecondary} mt-1`}><strong>🎵</strong> {soundLibrary[animationPreview.sound]?.name} @ {animationPreview.soundVolume}%</p>}
                </div>
                <button onClick={()=>downloadAnimation(animationPreview)} className="w-full py-4 rounded-xl font-black text-white flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition-all shadow-xl shadow-pink-600/30 hover:scale-105">
                  <Download className="w-5 h-5"/> Download Animation ({animationPreview.mimeExt.toUpperCase()})
                </button>
                <button onClick={()=>setAnimationPreview(null)} className={`w-full py-3 rounded-xl text-sm font-bold ${colors.surface} ${colors.text} hover:opacity-80`}>← New Animation</button>
              </div>
            ):(
              <div className="bg-black rounded-2xl overflow-hidden relative" style={{minHeight:'320px'}}>
                <canvas ref={liveCanvasRef} style={{width:'100%',height:'auto',display:'block',borderRadius:'16px'}}/>
                {!logoPreview&&!textInput&&(
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-6xl mb-4">✨</div>
                    <p className="text-neutral-400 text-center px-6 font-semibold">Upload a logo or type text to see live animation preview</p>
                  </div>
                )}
                {(logoPreview||textInput)&&(
                  <div className="absolute bottom-3 right-3 bg-pink-600 text-white text-xs px-2 py-1 rounded-lg animate-pulse">● LIVE</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* GALLERY */}
        {showGallery&&(
          <div className="mt-12">
            <h2 className={`text-3xl font-black ${colors.text} mb-6`}>📸 Created Animations</h2>
            {createdAnimations.length===0
              ? <div className={`${colors.cardBg} rounded-2xl p-12 text-center`}><p className={colors.textSecondary}>No animations yet! Create your first one ✨</p></div>
              : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {createdAnimations.map(anim=>(
                    <div key={anim.id} className={`${colors.cardBg} rounded-2xl overflow-hidden hover:scale-105 transition-all shadow-xl`}>
                      <div className="bg-black aspect-video flex items-center justify-center overflow-hidden">
                        {anim.isVideo
                          ? <video src={anim.url} autoPlay loop muted playsInline className="w-full h-full object-cover"/>
                          : <img src={anim.url} alt="Anim" className="w-full h-full object-cover"/>
                        }
                      </div>
                      <div className="p-4">
                        <p className={`${colors.text} font-bold`}>{anim.type==='logo'?'🖼️ Logo Animation':`📝 ${anim.text}`}</p>
                        <p className={`${colors.textSecondary} text-xs mb-1`}>{anim.timestamp}</p>
                        {anim.sound&&<p className="text-pink-400 text-xs mb-3">🎵 {soundLibrary[anim.sound]?.name}</p>}
                        <button onClick={()=>downloadAnimation(anim)} className="w-full py-2 rounded-xl text-white text-sm font-bold bg-pink-600 hover:bg-pink-500 transition-all">
                          <Download className="w-4 h-4 inline mr-1"/> Download {anim.mimeExt.toUpperCase()}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* DRAFTS */}
        {drafts.length>0&&(
          <div className="mt-8">
            <h2 className={`text-2xl font-black ${colors.text} mb-4`}>💾 Drafts</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {drafts.map(d=>(
                <div key={d.id} className={`${colors.cardBg} rounded-xl p-4`}>
                  <p className={`${colors.text} font-bold text-sm mb-1`}>{d.type==='logo'?'🖼️ Logo':'📝 Text'}</p>
                  <p className={`${colors.textSecondary} text-xs mb-3`}>{d.timestamp}</p>
                  <div className="flex gap-2">
                    <button onClick={()=>{if(d.type==='logo')setLogoPreview(d.data.preview);else setTextInput(d.data.text);setActiveTab(d.type);showNotif('Loaded!');}} className="flex-1 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold">Load</button>
                    <button onClick={()=>setDrafts(dr=>dr.filter(x=>x.id!==d.id))} className="flex-1 py-1 bg-red-600 text-white rounded-lg text-xs font-bold">Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className={`${colors.surface} border-t border-pink-600 mt-16 py-8 text-center`}>
        <p className={colors.textSecondary}>Made with ❤️ for brand creators</p>
        <p className="text-xs text-pink-500 mt-1 font-bold">BrandFlow Pro — Real Video Animation + Professional Sound 🎵</p>
      </footer>
    </div>
  );
};

export default BrandFlowAdvanced;
