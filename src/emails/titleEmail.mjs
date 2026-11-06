// Plantilla de correo de un título (película, serie o animé). HTML para clientes de correo:
// tablas e estilos en línea (Gmail y Outlook ignoran CSS moderno, variables y flexbox).
// variant: 'pelibox' (tema Noche) | 'anime' (índigo, magenta y cian).

const THEMES = {
  pelibox: {
    bg: '#0b0c10', surface: '#16171d', surface2: '#20212a', fg: '#f4f0ea', muted: '#a8a4a0', line: '#2a2b33',
    accent: '#f0805a', accentFg: '#ffffff', second: '#f4c06a', kicker: 'PELIBOX · RECOMENDACIÓN', kana: '',
    font: "'Bricolage Grotesque','Segoe UI',Helvetica,Arial,sans-serif",
  },
  anime: {
    bg: '#0a0716', surface: '#15102a', surface2: '#211a3d', fg: '#f3eeff', muted: '#b3a9cf', line: '#2c2450',
    accent: '#ff3d9a', accentFg: '#ffffff', second: '#4de8ff', kicker: 'PELIBOX ANIMÉ · 今期', kana: 'アニメ',
    font: "'Dela Gothic One','Segoe UI',Helvetica,Arial,sans-serif",
  },
};

const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/**
 * t: { id, type, title, year, synopsis, tagline, genres: [texto], rating, backdrop, image, minutes, seasons,
 *      trailerKey, providers: [{ name, logo }] }
 */
