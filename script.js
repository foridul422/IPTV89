const CHANNELS = [
  {
    "name": "FIFA World Cup 2026🅱️",
    "url": "https://tvsen7.aynaott.com/tsports-hd/tracks-v1a1/mono.ts.m3u8"
  },
  {
    "name": "FIFA World Cup 2026",
    "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1709/output/index.m3u8"
  },
  {
    "name": "FIFA World Cup 2026",
    "url": "https://owrcovcrpy.gpcdn.net/bpk-tv/1702/output/1702-audio_113322_eng=113200-video=2202800.m3u8"
  },
  {
    "name": "FIFA World Cup 2026 🇦🇷[coming]",
    "url": "http://cdn.tv-rds.workers.dev/TYCSPT.m3u8"
  },
  {
    "name": "FIFA World Cup 2026 🇧🇷[coming]",
    "url": "https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/1080p-vtt/index.m3u8"
  },
  {
    "name": "FIFA World Cup 2026 🇮🇳[coming]",
    "url": "http://66.102.126.10:8000/play/a076/index.m3u8"
  },
  {
    "name": "FIFA World Cup 2026 🇮🇳[coming]",
    "url": "http://66.102.126.10:8000/play/a022/index.m3u8"
  }
];

const video = document.getElementById('video');
const channelsEl = document.getElementById('channels');
const nowTitle = document.getElementById('nowTitle');
const statusEl = document.getElementById('status');
const searchEl = document.getElementById('search');
const muteBtn = document.getElementById('muteBtn');
let hls;

function setStatus(text, error=false){
  statusEl.textContent = text;
  statusEl.className = error ? 'error' : '';
}

function play(ch, btn){
  document.querySelectorAll('.channel').forEach(b => b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  nowTitle.textContent = ch.name;
  setStatus('Loading stream...');

  if(hls){ hls.destroy(); hls = null; }

  if(window.Hls && Hls.isSupported()){
    hls = new Hls({ enableWorker:true, lowLatencyMode:true });
    hls.loadSource(ch.url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(()=>{});
      setStatus('Live stream ready.');
    });
    hls.on(Hls.Events.ERROR, (_, data) => {
      if(data.fatal) setStatus('এই stream চালু হচ্ছে না। অন্য channel try করুন।', true);
    });
  } else if(video.canPlayType('application/vnd.apple.mpegurl')){
    video.src = ch.url;
    video.play().catch(()=>{});
    setStatus('Live stream ready.');
  } else {
    setStatus('এই browser HLS support করে না। Chrome/Edge/Safari try করুন।', true);
  }
}

function render(list){
  channelsEl.innerHTML = '';
  list.forEach((ch, idx) => {
    const btn = document.createElement('button');
    btn.className = 'channel';
    btn.innerHTML = `<strong>${ch.name}</strong><span>${ch.url}</span>`;
    btn.onclick = () => play(ch, btn);
    channelsEl.appendChild(btn);
    if(idx === 0 && !hls && !video.src) setTimeout(() => play(ch, btn), 200);
  });
  setStatus(`${CHANNELS.length} টি channel ready.`);
}

searchEl.addEventListener('input', () => {
  const q = searchEl.value.toLowerCase();
  render(CHANNELS.filter(c => c.name.toLowerCase().includes(q)));
});

muteBtn.onclick = () => {
  video.muted = !video.muted;
  muteBtn.textContent = video.muted ? 'Unmute' : 'Mute';
};

render(CHANNELS);
