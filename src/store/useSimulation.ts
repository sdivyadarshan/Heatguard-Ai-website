import { create } from 'zustand';
import { Ward, WardState, WeatherData, CalculatedMetrics, SimulationScenario, SimulationState } from '../types';
import { OFFICIAL_WARDS, HISTORICAL_SCENARIOS } from '../data/officialDatasets';

function calculateBiometeorology(weather: WeatherData, ward: Ward): CalculatedMetrics {
  const T = weather.temperature;
  const H = Math.max(10, Math.min(100, weather.humidity));
  const v = Math.max(0.5, weather.windSpeed);
  const S = Math.max(0, weather.solarRadiation);

  // Stull (2011) Wet-Bulb Temperature formula (°C)
  const Twb = T * Math.atan(0.151977 * Math.pow(H + 8.313659, 0.5)) +
    Math.atan(T + H) -
    Math.atan(H - 1.676331) +
    0.00391838 * Math.pow(H, 1.5) * Math.atan(0.023101 * H) -
    4.686035;

  // Globe temperature estimate Tg (°C)
  const Tg = T + (0.012 * S) - (0.15 * Math.sqrt(v));

  // Outdoor WBGT per ISO 7243
  const rawWbgt = 0.7 * Twb + 0.2 * Tg + 0.1 * T;
  const wbgt = Math.round(rawWbgt * 10) / 10;

  // Rothfusz Heat Index (°F converted to °C)
  const TF = (T * 9) / 5 + 32;
  let hiF = -42.379 + 2.04901523 * TF + 10.14333127 * H - 0.22475541 * TF * H -
    6.83783e-3 * TF * TF - 5.481717e-2 * H * H + 1.22874e-3 * TF * TF * H +
    8.5282e-4 * TF * H * H - 1.99e-6 * TF * TF * H * H;
  const heatIndex = Math.round((((hiF - 32) * 5) / 9) * 10) / 10;

  // Universal Thermal Climate Index (UTCI approx)
  const utci = Math.round((T + (0.33 * (H / 100) * 6.105 * Math.exp((17.27 * T) / (237.7 + T))) - (0.7 * Math.sqrt(v)) + (S * 0.008) - 4) * 10) / 10;

  // Physiological stress score (0-100)
  let thermalStressScore = Math.max(0, Math.min(100, Math.round(
    ((wbgt - 24) / 12) * 100
  )));

  // Vulnerability Multiplier from multi-factorial ward traits
  // Factors: elderly, outdoor workers, tin roofs / slums, low tree canopy, distance to healthcare
  const workerWeight = (ward.outdoorWorkerPercentage / 50) * 0.35;
  const slumWeight = (ward.slumHousingPercentage / 50) * 0.25;
  const elderlyWeight = (ward.elderlyPercentage / 25) * 0.25;
  const canopyMitigation = (ward.treeCanopyPercentage / 25) * 0.15;
  const healthcarePenalty = (ward.healthcareAccessKm / 3.0) * 0.10;

  const vulnerabilityMultiplier = Math.max(0.75, Math.min(1.65, 0.85 + workerWeight + slumWeight + elderlyWeight + healthcarePenalty - canopyMitigation));

  const riskScore = Math.max(10, Math.min(100, Math.round(thermalStressScore * vulnerabilityMultiplier)));

  let riskCategory: 'Low' | 'Moderate' | 'High' | 'Extreme' = 'Low';
  if (riskScore >= 80 || wbgt >= 32.5) riskCategory = 'Extreme';
  else if (riskScore >= 65 || wbgt >= 30.5) riskCategory = 'High';
  else if (riskScore >= 45 || wbgt >= 28.0) riskCategory = 'Moderate';

  // IMD Heatwave classification
  let imdHeatwaveStatus: 'Normal' | 'Heatwave Alert' | 'Heatwave' | 'Severe Heatwave' = 'Normal';
  if (T >= 44.0 || (T >= 40.0 && wbgt >= 33.0)) imdHeatwaveStatus = 'Severe Heatwave';
  else if (T >= 40.0 || wbgt >= 31.0) imdHeatwaveStatus = 'Heatwave';
  else if (T >= 37.0 || wbgt >= 28.5) imdHeatwaveStatus = 'Heatwave Alert';

  // ISO 7243 Work-Rest Recommendations
  let isoWorkRestRatio = 'Continuous outdoor work permitted';
  if (wbgt >= 32.5) isoWorkRestRatio = 'Mandatory outdoor work suspension (Red Protocol)';
  else if (wbgt >= 31.0) isoWorkRestRatio = '15 min work / 45 min rest in shade per hour';
  else if (wbgt >= 29.5) isoWorkRestRatio = '30 min work / 30 min rest in shade per hour';
  else if (wbgt >= 28.0) isoWorkRestRatio = '45 min work / 15 min rest with mandatory hydration';

  // Hospital surge factor
  const estimatedHospitalSurgeFactor = Math.round((1.0 + (riskScore > 50 ? (riskScore - 50) * 0.035 : 0)) * 10) / 10;

  // Heat-attributable excess mortality risk elevation (%) based on DLNM thermal-health curve
  // Calibrated for tropical urban populations: exponential steepening above 29.5°C WBGT
  let baseMortality = 0;
  if (wbgt >= 33.5) baseMortality = 28 + (wbgt - 33.5) * 12;
  else if (wbgt >= 31.5) baseMortality = 18 + (wbgt - 31.5) * 5;
  else if (wbgt >= 29.0) baseMortality = 8 + (wbgt - 29.0) * 4;
  else if (wbgt >= 27.0) baseMortality = 2 + (wbgt - 27.0) * 3;
  
  const estimatedMortalityRiskElevation = Math.max(0, Math.min(65, Math.round(baseMortality * vulnerabilityMultiplier)));

  let healthImpactLevel: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme' = 'Low';
  if (riskScore >= 85 || wbgt >= 33.0) healthImpactLevel = 'Extreme';
  else if (riskScore >= 70 || wbgt >= 31.5) healthImpactLevel = 'Very High';
  else if (riskScore >= 55 || wbgt >= 29.5) healthImpactLevel = 'High';
  else if (riskScore >= 40 || wbgt >= 27.5) healthImpactLevel = 'Moderate';

  return {
    heatIndex,
    wbgt,
    utci,
    thermalStressScore,
    riskScore,
    riskCategory,
    imdHeatwaveStatus,
    isoWorkRestRatio,
    estimatedHospitalSurgeFactor,
    estimatedMortalityRiskElevation,
    healthImpactLevel
  };
}

