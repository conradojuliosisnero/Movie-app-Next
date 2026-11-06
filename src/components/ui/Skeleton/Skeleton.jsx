// Esqueletos de carga con la forma del contenido que viene (en vez de “Cargando…”).
// kind: rail | hero | heroText | cards | detail | person | episodes | chips | lines
import { copy } from '@/i18n';
import { cx } from '@/utils/cx';
import s from './Skeleton.module.css';

const Bone = ({ className, style }) => <span className={cx(s.bone, className)} style={style} />;
const times = (n, fn) => Array.from({ length: n }, (_, i) => fn(i));

const Lines = ({ n = 3 }) => (
  <div className={s.lines}>{times(n, (i) => <Bone key={i} className={s.line} style={{ width: `${[92, 84, 60, 75][i % 4]}%` }} />)}</div>
);

const SHAPES = {
  rail: () => <div className={s.rail}>{times(7, (i) => <Bone key={i} className={s.poster} />)}</div>,
  hero: () => (
    <div className={s.hero}>
      <Bone className={s.heroBg} />
      <div className={s.heroBody}>
        <Bone className={s.eyebrow} />
        <Bone className={s.heroTitle} />
        <Bone className={s.meta} />
        <Lines n={3} />
        <div className={s.row}>{times(3, (i) => <Bone key={i} className={s.button} />)}</div>
      </div>
      <div className={s.thumbs}>{times(5, (i) => <Bone key={i} className={s.thumb} />)}</div>
    </div>
  ),
  cards: () => (
    <div className={s.cards}>
      {times(6, (i) => (
        <div key={i} className={s.card}>
          <Bone className={s.cardPoster} />
          <div className={s.cardBody}><Bone className={s.cardTitle} /><Bone className={s.meta} /><Lines n={2} /></div>
        </div>
      ))}
    </div>
  ),
  detail: () => (
    <div className={s.detail}>
      <Lines n={4} />
      <div className={s.row}>{times(4, (i) => <Bone key={i} className={s.button} />)}</div>
      <Bone className={s.panel} />
    </div>
  ),
  person: () => (
    <div className={s.person}>
      <Bone className={s.photo} />
      <div className={s.cardBody}><Bone className={s.eyebrow} /><Bone className={s.heroTitle} /><Lines n={5} /></div>
    </div>
  ),
  episodes: () => (
    <div className={s.episodes}>
      {times(5, (i) => (
        <div key={i} className={s.episode}><Bone className={s.still} /><div className={s.cardBody}><Bone className={s.cardTitle} /><Lines n={2} /></div></div>
      ))}
    </div>
  ),
  heroText: () => (
    <div className={s.heroText}><Bone className={s.eyebrow} /><Bone className={s.heroTitle} /><Bone className={s.meta} /></div>
  ),
  chips: () => <div className={s.row}>{times(8, (i) => <Bone key={i} className={s.chip} style={{ width: `${70 + (i % 3) * 22}px` }} />)}</div>,
  lines: () => <Lines n={3} />,
};

export default function Skeleton({ kind = 'lines' }) {
  const Shape = SHAPES[kind] ?? SHAPES.lines;
  return <div role="status" aria-busy="true" aria-label={copy.common.loading} className={s.wrap}><Shape /></div>;
}
