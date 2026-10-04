import { RhythmStyle, RhythmCategory } from '../types/rhythm';
import { GROOVES, arrangeGroove } from '../domain/grooves';

export const ALL_STYLES: RhythmStyle[] = GROOVES.map(g => arrangeGroove(g.style.id));

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
      s.practiceFocus.toLowerCase().includes(q) ||
      (s.similarSongs && s.similarSongs.some(song =>
        song.title.toLowerCase().includes(q) || song.artist.toLowerCase().includes(q)
      ))
  );
}