function generateWardsForScenarioStage(scenario: SimulationScenario, stageIndex: number): WardState[] {
  const stageData = scenario.stages[stageIndex] || scenario.stages[0];

  return OFFICIAL_WARDS.map((ward, idx) => {
    // Spatial microclimate variance based on urban topology & coastal proximity
    const coastalEffect = (ward.lng > 80.25) ? 4.5 : -2.0; // Higher humidity on coast
    const urbanHeatIslandTemp = (ward.densityKm2 / 25000) * 1.8; // Dense zones run 1.8°C hotter
    const canopyCooling = (ward.treeCanopyPercentage / 20) * 1.4; // Dense canopy runs up to 1.4°C cooler
    const varianceSeed = ((idx * 7) % 11 - 5) * 0.15;

    const temp = Math.round((stageData.temp + urbanHeatIslandTemp - canopyCooling + varianceSeed) * 10) / 10;
    const humidity = Math.round(Math.min(95, Math.max(20, stageData.humidity + coastalEffect - (urbanHeatIslandTemp * 1.5))));
    const windSpeed = Math.round(Math.max(1, stageData.wind + (ward.lng > 80.26 ? 3 : -1.5)) * 10) / 10;
    const solarRadiation = Math.round(Math.max(0, stageData.solar - (ward.treeCanopyPercentage * 4)));

    const weather: WeatherData = {
      temperature: temp,
      humidity,
      windSpeed,
      solarRadiation,
      dewPoint: Math.round((temp - ((100 - humidity) / 5)) * 10) / 10
    };

    const metrics = calculateBiometeorology(weather, ward);

    return {
      ...ward,
      ...weather,
      ...metrics,
      activeWarningId: metrics.riskCategory === 'Extreme' || metrics.riskCategory === 'High' ? `WARN-${ward.id}` : undefined
    };
  });
}

function calculateCityAggregates(wards: WardState[], scenario: SimulationScenario, stageIndex: number) {
  const total = wards.length || 1;
  const avgTemperature = Math.round((wards.reduce((acc, w) => acc + w.temperature, 0) / total) * 10) / 10;
  const avgHumidity = Math.round(wards.reduce((acc, w) => acc + w.humidity, 0) / total);
  const avgWindSpeed = Math.round((wards.reduce((acc, w) => acc + w.windSpeed, 0) / total) * 10) / 10;
  const avgSolarRadiation = Math.round(wards.reduce((acc, w) => acc + w.solarRadiation, 0) / total);
  const avgWbgt = Math.round((wards.reduce((acc, w) => acc + w.wbgt, 0) / total) * 10) / 10;
  const avgRiskScore = Math.round(wards.reduce((acc, w) => acc + w.riskScore, 0) / total);

  const highRiskWards = wards.filter(w => w.riskCategory === 'High');
  const extremeRiskWards = wards.filter(w => w.riskCategory === 'Extreme');
  const highRiskWardsCount = highRiskWards.length;
  const extremeRiskWardsCount = extremeRiskWards.length;

  const criticalWards = wards.filter(w => w.riskCategory === 'High' || w.riskCategory === 'Extreme');
  const totalExposedPopulation = criticalWards.reduce((acc, w) => acc + w.population, 0);
  const totalExposedElderly = criticalWards.reduce((acc, w) => acc + Math.round(w.population * (w.elderlyPercentage / 100)), 0);
  const totalExposedWorkers = criticalWards.reduce((acc, w) => acc + Math.round(w.population * (w.outdoorWorkerPercentage / 100)), 0);

  const stageData = scenario.stages[stageIndex] || scenario.stages[0];
  const imdCityStatus = stageData.imdStatus;

  const avgMortalityRiskElevation = Math.round(wards.reduce((acc, w) => acc + (w.estimatedMortalityRiskElevation || 0), 0) / total);
  const avgHospitalSurgeFactor = Math.round((wards.reduce((acc, w) => acc + (w.estimatedHospitalSurgeFactor || 1.0), 0) / total) * 10) / 10;

  let cityHealthImpact: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme' = 'Low';
  if (avgRiskScore >= 80 || avgWbgt >= 32.5) cityHealthImpact = 'Extreme';
  else if (avgRiskScore >= 65 || avgWbgt >= 30.5) cityHealthImpact = 'Very High';
  else if (avgRiskScore >= 50 || avgWbgt >= 28.5) cityHealthImpact = 'High';
  else if (avgRiskScore >= 35 || avgWbgt >= 26.5) cityHealthImpact = 'Moderate';

  return {
    avgTemperature,
    avgHumidity,
    avgWindSpeed,
    avgSolarRadiation,
    avgWbgt,
    avgRiskScore,
    highRiskWardsCount,
    extremeRiskWardsCount,
    totalExposedPopulation,
    totalExposedElderly,
    totalExposedWorkers,
    imdCityStatus,
    avgMortalityRiskElevation,
    avgHospitalSurgeFactor,
    cityHealthImpact
  };
}

