'use client';
// Efectos de sonido sintetizados con Web Audio (sin archivos de audio).
// El navegador solo deja sonar después de que la persona interactuó con la página;
// si no hay permiso, simplemente no suena.

let ctx = null;
function audio() {
  if (typeof window === 'undefined') return null;
  ctx ??= new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function noise(ac, seconds) {
  const buffer = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  return src;
}

function envelope(ac, at, peak, attack, decay) {
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
  return g;
}

/** Sonido de la marca (intro de perfiles): “ta-dum” — dos golpes graves y un brillo que se abre. */
export async function playBrandSting({ at = 0.55, volume = 0.45 } = {}) {
  const ac = audio();
  if (!ac) return false;
  try { if (ac.state === 'suspended') await ac.resume(); } catch { return false; }
  if (ac.state !== 'running') return false;

  const master = ac.createGain();
  master.gain.value = volume;
  master.connect(ac.destination);
  const t0 = ac.currentTime + at;

  // Golpe grave con caída de tono (cuerpo) + un poco de ruido filtrado (ataque).
  const hit = (when, from, to, length, gain) => {
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(from, when);
    osc.frequency.exponentialRampToValueAtTime(to, when + length);
    osc.connect(envelope(ac, when, gain, 0.008, length)).connect(master);
    osc.start(when);
    osc.stop(when + length + 0.1);
    const click = noise(ac, 0.08);
    const low = ac.createBiquadFilter();
    low.type = 'lowpass';
    low.frequency.value = 900;
    click.connect(low).connect(envelope(ac, when, gain * 0.35, 0.003, 0.07)).connect(master);
    click.start(when);
  };
  hit(t0, 95, 48, 0.45, 0.9);          // ta-
  hit(t0 + 0.34, 120, 42, 1.1, 1.0);   // -dum (más largo)

  // Brillo: acorde suave que se abre con el segundo golpe.
  [261.6, 392, 523.3].forEach((f, i) => {
    const osc = ac.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = f;
    osc.connect(envelope(ac, t0 + 0.34, 0.07 / (i + 1), 0.25, 1.6)).connect(master);
    osc.start(t0 + 0.34);
    osc.stop(t0 + 2.3);
  });
  return true;
}

/** Efecto de animé: barrido de aire → “shing” de katana → golpe grave. offset: segundos hasta el corte. */
export async function playAnimeSting({ offset = 0.45, volume = 0.35 } = {}) {
  const ac = audio();
  if (!ac) return false;
  try { if (ac.state === 'suspended') await ac.resume(); } catch { return false; }
  if (ac.state !== 'running') return false;

  const master = ac.createGain();
  master.gain.value = volume;
  master.connect(ac.destination);
  const t0 = ac.currentTime + 0.02;
  const cut = t0 + offset;

  // 1. Barrido de aire que sube hasta el corte.
  const whoosh = noise(ac, offset + 0.1);
  const band = ac.createBiquadFilter();
  band.type = 'bandpass';
  band.Q.value = 1.2;
  band.frequency.setValueAtTime(300, t0);
  band.frequency.exponentialRampToValueAtTime(5000, cut);
  whoosh.connect(band).connect(envelope(ac, t0, 0.5, offset * 0.8, 0.15)).connect(master);
  whoosh.start(t0);

  // 2. “Shing”: parciales metálicos agudos con caída larga.
  [2093, 3136, 4186, 5274].forEach((f, i) => {
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f * 1.02, cut);
    osc.frequency.exponentialRampToValueAtTime(f, cut + 0.08);
    osc.connect(envelope(ac, cut, 0.22 / (i + 1), 0.005, 1.1 - i * 0.15)).connect(master);
    osc.start(cut);
    osc.stop(cut + 1.4);
  });
  const sparkle = noise(ac, 0.3);
  const high = ac.createBiquadFilter();
  high.type = 'highpass';
  high.frequency.value = 6000;
  sparkle.connect(high).connect(envelope(ac, cut, 0.3, 0.003, 0.25)).connect(master);
  sparkle.start(cut);

  // 3. Golpe grave (tipo taiko) al aparecer el sello.
  const hit = cut + 0.32;
  const kick = ac.createOscillator();
  kick.type = 'sine';
  kick.frequency.setValueAtTime(140, hit);
  kick.frequency.exponentialRampToValueAtTime(42, hit + 0.35);
  kick.connect(envelope(ac, hit, 0.9, 0.005, 0.45)).connect(master);
  kick.start(hit);
  kick.stop(hit + 0.6);
  return true;
}
