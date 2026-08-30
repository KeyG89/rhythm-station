import { describe, it, expect } from 'vitest';
import { ALL_STYLES, STYLES_MAP, getStyleById, getStylesByCategory, searchStyles } from '../src/data';
import { DRUM_INSTRUMENTS_META, RhythmCategory } from '../src/types/rhythm';

describe('100 Rhythm Styles Integrity & Validation', () => {
  it('contains exactly 100 styles numbered 00 to 99', () => {
    expect(ALL_STYLES.length).toBe(100);

    for (let i = 0; i < 100; i++) {
      const id = String(i).padStart(2, '0');
      const style = STYLES_MAP.get(id);
      expect(style, `Style ${id} should exist`).toBeDefined();
      expect(style?.id).toBe(id);
    }
  });

  it('all 10 categories are populated correctly', () => {
    const categories: RhythmCategory[] = [
      '8BEAT',
      '16BEAT',
      'ROCK_BLUES',
      'DISCO_DANCE',
      'FUNK_SOUL',
      'JAZZ_SWING',
      'LATIN',
      'COUNTRY_FOLK',
      'BALLAD',
      'TRADITIONAL'
    ];

    categories.forEach((cat) => {
      const stylesInCat = getStylesByCategory(cat);
      expect(stylesInCat.length, `Category ${cat} should have styles`).toBeGreaterThan(0);
    });
  });

  it('every style has valid metadata, BPM and time signature', () => {
    ALL_STYLES.forEach((style) => {
      expect(style.name.length).toBeGreaterThan(2);
      expect(style.description.length).toBeGreaterThan(5);
      expect(style.practiceFocus.length).toBeGreaterThan(5);
      expect(style.drumPatternDescription.length).toBeGreaterThan(5);

      // BPM bounds
      expect(style.defaultBpm).toBeGreaterThanOrEqual(40);
      expect(style.defaultBpm).toBeLessThanOrEqual(250);

      // Time signature
      expect([2, 3, 4, 6, 12]).toContain(style.timeSignature[0]);
      expect([4, 8]).toContain(style.timeSignature[1]);
    });
  });

  it('every style has all required sections with valid steps and instruments', () => {
    const validInstruments = new Set(Object.keys(DRUM_INSTRUMENTS_META));
    const requiredSections = ['mainA', 'mainB', 'fillA', 'fillB', 'intro', 'ending'] as const;

    ALL_STYLES.forEach((style) => {
      requiredSections.forEach((sectionKey) => {
        const pattern = style.sections[sectionKey];
        expect(pattern, `Style ${style.id} missing section ${sectionKey}`).toBeDefined();
        expect(pattern.steps.length, `Style ${style.id} ${sectionKey} must have steps`).toBeGreaterThan(0);
        expect([2, 3, 4]).toContain(pattern.stepsPerBeat);

        // Verify every step and hit
        pattern.steps.forEach((step, stepIdx) => {
          step.forEach((hit) => {
            expect(validInstruments.has(hit.instrument), `Invalid instrument ${hit.instrument} in style ${style.id} ${sectionKey} step ${stepIdx}`).toBe(true);
            expect(hit.velocity).toBeGreaterThan(0);
            expect(hit.velocity).toBeLessThanOrEqual(1.0);
          });
        });
      });
    });
  });

  it('searchStyles finds matching styles by ID, name, or keyword', () => {
    expect(searchStyles('Bossa').length).toBeGreaterThanOrEqual(2);
    expect(searchStyles('00')[0].name).toBe('8Beat Pop 1');
    expect(searchStyles('Eurobeat')[0].id).toBe('30');
    expect(searchStyles('Metal')[0].id).toBe('21');
    expect(searchStyles('Purdie')[0].name).toBe('16Beat Shuffle');
  });

  it('getStyleById fallback works for unknown IDs', () => {
    const fallback = getStyleById('999');
    expect(fallback).toBeDefined();
    expect(fallback.id).toBe('00');
  });
});