interface SimulationStoreState extends SimulationState {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
  setScenario: (scenarioId: string) => void;
  togglePlay: () => void;
  setSpeed: (speed: number) => void;
  setStage: (stage: number) => void;
  reset: () => void;
  tick: () => void;
}

const defaultScenario = HISTORICAL_SCENARIOS[0];
const defaultInitialWards = generateWardsForScenarioStage(defaultScenario, 0);

export const useSimulation = create<SimulationStoreState>((set) => {
  return {
    isPlaying: false,
    speed: 1,
    currentTime: new Date('2024-05-15T08:00:00'),
    stage: 0,
    scenarioId: defaultScenario.id,
    activeScenario: defaultScenario,
    wards: defaultInitialWards,
    cityMetrics: calculateCityAggregates(defaultInitialWards, defaultScenario, 0),
    isDrawerOpen: false,

    toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
    setDrawerOpen: (open: boolean) => set({ isDrawerOpen: open }),

    setScenario: (scenarioId: string) => set(() => {
      const scenario = HISTORICAL_SCENARIOS.find(s => s.id === scenarioId) || defaultScenario;
      const initialWards = generateWardsForScenarioStage(scenario, 0);
      const baseDate = scenario.id === 'north-india-june-2024' ? new Date('2024-06-10T09:00:00') : new Date('2024-05-15T08:00:00');

      return {
        scenarioId: scenario.id,
        activeScenario: scenario,
        stage: 0,
        isPlaying: false,
        currentTime: baseDate,
        wards: initialWards,
        cityMetrics: calculateCityAggregates(initialWards, scenario, 0)
      };
    }),

    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setSpeed: (speed) => set({ speed }),

    setStage: (stage: number) => set((state) => {
      const clampedStage = Math.max(0, Math.min(state.activeScenario.stages.length - 1, stage));
      const wards = generateWardsForScenarioStage(state.activeScenario, clampedStage);
      return {
        stage: clampedStage,
        wards,
        cityMetrics: calculateCityAggregates(wards, state.activeScenario, clampedStage)
      };
    }),

    reset: () => set((state) => {
      const initialWards = generateWardsForScenarioStage(state.activeScenario, 0);
      const baseDate = state.activeScenario.id === 'north-india-june-2024' ? new Date('2024-06-10T09:00:00') : new Date('2024-05-15T08:00:00');
      return {
        isPlaying: false,
        stage: 0,
        currentTime: baseDate,
        wards: initialWards,
        cityMetrics: calculateCityAggregates(initialWards, state.activeScenario, 0)
      };
    }),

    tick: () => set((state) => {
      if (!state.isPlaying) return state;

      // Advance time by 15 mins * speed
      const nextTime = new Date(state.currentTime.getTime() + 15 * 60000 * state.speed);

      // Auto advance stages across the 4 timeline steps
      const baseTime = state.activeScenario.id === 'north-india-june-2024' ? new Date('2024-06-10T09:00:00').getTime() : new Date('2024-05-15T08:00:00').getTime();
      const hoursElapsed = (nextTime.getTime() - baseTime) / (1000 * 60 * 60);

      let newStage = 0;
      if (hoursElapsed > 7) newStage = 3;
      else if (hoursElapsed > 4.5) newStage = 2;
      else if (hoursElapsed > 2) newStage = 1;

      if (newStage >= state.activeScenario.stages.length) {
        newStage = state.activeScenario.stages.length - 1;
      }

      if (newStage !== state.stage) {
        const wards = generateWardsForScenarioStage(state.activeScenario, newStage);
        return {
          currentTime: nextTime,
          stage: newStage,
          wards,
          cityMetrics: calculateCityAggregates(wards, state.activeScenario, newStage)
        };
      }

      return { currentTime: nextTime };
    })
  };
});
