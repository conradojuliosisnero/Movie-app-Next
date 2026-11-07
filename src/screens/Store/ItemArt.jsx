// Arte de los coleccionables de PeliBox. Se escala solo con el contenedor (unidades cqh).
// Uso: <ItemArt itemId="estreno" />  — el padre debe tener tamaño (p. ej. aspect-ratio 4/3).

const DISP = 'var(--font-display)';
const MONO = 'var(--font-mono)';

const KEYFRAMES = `
@keyframes pbCredits{from{transform:translateY(0)}to{transform:translateY(-50%)}}
@keyframes pbPop{0%,100%{transform:translateY(0)}45%{transform:translateY(-1.6cqh)}55%{transform:translateY(-9cqh) rotate(25deg)}}
@keyframes pbFlicker{0%,100%,44%,50%{opacity:1}46%{opacity:.35}48%{opacity:.85}}
@keyframes pbSpin{to{transform:rotate(360deg)}}
@keyframes pbRain{to{background-position:-40px 160px}}
`;

const fill = (bg, extra) => ({
  position: "absolute", inset: 0, background: bg, overflow: "hidden",
  display: "flex", alignItems: "center", justifyContent: "center", ...extra,
});
const abs = (s) => ({ position: "absolute", ...s });

const WALL = "radial-gradient(circle at 50% 30%, #2c2622, #141211 72%)";
const FELT = "radial-gradient(circle at 50% 40%, #26252b, #121215 75%)";

function Avatar({ size = "34cqh", ring }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#7fd3e8", position: "relative", flexShrink: 0, boxShadow: ring }}>
      <span style={abs({ left: "31%", top: "40%", width: "10%", height: "15%", borderRadius: 99, background: "#14303a" })} />
      <span style={abs({ right: "31%", top: "40%", width: "10%", height: "15%", borderRadius: 99, background: "#14303a" })} />
    </div>
  );
}

function Poster({ bg, rotate = -2, children }) {
  return (
    <div style={{ height: "84%", aspectRatio: "2 / 3", background: bg, borderRadius: 3, transform: `rotate(${rotate}deg)`, boxShadow: "0 1.4cqh 3cqh rgba(0,0,0,.6)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", padding: "6cqh 5cqh" }}>
      {children}
    </div>
  );
}

function Pin({ bg, children }) {
  return (
    <div style={{ height: "70%", aspectRatio: "1", borderRadius: "50%", background: bg, border: "2.4cqh solid #d8b277", boxShadow: "0 1.6cqh 3cqh rgba(0,0,0,.6), inset 0 0 0 .6cqh rgba(0,0,0,.25), inset 0 2cqh 3cqh rgba(255,255,255,.14)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {children}
    </div>
  );
}

function ProfileRow({ children }) {
  return (
    <div style={fill("linear-gradient(180deg,#18181c,#101013)")}>
      <div style={{ display: "flex", alignItems: "center", gap: "5cqh", padding: "5cqh 7cqh", background: "#1c1c21", border: ".5cqh solid #2c2c33", borderRadius: "5cqh", boxShadow: "0 2cqh 4cqh rgba(0,0,0,.4)" }}>
        <Avatar size="22cqh" />
        <div style={{ display: "flex", flexDirection: "column", gap: "2cqh" }}>
          <span style={{ fontFamily: DISP, fontWeight: 800, fontSize: "9cqh", color: "#f2efea", lineHeight: 1 }}>Julio</span>
          {children}
        </div>
      </div>
    </div>
  );
}

function Face({ bg, eye = "#1a1208", mouth, size = "26cqh", children }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, position: "relative" }}>
      <span style={abs({ left: "28%", top: "34%", width: "13%", height: "18%", borderRadius: 99, background: eye })} />
      <span style={abs({ right: "28%", top: "34%", width: "13%", height: "18%", borderRadius: 99, background: eye })} />
      {mouth}
      {children}
    </div>
  );
}

