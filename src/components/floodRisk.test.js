import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SCENARIO,
  SCENARIO_PRESETS,
  WARD_ZONES,
  simulateCityScenario,
} from './floodRisk.js';

describe('simulateCityScenario', () => {
  it('returns six synthetic wards and a six-hour timeline', () => {
    const result = simulateCityScenario(DEFAULT_SCENARIO);

    expect(result.wards).toHaveLength(6);
    expect(result.wards.map((ward) => ward.id)).toEqual(WARD_ZONES.map((ward) => ward.id));
    expect(result.rainfallTimeline).toHaveLength(6);
    expect(result.rainfallTimeline.reduce((total, hour) => total + hour.rainfallMm, 0)).toBeCloseTo(
      DEFAULT_SCENARIO.rainfallMm,
      1,
    );
    expect(result.modelDisclosure).toMatch(/not probability or confidence intervals/i);
  });

  it('keeps ponding non-negative and drains after the storm stops', () => {
    const result = simulateCityScenario(DEFAULT_SCENARIO);

    for (const ward of result.wards) {
      expect(ward.hourly).toHaveLength(6);
      expect(ward.hourly.every((hour) => hour.pondingMm >= 0)).toBe(true);
      expect(ward.hourly.slice(3).every((hour) => hour.rainfallMm === 0)).toBe(true);
      expect(ward.hourly[5].pondingMm).toBeLessThanOrEqual(ward.hourly[2].pondingMm);
    }
  });

  it('raises the scenario index with heavier rain or more blockage', () => {
    const baseline = simulateCityScenario(SCENARIO_PRESETS['Typical monsoon']);
    const heavierRain = simulateCityScenario({ ...SCENARIO_PRESETS['Typical monsoon'], rainfallMm: 150 });
    const moreBlockage = simulateCityScenario({ ...SCENARIO_PRESETS['Typical monsoon'], blockage: 90 });

    for (let index = 0; index < baseline.wards.length; index += 1) {
      expect(heavierRain.wards[index].score).toBeGreaterThanOrEqual(baseline.wards[index].score);
      expect(moreBlockage.wards[index].score).toBeGreaterThanOrEqual(baseline.wards[index].score);
    }
  });

  it('does not raise the scenario index when more drainage capacity is available', () => {
    const limited = simulateCityScenario({ ...DEFAULT_SCENARIO, drainAvailability: 25 });
    const improved = simulateCityScenario({ ...DEFAULT_SCENARIO, drainAvailability: 100 });

    for (let index = 0; index < limited.wards.length; index += 1) {
      expect(improved.wards[index].score).toBeLessThanOrEqual(limited.wards[index].score);
    }
  });

  it('provides an explicitly non-probabilistic sensitivity range', () => {
    const result = simulateCityScenario(DEFAULT_SCENARIO);

    for (const ward of result.wards) {
      expect(ward.sensitivity.low).toBeLessThanOrEqual(ward.score);
      expect(ward.sensitivity.high).toBeGreaterThanOrEqual(ward.score);
      expect(ward.sensitivity.low).toBeGreaterThanOrEqual(0);
      expect(ward.sensitivity.high).toBeLessThanOrEqual(100);
    }
  });

  it('bounds slider inputs and rejects non-finite values', () => {
    const bounded = simulateCityScenario({
      rainfallMm: 500,
      drainAvailability: -20,
      blockage: 130,
      saturation: 101,
    });

    expect(bounded.inputs).toEqual({
      rainfallMm: 240,
      drainAvailability: 0,
      blockage: 100,
      saturation: 100,
    });
    expect(() => simulateCityScenario({ ...DEFAULT_SCENARIO, rainfallMm: Number.NaN })).toThrow(
      /must be a finite number/i,
    );
  });

  it('returns zero ponding when the rainfall scenario is zero', () => {
    const result = simulateCityScenario({ ...DEFAULT_SCENARIO, rainfallMm: 0 });
    expect(result.wards.every((ward) => ward.peakPondingMm === 0)).toBe(true);
    expect(result.priorityWards).toBe(0);
  });
});
