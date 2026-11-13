export type DataProvenanceType = 
  | 'OFFICIAL' 
  | 'HISTORICAL_OFFICIAL' 
  | 'MODELLED' 
  | 'ESTIMATED' 
  | 'PROTOTYPE';

export interface ProvenanceInfo {
  type: DataProvenanceType;
  source: string;
  citation?: string;
  period?: string;
}

export interface Ward {
  id: string;
  name: string;
  zone: string;
  lat: number;
  lng: number;
  population: number;
  densityKm2: number;
  elderlyPercentage: number; // >60y
  outdoorWorkerPercentage: number; // construction, sanitation, transport, street vendors
  slumHousingPercentage: number; // informal / tin roof / poor ventilation
  healthcareAccessKm: number; // avg distance to primary health centre
  treeCanopyPercentage: number; // vegetative cover mitigating UHI
  vulnerabilityScore: number; // 0 - 100 calculated composite
  primaryVulnerabilityDrivers: string[];
}

export interface WeatherData {
  temperature: number; // Celsius (°C)
  humidity: number; // Percentage (%)
  windSpeed: number; // km/h
  solarRadiation: number; // W/m²
  dewPoint?: number; // °C
}

export interface CalculatedMetrics {
  heatIndex: number; // °C
  wbgt: number; // Wet-Bulb Globe Temp (°C)
  utci: number; // Universal Thermal Climate Index (°C)
  thermalStressScore: number; // 0 - 100
  riskScore: number; // 0 - 100 (Thermal stress * Vulnerability)
  riskCategory: 'Low' | 'Moderate' | 'High' | 'Extreme';
  imdHeatwaveStatus: 'Normal' | 'Heatwave Alert' | 'Heatwave' | 'Severe Heatwave';
  isoWorkRestRatio: string; // e.g., 'Continuous', '45 min work / 15 min rest', '15 min work / 45 min rest', 'Cease Outdoor Work'
  estimatedHospitalSurgeFactor: number; // Multiplier e.g. 1.8x baseline
  estimatedMortalityRiskElevation: number; // Percentage elevation e.g. 23%
  healthImpactLevel: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
}

export interface WardState extends Ward, WeatherData, CalculatedMetrics {
  activeWarningId?: string;
}

export interface HealthMortalityProjection {
  day: string;
  date: string;
  tempMax: number;
  wbgtMax: number;
  thermalStressIndex: number;
  heatRiskScore: number;
  hospitalSurgeFactor: number;
  mortalityElevationPercent: number;
  healthImpactLevel: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  confidence: 'High' | 'Moderate' | 'Provisional';
  modelBasis: string;
  recommendedIntervention: string;
}

export interface DataSourceRegistryItem {
  id: string;
  source: string;
  organization: string;
  dataset: string;
  timePeriod: string;
  geographicLevel: string;
  variables: string[];
  status: 'OFFICIAL' | 'HISTORICAL_OFFICIAL' | 'MODELLED' | 'PROTOTYPE';
  sourceReference: string;
  apiReadiness: 'Production Ready' | 'Historical Archive' | 'API Pending';
}

export interface WarningAlert {
  id: string;
  wardId: string;
  wardName: string;
  riskLevel: 'Moderate' | 'High' | 'Extreme';
  riskScore: number;
  wbgt: number;
  temperature: number;
  expectedPeriod: string;
  reason: string;
  recommendedAction: string;
  affectedPopulation: number;
  vulnerableGroups: string;
  timestamp: string;
  status: 'ACTIVE' | 'DISPATCHED' | 'RESOLVED';
}

export interface HeatActionIntervention {
  id: string;
  category: 'Labor & Industry' | 'Healthcare & Hospitals' | 'Municipal & Water' | 'Public & Vulnerable Groups';
  title: string;
  description: string;
  priority: 'Immediate' | 'High' | 'Standard';
  targetWards: string[];
  status: 'Pending' | 'Active' | 'Completed';
  dispatchedAt?: string;
  leadAgency: string;
}

export interface ForecastDay {
  day: string;
  date: string;
  maxTemp: number;
  minTemp: number;
  humidity: number;
  wbgtMax: number;
  heatRiskScore: number;
  riskCategory: 'Low' | 'Moderate' | 'High' | 'Extreme';
  imdClassification: 'Normal' | 'Heatwave' | 'Severe Heatwave';
  vulnerableExposureEst: number;
  recommendedTrigger: string;
  provenance: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  timeRange: string;
  location: string;
  mode: 'HISTORICAL_REPLAY' | 'DEMONSTRATION' | 'LIVE_DATA';
  baseDataset: string;
  stages: {
    stageIndex: number;
    timeLabel: string;
    description: string;
    temp: number;
    humidity: number;
    wind: number;
    solar: number;
    imdStatus: 'Normal' | 'Heatwave Alert' | 'Heatwave' | 'Severe Heatwave';
  }[];
}

export interface SimulationState {
  isPlaying: boolean;
  speed: number;
  currentTime: Date;
  stage: number;
  scenarioId: string;
  activeScenario: SimulationScenario;
  wards: WardState[];
  cityMetrics: {
    avgTemperature: number;
    avgHumidity: number;
    avgWindSpeed: number;
    avgSolarRadiation: number;
    avgWbgt: number;
    avgRiskScore: number;
    highRiskWardsCount: number;
    extremeRiskWardsCount: number;
    totalExposedPopulation: number;
    totalExposedElderly: number;
    totalExposedWorkers: number;
    imdCityStatus: 'Normal' | 'Heatwave Alert' | 'Heatwave' | 'Severe Heatwave';
    avgMortalityRiskElevation: number;
    avgHospitalSurgeFactor: number;
    cityHealthImpact: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  };
}

export type CitizenCategory = 'OUTDOOR_WORKER' | 'GIG_WORKER' | 'ELDERLY' | 'GENERAL_CITIZEN' | 'EMERGENCY_VOLUNTEER';

export interface CitizenContact {
  id: string;
  name: string;
  phone: string;
  cleanPhone: string;
  wardId: string;
  wardName: string;
  category: CitizenCategory;
  notes?: string;
  dateAdded: string;
}

export interface WhatsAppDispatchRecord {
  id: string;
  contactId: string;
  contactName: string;
  phone: string;
  cleanPhone: string;
  wardName: string;
  alertId: string;
  alertTitle: string;
  wbgt: number;
  messageText: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  dispatchedAt: string;
  matchReason: string;
  isTargeted: boolean;
  httpStatus?: number;
}