const ART = {
  estreno: () => (
    <div style={fill(WALL)}>
      <Poster bg="linear-gradient(170deg,#ff7a45,#b8301a)">
        <span style={{ fontFamily: MONO, fontSize: "3cqh", letterSpacing: ".2em", color: "#3a1206" }}>PELIBOX PRESENTA</span>
        <span style={{ marginTop: "auto", fontFamily: DISP, fontWeight: 900, fontStretch: "68%", fontSize: "10.5cqh", lineHeight: 0.86, color: "#fff4ea", textTransform: "uppercase" }}>Noche<br />de<br />estreno</span>
        <span style={{ marginTop: "3cqh", fontSize: "3.4cqh", color: "#f5c04a", letterSpacing: ".25em" }}>★★★★★</span>
      </Poster>
    </div>
  ),

  doble: () => (
    <div style={fill(WALL)}>
      <Poster bg="linear-gradient(158deg,#6ab8e6 0 50%,#c79be8 50%)" rotate={2}>
        <span style={{ fontFamily: DISP, fontWeight: 900, fontStretch: "68%", fontSize: "11cqh", lineHeight: 0.9, color: "#0f1a24" }}>DOBLE</span>
        <span style={{ alignSelf: "center", margin: "auto 0", width: "16cqh", height: "16cqh", borderRadius: "50%", background: "#141417", color: "#f2efea", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISP, fontWeight: 900, fontSize: "6cqh" }}>2×1</span>
        <span style={{ alignSelf: "flex-end", fontFamily: DISP, fontWeight: 900, fontStretch: "68%", fontSize: "11cqh", lineHeight: 0.9, color: "#22122c" }}>FUNCIÓN</span>
        <span style={abs({ left: "5cqh", bottom: "3cqh", fontFamily: MONO, fontSize: "2.6cqh", color: "#22122c" })}>Nº 07/40</span>
      </Poster>
    </div>
  ),

  vhs: () => (
    <div style={fill(WALL)}>
      <Poster bg="#ece6da" rotate={-1}>
        <span style={{ fontFamily: MONO, fontSize: "3cqh", letterSpacing: ".18em", color: "#1c1916" }}>SÉ AMABLE</span>
        <div style={{ marginTop: "4cqh", width: "100%", aspectRatio: "1.6", background: "#161616", borderRadius: "1.5cqh", position: "relative" }}>
          <div style={abs({ left: "8%", right: "8%", top: "10%", height: "28%", background: "#f5c04a", borderRadius: ".6cqh" })} />
          <div style={abs({ left: "18%", top: "52%", width: "20%", aspectRatio: "1", borderRadius: "50%", border: "1cqh solid #ece6da" })} />
          <div style={abs({ right: "18%", top: "52%", width: "20%", aspectRatio: "1", borderRadius: "50%", border: "1cqh solid #ece6da" })} />
        </div>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: ".8cqh" }}>
          {["#ff6a3d", "#f5c04a", "#6ab8e6", "#c79be8"].map((c) => <span key={c} style={{ height: "1.6cqh", background: c }} />)}
        </div>
        <span style={{ marginTop: "2.5cqh", fontFamily: DISP, fontWeight: 900, fontStretch: "70%", fontSize: "7cqh", color: "#1c1916", lineHeight: 1 }}>REBOBINA</span>
      </Poster>
    </div>
  ),

  butaca: () => (
    <div style={fill("radial-gradient(circle at 50% 35%,#4a1410,#170807 75%)")}>
      <div style={{ position: "relative", width: "50cqh", height: "60cqh", display: "flex", justifyContent: "center" }}>
        <div style={abs({ inset: "0 4cqh 10cqh", borderRadius: "22cqh 22cqh 4cqh 4cqh", background: "linear-gradient(180deg,#c8352a,#8e1e16)", boxShadow: "inset 0 -2cqh 0 rgba(0,0,0,.25)" })} />
        <div style={abs({ left: 0, right: 0, bottom: 0, height: "16cqh", borderRadius: "3cqh", background: "#a82a20", boxShadow: "inset 0 1cqh 0 rgba(255,255,255,.12)" })} />
        <div style={{ position: "relative", marginTop: "8cqh" }}>
          <Avatar size="30cqh" ring="0 0 0 1.2cqh #f5c04a, 0 0 0 2.4cqh #5a1510" />
        </div>
      </div>
    </div>
  ),

  neon: () => (
    <div style={fill("#0a0a12")}>
      <style>{KEYFRAMES}</style>
      <div style={{ animation: "pbFlicker 4s infinite", borderRadius: "50%" }}>
        <Avatar size="40cqh" ring="0 0 0 1.2cqh #ff4fd8, 0 0 5cqh 1.5cqh rgba(255,79,216,.6), 0 0 0 3.2cqh #0a0a12, 0 0 0 4cqh #4fe3ff, 0 0 7cqh 3cqh rgba(79,227,255,.35)" />
      </div>
    </div>
  ),

  rebobinar: () => (
    <div style={fill(FELT)}>
      <style>{KEYFRAMES}</style>
      <div style={{ position: "relative", width: "56cqh", height: "56cqh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={abs({ inset: 0, borderRadius: "50%", border: "2.6cqh dashed #6b5642", animation: "pbSpin 12s linear infinite" })} />
        <div style={abs({ inset: "3.6cqh", borderRadius: "50%", border: ".8cqh solid #2a2420" })} />
        <Avatar size="38cqh" />
      </div>
      <span style={abs({ bottom: "6cqh", fontFamily: MONO, fontSize: "4cqh", color: "#8d8a84", letterSpacing: ".2em" })}>◀◀ REW</span>
    </div>
  ),

  aire: () => (
    <div style={fill("linear-gradient(180deg,#0b1230 0%,#1d2452 62%,#0c0f1c 62%)", { alignItems: "flex-start" })}>
      {[[8, 10], [20, 26], [34, 8], [72, 14], [86, 30], [62, 6], [92, 8]].map(([x, y], i) => (
        <span key={i} style={abs({ left: x + "%", top: y + "%", width: ".9cqh", height: ".9cqh", borderRadius: "50%", background: "#f2efea", opacity: 0.7 })} />
      ))}
      <div style={abs({ left: "50%", top: "40%", width: "120%", height: "60%", transform: "translateX(-50%)", clipPath: "polygon(30% 0,70% 0,52% 100%,48% 100%)", background: "linear-gradient(180deg,rgba(245,192,74,.28),transparent)" })} />
      <div style={{ marginTop: "12%", width: "58%", aspectRatio: "2.1", background: "linear-gradient(135deg,#ff7a45,#f5c04a)", border: "1cqh solid #e9e3d6", boxShadow: "0 0 6cqh rgba(245,192,74,.45)", position: "relative", zIndex: 1 }} />
      {[14, 38, 62, 86].map((x) => (
        <span key={x} style={abs({ left: x + "%", bottom: "8%", width: "16%", height: "10%", transform: "translateX(-50%)", borderRadius: "3cqh 3cqh 1cqh 1cqh", background: "#05060c" })} />
      ))}
    </div>
  ),

  lluvia: () => (
    <div style={fill("linear-gradient(180deg,#140b20,#05050a)", { flexDirection: "column", gap: "2cqh" })}>
      <style>{KEYFRAMES}</style>
      <div style={abs({ inset: 0, backgroundImage: "repeating-linear-gradient(100deg,transparent 0 14px,rgba(170,205,255,.16) 14px 15px)", animation: "pbRain 1.2s linear infinite" })} />
      <span style={{ fontFamily: DISP, fontWeight: 900, fontStretch: "70%", fontSize: "20cqh", lineHeight: 1, color: "#ffd6f5", textShadow: "0 0 2cqh #ff4fd8, 0 0 6cqh #ff4fd8", letterSpacing: ".06em", animation: "pbFlicker 5s infinite" }}>CINE</span>
      <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: "6cqh", color: "#d6fbff", textShadow: "0 0 2cqh #4fe3ff, 0 0 5cqh #4fe3ff", letterSpacing: ".3em" }}>24 H</span>
      <div style={abs({ left: "20%", right: "20%", bottom: "-6%", height: "22%", background: "radial-gradient(ellipse at 50% 30%,rgba(255,79,216,.35),transparent 70%)", filter: "blur(2px)" })} />
    </div>
  ),

  culto: () => (
    <ProfileRow>
      <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: "4cqh", letterSpacing: ".16em", color: "#f5c04a", borderBottom: ".4cqh solid #f5c04a", paddingBottom: ".8cqh" }}>✦ DIRECTOR DE CULTO ✦</span>
    </ProfileRow>
  ),

  final: () => (
    <ProfileRow>
      <span style={{ fontFamily: DISP, fontStyle: "italic", fontWeight: 600, fontSize: "5cqh", color: "#6ab8e6" }}>↺ Fan del final alternativo</span>
    </ProfileRow>
  ),

  spoiler: () => (
    <div style={fill("repeating-linear-gradient(-45deg,#f5c04a 0 14px,#141417 14px 28px)")}>
      <div style={{ display: "flex", alignItems: "center", gap: "4cqh", padding: "4cqh 6cqh", background: "#141417", borderRadius: "4cqh", boxShadow: "0 2cqh 4cqh rgba(0,0,0,.5)" }}>
        <Avatar size="18cqh" />
        <div style={{ display: "flex", flexDirection: "column", gap: "1.6cqh" }}>
          <span style={{ fontFamily: DISP, fontWeight: 800, fontSize: "8cqh", color: "#f2efea", lineHeight: 1 }}>Julio</span>
          <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: "3.6cqh", lineHeight: 1.25, color: "#141417", background: "#f2efea", padding: ".8cqh 2cqh", borderRadius: "1cqh", letterSpacing: ".06em" }}>LIBRE DE<br />SPOILERS</span>
        </div>
      </div>
    </div>
  ),

  creditos: () => {
    const lines = [["DIRIGIDA POR", "JULIO", true], ["PRODUCCIÓN", "DIDIER"], ["GUION", "STIVEN"], ["MÚSICA", "ANDRES"], ["MONTAJE", "LUZ"]];
    const block = lines.map(([r, n, me], i) => (
      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".8cqh", padding: "3cqh 0" }}>
        <span style={{ fontFamily: MONO, fontSize: "3cqh", letterSpacing: ".2em", color: "#6d6a65" }}>{r}</span>
        <span style={{ fontFamily: DISP, fontWeight: 900, fontSize: me ? "9cqh" : "6cqh", color: me ? "#ff6a3d" : "#f2efea", letterSpacing: ".04em" }}>{n}</span>
      </div>
    ));
    return (
      <div style={fill("#050506", { alignItems: "flex-start", WebkitMaskImage: "linear-gradient(transparent,#000 22%,#000 78%,transparent)", maskImage: "linear-gradient(transparent,#000 22%,#000 78%,transparent)" })}>
        <style>{KEYFRAMES}</style>
        <div style={{ animation: "pbCredits 9s linear infinite" }}>{block}{block}</div>
      </div>
    );
  },

  saltan: () => (
    <div style={fill("radial-gradient(circle at 50% 80%,#3a2414,#120d0a 70%)", { alignItems: "flex-end" })}>
      <style>{KEYFRAMES}</style>
      <div style={{ position: "relative", width: "40cqh", height: "44cqh", marginBottom: "8cqh" }}>
        {[[10, 2, 9, 0], [30, -4, 11, .3], [52, 0, 10, .6], [72, -2, 9, .15], [20, 8, 8, .45], [62, 9, 8, .8], [42, -10, 9, .9]].map(([x, y, s, d], i) => (
          <span key={i} style={abs({ left: x + "%", top: y + "cqh", width: s + "cqh", height: s + "cqh", borderRadius: "45% 55% 50% 50%", background: "radial-gradient(circle at 35% 35%,#fff8e6,#f1d79a)", animation: `pbPop 1.6s ${d}s ease-in-out infinite` })} />
        ))}
        <div style={abs({ left: 0, right: 0, bottom: 0, height: "34cqh", clipPath: "polygon(0 0,100% 0,84% 100%,16% 100%)", background: "repeating-linear-gradient(90deg,#e0372a 0 5cqh,#f6efe4 5cqh 10cqh)" })} />
      </div>
    </div>
  ),

  maraton: () => (
    <div style={fill(FELT, { flexDirection: "column", gap: "3cqh" })}>
      <div style={{ width: "48cqh", height: "42cqh", clipPath: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)", background: "linear-gradient(160deg,#ff8a5c,#c2361c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "40cqh", height: "35cqh", clipPath: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)", background: "#2a120a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: ".5cqh" }}>
          <span style={{ fontFamily: DISP, fontWeight: 900, fontSize: "14cqh", color: "#ff8a5c", lineHeight: 0.9 }}>∞</span>
          <span style={{ fontFamily: MONO, fontSize: "3.4cqh", color: "#f2d2c4" }}>S1 → S8</span>
        </div>
      </div>
      <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: "3.6cqh", letterSpacing: ".2em", color: "#f2efea", background: "#c2361c", padding: ".8cqh 3cqh" }}>MARATONISTA</span>
    </div>
  ),

  primera: () => (
    <div style={fill(FELT)}>
      <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        <span style={abs({ bottom: "-10cqh", left: "8cqh", width: "9cqh", height: "18cqh", background: "#c2361c", transform: "rotate(18deg)", clipPath: "polygon(0 0,100% 0,100% 100%,50% 80%,0 100%)" })} />
        <span style={abs({ bottom: "-10cqh", right: "8cqh", width: "9cqh", height: "18cqh", background: "#c2361c", transform: "rotate(-18deg)", clipPath: "polygon(0 0,100% 0,100% 100%,50% 80%,0 100%)" })} />
        <div style={{ position: "relative", width: "46cqh", height: "46cqh", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ffe08a,#d9a22e)", border: "1.6cqh double #8a6416", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: DISP, fontWeight: 900, fontSize: "18cqh", color: "#3a2a08", lineHeight: 0.9 }}>1ª</span>
          <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: "3.4cqh", letterSpacing: ".18em", color: "#3a2a08" }}>FUNCIÓN</span>
        </div>
      </div>
    </div>
  ),

  critico: () => (
    <div style={fill(FELT)}>
      <div style={{ width: "54cqh", height: "52cqh", clipPath: "polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)", background: "linear-gradient(160deg,#dcbff2,#8e5cc0)", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "6cqh" }}>
        <span style={{ fontFamily: DISP, fontWeight: 900, fontSize: "9cqh", color: "#2a1640" }}>5/5</span>
      </div>
    </div>
  ),

  claqueta: () => (
    <div style={fill(FELT)}>
      <Pin bg="#1f1f25">
        <div style={{ position: "relative", width: "52%", height: "38%", marginTop: "10%" }}>
          <div style={abs({ left: 0, right: 0, top: "-26%", height: "24%", background: "repeating-linear-gradient(-55deg,#f2efea 0 9%,#141414 9% 18%)", transform: "rotate(-14deg)", transformOrigin: "left bottom", borderRadius: ".5cqh" })} />
          <div style={abs({ inset: 0, background: "#141414", borderRadius: ".8cqh", borderTop: "1.6cqh solid", borderImage: "repeating-linear-gradient(-55deg,#f2efea 0 9%,#141414 9% 18%) 1" })} />
          <span style={abs({ left: "12%", top: "42%", width: "50%", height: ".8cqh", background: "#4a4744" })} />
          <span style={abs({ left: "12%", top: "62%", width: "34%", height: ".8cqh", background: "#4a4744" })} />
        </div>
      </Pin>
    </div>
  ),

  palomitas: () => (
    <div style={fill(FELT)}>
      <Pin bg="#f5c04a">
        <div style={{ position: "relative", width: "48%", height: "56%", marginTop: "12%" }}>
          {[[4, 0, 30], [30, -10, 34], [58, -2, 32], [18, 12, 28], [46, 10, 30]].map(([x, y, s], i) => (
            <span key={i} style={abs({ left: x + "%", top: y + "%", width: s + "%", aspectRatio: "1", borderRadius: "50%", background: "#fff8e6", boxShadow: "inset -.4cqh -.6cqh 0 #e9cf8f" })} />
          ))}
          <div style={abs({ left: 0, right: 0, bottom: 0, height: "64%", clipPath: "polygon(0 0,100% 0,84% 100%,16% 100%)", background: "repeating-linear-gradient(90deg,#e0372a 0 16%,#fff 16% 32%)" })} />
        </div>
      </Pin>
    </div>
  ),

  rollo: () => (
    <div style={fill(FELT)}>
      <Pin bg="#2b2b31">
        <div style={{ position: "relative", width: "72%", aspectRatio: "1", borderRadius: "50%", background: "radial-gradient(circle,#c9c9d0,#8a8a93)" }}>
          {[0, 72, 144, 216, 288].map((a) => (
            <span key={a} style={abs({ left: "50%", top: "50%", width: "26%", height: "26%", borderRadius: "50%", background: "#2b2b31", transform: `translate(-50%,-50%) rotate(${a}deg) translateY(-118%)` })} />
          ))}
          <span style={abs({ left: "50%", top: "50%", width: "16%", height: "16%", borderRadius: "50%", background: "#2b2b31", border: ".8cqh solid #c9c9d0", transform: "translate(-50%,-50%)" })} />
        </div>
      </Pin>
    </div>
  ),

  dorado: () => (
    <div style={fill("radial-gradient(circle at 50% 40%,#3a2e12,#120e06 75%)")}>
      <div style={{ width: "54%", height: "82%", transform: "rotate(-4deg)", background: "linear-gradient(160deg,#ffe08a,#d9a22e 55%,#a87618)", borderRadius: "2cqh", boxShadow: "0 2cqh 5cqh rgba(0,0,0,.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "6cqh 3cqh", WebkitMask: "radial-gradient(circle 4cqh at 0 62%,transparent 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 4cqh at 100% 62%,transparent 98%,#000) right/51% 100% no-repeat", mask: "radial-gradient(circle 4cqh at 0 62%,transparent 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 4cqh at 100% 62%,transparent 98%,#000) right/51% 100% no-repeat" }}>
        <span style={{ fontFamily: MONO, fontSize: "3.4cqh", letterSpacing: ".2em", color: "#4a3408" }}>ADMIT ONE</span>
        <span style={{ fontFamily: DISP, fontWeight: 900, fontStretch: "68%", fontSize: "13cqh", lineHeight: 0.85, color: "#3a2806", textAlign: "center" }}>BOLETO<br />DORADO</span>
        <span style={{ width: "100%", borderTop: ".5cqh dashed #8a6416" }} />
        <span style={{ fontFamily: MONO, fontSize: "4cqh", color: "#4a3408" }}>Nº 0001</span>
      </div>
    </div>
  ),

  grito: () => (
    <div style={fill("radial-gradient(circle at 50% 40%,#22152a,#0d0a10 75%)")}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,auto)", gap: "4cqh 6cqh", alignItems: "center", justifyItems: "center" }}>
        <Face bg="#f5c04a" mouth={<span style={abs({ left: "40%", top: "60%", width: "20%", height: "28%", borderRadius: "50%", background: "#1a1208" })} />} />
        <div style={{ width: "24cqh", height: "28cqh", borderRadius: "12cqh 12cqh 2cqh 2cqh", background: "#ece6da", position: "relative" }}>
          <span style={abs({ left: "26%", top: "34%", width: "14%", height: "20%", borderRadius: 99, background: "#141417" })} />
          <span style={abs({ right: "26%", top: "34%", width: "14%", height: "20%", borderRadius: 99, background: "#141417" })} />
        </div>
        <Face bg="#6ab8e6" eye="#0f1a24" mouth={<span style={abs({ left: "34%", top: "66%", width: "32%", height: "6%", borderRadius: 99, background: "#0f1a24" })} />} />
        <span style={{ fontFamily: DISP, fontWeight: 900, fontSize: "8cqh", color: "#141417", background: "#ff6a3d", padding: "1.4cqh 3cqh", borderRadius: "4cqh 4cqh 4cqh .8cqh", transform: "rotate(-6deg)" }}>AAH!</span>
        <Face bg="#ff8a2a" eye="#3a1406" mouth={<span style={abs({ left: "28%", top: "62%", width: "44%", height: "12%", background: "#3a1406", clipPath: "polygon(0 0,100% 0,85% 100%,70% 40%,50% 100%,30% 40%,15% 100%)" })} />}>
          <span style={abs({ left: "44%", top: "-12%", width: "12%", height: "18%", borderRadius: "1cqh", background: "#4a8a3a" })} />
        </Face>
        <Face bg="#ece6da" eye="#141417" mouth={<span style={abs({ left: "44%", top: "58%", width: "12%", height: "10%", background: "#141417", clipPath: "polygon(50% 0,100% 100%,0 100%)" })} />} />
      </div>
    </div>
  ),
};

function ItemArt({ itemId, style }) {
  const Art = ART[itemId];
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", containerType: "size", overflow: "hidden", borderRadius: "inherit", ...style }}>
      {Art ? <Art /> : <div style={fill("#18181b")} />}
    </div>
  );
}

export { ItemArt };
export default ItemArt;
