const HOURS = 6;
const RAINFALL_SHAPE = [0.2, 0.5, 0.3, 0, 0, 0];
const MAX_PONDING_MM = 300;

export const DEFAULT_SCENARIO = {
  rainfallMm: 90,
  drainAvailability: 65,
  blockage: 30,
  saturation: 65,
};

export const WARD_ZONES = [
  { id: 'W-01', name: 'North Market', lowPoint: 0.45, imperviousness: 0.88, drainCapacityMmPerHour: 16, exposure: 0.7 },
  { id: 'W-02', name: 'Riverbend', lowPoint: 0.92, imperviousness: 0.72, drainCapacityMmPerHour: 13, exposure: 0.92 },
  { id: 'W-03', name: 'Old Town', lowPoint: 0.78, imperviousness: 0.95, drainCapacityMmPerHour: 11, exposure: 0.84 },
  { id: 'W-04', name: 'East Junction', lowPoint: 0.3, imperviousness: 0.82, drainCapacityMmPerHour: 20, exposure: 0.66 },
  { id: 'W-05', name: 'Canal Estate', lowPoint: 0.86, imperviousness: 0.76, drainCapacityMmPerHour: 15, exposure: 0.78 },
  { id: 'W-06', name: 'South Depot', lowPoint: 0.62, imperviousness: 0.91, drainCapacityMmPerHour: 18, exposure: 0.96 },
];

export const SCENARIO_PRESETS = {
  'Typical monsoon': { rainfallMm: 55, drainAvailability: 75, blockage: 18, saturation: 45 },
  'Intense cloudburst': { rainfallMm: 150, drainAvailability: 55, blockage: 35, saturation: 80 },
  'Drain maintenance': { rainfallMm: 90, drainAvailability: 90, blockage: 5, saturation: 65 },
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function riskLevel(score) {
  if (score >= 70) return 'Severe';
  if (score >= 45) return 'High';
  if (score >= 20) return 'Moderate';
  return 'Low';
}

function simulateWard(ward, scenario, rainfallProfile, rainfallScale = 1, capacityScale = 1) {
  const drainFactor = (scenario.drainAvailability / 100) * (1 - scenario.blockage / 100);
  const groundFactor = 0.6 + (scenario.saturation / 100) * 0.4;
  const surfaceFactor = 0.8 + ward.lowPoint * 0.4;
  let pondingMm = 0;
  const hourly = [];

  for (let hour = 0; hour < HOURS; hour += 1) {
    const rainfallMm = rainfallProfile[hour] * rainfallScale;
    const runoffMm = rainfallMm * ward.imperviousness * groundFactor * surfaceFactor;
    const drainageMm = ward.drainCapacityMmPerHour * drainFactor * capacityScale;
    pondingMm = clamp(pondingMm + runoffMm - drainageMm, 0, MAX_PONDING_MM);
    hourly.push({
      hour: hour + 1,
      rainfallMm: Math.round(rainfallMm * 10) / 10,
      pondingMm: Math.round(pondingMm * 10) / 10,
    });
  }

  const peakPondingMm = Math.max(...hourly.map((point) => point.pondingMm));
  const exposureAdjustedScore = Math.round(
    clamp((peakPondingMm / 100) * (0.6 + ward.exposure * 0.4), 0, 1) * 100,
  );

  return {
    ...ward,
    hourly,
    peakPondingMm,
    peakHour: hourly.find((point) => point.pondingMm === peakPondingMm)?.hour ?? 1,
    score: exposureAdjustedScore,
    level: riskLevel(exposureAdjustedScore),
  };
}

function normalizeScenario(scenario) {
  const limits = {
    rainfallMm: [0, 240],
    drainAvailability: [0, 100],
    blockage: [0, 100],
    saturation: [0, 100],
  };

  return Object.fromEntries(
    Object.entries(limits).map(([key, [min, max]]) => {
      const value = Number(scenario[key]);
      if (!Number.isFinite(value)) {
        throw new TypeError(`Scenario input "${key}" must be a finite number.`);
      }
      return [key, clamp(value, min, max)];
    }),
  );
}

function buildRainfallProfile(scenario, forecastProfile) {
  if (forecastProfile === null || forecastProfile === undefined) {
    return RAINFALL_SHAPE.map((fraction) => scenario.rainfallMm * fraction);
  }

  if (
    !Array.isArray(forecastProfile) ||
    forecastProfile.length !== HOURS ||
    forecastProfile.some((value) => !Number.isFinite(value) || value < 0)
  ) {
    throw new TypeError('Forecast profile must contain six finite, non-negative hourly values.');
  }

  const forecastTotal = forecastProfile.slice(0, 3).reduce((total, value) => total + value, 0);
  if (forecastTotal === 0) {
    return scenario.rainfallMm === 0
      ? [...forecastProfile]
      : RAINFALL_SHAPE.map((fraction) => scenario.rainfallMm * fraction);
  }

  const scale = scenario.rainfallMm / forecastTotal;
  return forecastProfile.map((value) => value * scale);
}

export function simulateCityScenario(inputs, forecastProfile = null) {
  const scenario = normalizeScenario(inputs);
  const rainfallProfile = buildRainfallProfile(scenario, forecastProfile);
  const wards = WARD_ZONES.map((ward) => {
    const result = simulateWard(ward, scenario, rainfallProfile);
    const optimistic = simulateWard(ward, scenario, rainfallProfile, 1.2, 0.8).score;
    const conservative = simulateWard(ward, scenario, rainfallProfile, 0.8, 1.2).score;

    return {
      ...result,
      sensitivity: {
        low: Math.min(optimistic, conservative),
        high: Math.max(optimistic, conservative),
      },
    };
  });

  const rainfallTimeline = rainfallProfile.map((rainfallMm, index) => ({
    hour: index + 1,
    rainfallMm: Math.round(rainfallMm * 10) / 10,
  }));
  const priorityWards = wards.filter((ward) => ward.score >= 45).length;
  const highestPriorityWard = [...wards].sort((a, b) => b.score - a.score)[0];

  return {
    inputs: scenario,
    wards,
    rainfallTimeline,
    priorityWards,
    highestPriorityWard,
    modelDisclosure:
      'Synthetic, uncalibrated bucket-model scenario. Sensitivity ranges are deterministic input perturbations, not probability or confidence intervals.',
  };
}
