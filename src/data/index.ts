import { RhythmStyle, RhythmCategory } from '../types/rhythm';
import { STYLES_8BEAT } from './styles/cat0_8beat';
import { STYLES_16BEAT } from './styles/cat1_16beat';
import { STYLES_ROCK_BLUES } from './styles/cat2_rock';
import { STYLES_DISCO_DANCE } from './styles/cat3_dance';
import { STYLES_FUNK_SOUL } from './styles/cat4_funk';
import { STYLES_JAZZ_SWING } from './styles/cat5_jazz';
import { STYLES_LATIN } from './styles/cat6_latin';
import { STYLES_COUNTRY_FOLK } from './styles/cat7_country';
import { STYLES_BALLAD } from './styles/cat8_ballad';
import { STYLES_TRADITIONAL } from './styles/cat9_traditional';

export const ALL_STYLES: RhythmStyle[] = [
  ...STYLES_8BEAT,
  ...STYLES_16BEAT,
  ...STYLES_ROCK_BLUES,
  ...STYLES_DISCO_DANCE,
  ...STYLES_FUNK_SOUL,
  ...STYLES_JAZZ_SWING,
  ...STYLES_LATIN,
  ...STYLES_COUNTRY_FOLK,
  ...STYLES_BALLAD,
  ...STYLES_TRADITIONAL
];

export const STYLES_MAP: Map<string, RhythmStyle> = new Map(
  ALL_STYLES.map((style) => [style.id, style])
);

export function getStyleById(id: string): RhythmStyle {
  return STYLES_MAP.get(id) || ALL_STYLES[0];
}

export function getStylesByCategory(category: RhythmCategory): RhythmStyle[] {
  return ALL_STYLES.filter((s) => s.category === category);
}

export function searchStyles(query: string): RhythmStyle[] {
  const q = query.toLowerCase().trim();
  if (!q) return ALL_STYLES;
  return ALL_STYLES.filter(
    (s) =>
      s.id.includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.practiceFocus.toLowerCase().includes(q)
  );
}