export function titleEmail(t, { variant = 'pelibox', appUrl = 'https://moviesconv2.netlify.app', recipientName = '' } = {}) {
  const c = THEMES[variant] ?? THEMES.pelibox;
  const pageUrl = `${appUrl}/titulo/${t.id}`;
  const trailerUrl = t.trailerKey ? `https://www.youtube.com/watch?v=${t.trailerKey}` : pageUrl;
  const kind = t.type === 'series' ? 'Serie' : 'Película';
  const meta = [kind, t.year, t.type === 'series' && t.seasons ? `${t.seasons} temporadas` : t.minutes ? `${Math.floor(t.minutes / 60)} h ${String(t.minutes % 60).padStart(2, '0')}` : null]
    .filter(Boolean).join(' · ');
  const subject = variant === 'anime' ? `🎌 ${t.title} te espera en PeliBox Animé` : `🍿 ${t.title}: tu próxima función en PeliBox`;
  const hello = recipientName ? `Hola, ${esc(recipientName)}.` : 'Hola.';
  const pills = (t.genres ?? []).slice(0, 3).map((g) =>
    `<span style="display:inline-block;margin:0 6px 6px 0;padding:5px 12px;border-radius:999px;background:${c.surface2};border:1px solid ${c.line};color:${c.fg};font-size:12px;font-weight:600;">${esc(g)}</span>`).join('');
  const providers = (t.providers ?? []).slice(0, 4).map((p) =>
    `<td style="padding:0 10px 0 0;"><table role="presentation" cellpadding="0" cellspacing="0"><tr>
      ${p.logo ? `<td style="padding-right:8px;"><img src="${p.logo}" width="28" height="28" alt="" style="display:block;border-radius:8px;"></td>` : ''}
      <td style="color:${c.fg};font-size:13px;font-weight:600;white-space:nowrap;">${esc(p.name)}</td></tr></table></td>`).join('');
  const speedLines = variant === 'anime'
    ? `background-image:repeating-linear-gradient(115deg, rgba(255,255,255,.035) 0 2px, transparent 2px 18px);`
    : '';

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${esc(subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Dela+Gothic+One&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${c.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(t.tagline || t.synopsis || '').slice(0, 120)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${c.bg};${speedLines}">
<tr><td align="center" style="padding:28px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;font-family:Helvetica,Arial,sans-serif;color:${c.fg};">

    <!-- Marca -->
    <tr><td style="padding:0 4px 18px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-family:${c.font};font-size:26px;font-weight:800;letter-spacing:-0.5px;color:${c.fg};">Peli<span style="color:${c.accent};">Box</span>${c.kana ? ` <span style="font-size:14px;padding:3px 8px;background:${c.accent};color:#fff;border-radius:4px;">${c.kana}</span>` : ''}</td>
        <td align="right" style="font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;letter-spacing:1.5px;color:${c.muted};">${c.kicker}</td>
      </tr></table>
    </td></tr>

    <!-- Tarjeta -->
    <tr><td style="background:${c.surface};border:1px solid ${c.line};border-radius:24px;overflow:hidden;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${t.backdrop ? `<tr><td style="line-height:0;"><a href="${pageUrl}"><img src="${t.backdrop}" width="600" alt="${esc(t.title)}" style="display:block;width:100%;height:auto;border-radius:24px 24px 0 0;"></a></td></tr>` : ''}
        <tr><td style="height:4px;background:${c.accent};background-image:linear-gradient(90deg, ${c.accent}, ${c.second});line-height:4px;font-size:0;">&nbsp;</td></tr>
        <tr><td style="padding:28px 28px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            ${t.image ? `<td width="120" valign="top" style="padding-right:20px;"><img src="${t.image}" width="120" alt="" style="display:block;width:120px;border-radius:14px;box-shadow:0 12px 30px rgba(0,0,0,.5);"></td>` : ''}
            <td valign="top">
              <p style="margin:0 0 8px;font-size:15px;color:${c.muted};">${hello} Esta noche te proponemos:</p>
              <h1 style="margin:0 0 8px;font-family:${c.font};font-size:30px;line-height:1.05;font-weight:800;letter-spacing:-0.5px;color:${c.fg};">${esc(t.title)}</h1>
              <p style="margin:0 0 12px;font-size:13px;color:${c.muted};">${esc(meta)}${t.rating ? ` · <span style="color:${c.second};font-weight:700;">★ ${t.rating}</span>` : ''}</p>
              <div>${pills}</div>
            </td>
          </tr></table>
        </td></tr>
        ${t.tagline ? `<tr><td style="padding:8px 28px 0;font-family:${c.font};font-size:18px;font-style:italic;color:${c.second};">“${esc(t.tagline)}”</td></tr>` : ''}
        <tr><td style="padding:14px 28px 6px;font-size:15px;line-height:1.6;color:${c.fg};">${esc(t.synopsis || '')}</td></tr>

        <!-- Botones -->
        <tr><td style="padding:18px 28px 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="border-radius:999px;background:${c.accent};"><a href="${pageUrl}" style="display:inline-block;padding:14px 26px;font-size:15px;font-weight:700;color:${c.accentFg};text-decoration:none;border-radius:999px;">Ver en PeliBox →</a></td>
            <td width="10"></td>
            <td style="border-radius:999px;border:1px solid ${c.line};background:${c.surface2};"><a href="${trailerUrl}" style="display:inline-block;padding:13px 22px;font-size:15px;font-weight:700;color:${c.fg};text-decoration:none;border-radius:999px;">▶ Tráiler</a></td>
          </tr></table>
        </td></tr>

        ${providers ? `<!-- Dónde verla -->
        <tr><td style="padding:16px 28px 26px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${c.surface2};border:1px solid ${c.line};border-radius:16px;">
            <tr><td style="padding:14px 16px 6px;font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;letter-spacing:1.5px;color:${c.muted};">DÓNDE VERLA EN COLOMBIA</td></tr>
            <tr><td style="padding:4px 16px 14px;"><table role="presentation" cellpadding="0" cellspacing="0"><tr>${providers}</tr></table></td></tr>
          </table>
        </td></tr>` : '<tr><td style="height:22px;"></td></tr>'}
      </table>
    </td></tr>

    <!-- Pie -->
    <tr><td style="padding:22px 8px 0;font-size:12px;line-height:1.6;color:${c.muted};text-align:center;">
      Recibes este correo porque usas PeliBox. Lo que viste. Lo que vas a ver.<br>
      Datos e imágenes de <a href="https://www.themoviedb.org/" style="color:${c.muted};">TMDB</a>. Este producto usa la API de TMDB pero no está respaldado ni certificado por TMDB.
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = `${t.title} (${meta})\n\n${t.synopsis ?? ''}\n\nVer en PeliBox: ${pageUrl}\nTráiler: ${trailerUrl}`;
  return { subject, html, text };
}
