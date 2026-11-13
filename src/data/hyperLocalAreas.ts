export interface LocalArea {
  id: string;
  name: string;
  subdivision: string;
  zone: string;
  lat: number;
  lng: number;
  pincode: string;
  category: 'Industrial' | 'Dense Residential' | 'Coastal' | 'Suburban' | 'Commercial & Transit' | 'Port & Logistics';
  population: number;
  densityKm2: number;
  outdoorWorkerPct: number;
  elderlyPct: number;
  tinRoofPct: number;
  canopyPct: number;
  builtUpPct: number;
  nearestHospital: string;
  nearestHospitalKm: number;
  keyVulnerabilityFactors: string[];
}

export const HYPER_LOCAL_AREAS: LocalArea[] = [
  {
    id: 'loc-avadi',
    name: 'Avadi',
    subdivision: 'Avadi Municipal Corporation',
    zone: 'Zone West / Tiruvallur Border',
    lat: 13.1147,
    lng: 80.1018,
    pincode: '600054',
    category: 'Industrial',
    population: 345000,
    densityKm2: 12400,
    outdoorWorkerPct: 44.5,
    elderlyPct: 11.2,
    tinRoofPct: 38.0,
    canopyPct: 6.2,
    builtUpPct: 74.0,
    nearestHospital: 'Avadi Govt. Taluk Hospital & Ordnance Hospital',
    nearestHospitalKm: 1.2,
    keyVulnerabilityFactors: ['Heavy Vehicles Factory (HVF) & industrial sheds', 'Extensive tin-sheet labor quarters', 'Rapid unshaded urban sprawl']
  },
  {
    id: 'loc-pattabiram',
    name: 'Pattabiram',
    subdivision: 'Avadi Corporation - West',
    zone: 'Zone West Suburb',
    lat: 13.1232,
    lng: 80.0583,
    pincode: '600072',
    category: 'Suburban',
    population: 168000,
    densityKm2: 8900,
    outdoorWorkerPct: 41.0,
    elderlyPct: 10.8,
    tinRoofPct: 42.5,
    canopyPct: 5.5,
    builtUpPct: 68.0,
    nearestHospital: 'Pattabiram Primary Health Centre / Hindu Mission Hospital',
    nearestHospitalKm: 2.1,
    keyVulnerabilityFactors: ['Military Siding & logistics loading yards', 'High concentration of unorganized brick & construction workers', 'Low municipal drinking water grid density']
  },
  {
    id: 'loc-poonamallee',
    name: 'Poonamallee',
    subdivision: 'Poonamallee Municipality',
    zone: 'Zone West Arterial Corridor',
    lat: 13.0489,
    lng: 80.1075,
    pincode: '600056',
    category: 'Commercial & Transit',
    population: 195000,
    densityKm2: 14200,
    outdoorWorkerPct: 39.0,
    elderlyPct: 12.5,
    tinRoofPct: 34.0,
    canopyPct: 7.1,
    builtUpPct: 81.0,
    nearestHospital: 'Poonamallee Govt. Hospital',
    nearestHospitalKm: 0.9,
    keyVulnerabilityFactors: ['Heavy transit bus interchange & truck corridor', 'Extensive asphalt radiative heating along Bengaluru highway', 'High outdoor vendor concentration']
  },
  {
    id: 'loc-ambattur',
    name: 'Ambattur Industrial Estate',
    subdivision: 'Zone VII Ambattur',
    zone: 'Zone VII - North West Industrial',
    lat: 13.0984,
    lng: 80.1618,
    pincode: '600058',
    category: 'Industrial',
    population: 482000,
    densityKm2: 17200,
    outdoorWorkerPct: 52.0,
    elderlyPct: 9.8,
    tinRoofPct: 46.0,
    canopyPct: 4.8,
    builtUpPct: 88.0,
    nearestHospital: 'Govt. Peripheral Hospital Anna Nagar / ESI Hospital',
    nearestHospitalKm: 1.8,
    keyVulnerabilityFactors: ['Over 1,800 manufacturing & metal fabrication units', 'Extreme radiative surface temperature from metal roofs', 'High migrant worker density']
  },
  {
    id: 'loc-tondiarpet',
    name: 'Tondiarpet',
    subdivision: 'Zone IV Tondiarpet',
    zone: 'Zone IV - North Chennai',
    lat: 13.1275,
    lng: 80.2889,
    pincode: '600081',
    category: 'Dense Residential',
    population: 348200,
    densityKm2: 24500,
    outdoorWorkerPct: 38.5,
    elderlyPct: 11.8,
    tinRoofPct: 42.0,
    canopyPct: 4.2,
    builtUpPct: 92.0,
    nearestHospital: 'Govt. Stanley Medical College & Peripheral Hospital',
    nearestHospitalKm: 1.8,
    keyVulnerabilityFactors: ['High informal dock/port labor', 'Dense tin-sheet roof settlements', 'Critically low vegetative canopy (4.2%)']
  },
  {
    id: 'loc-royapuram',
    name: 'Royapuram',
    subdivision: 'Zone V Royapuram',
    zone: 'Zone V - North Coastal',
    lat: 13.1141,
    lng: 80.2951,
    pincode: '600013',
    category: 'Coastal',
    population: 395000,
    densityKm2: 28200,
    outdoorWorkerPct: 41.0,
    elderlyPct: 12.4,
    tinRoofPct: 46.5,
    canopyPct: 3.8,
    builtUpPct: 94.0,
    nearestHospital: 'Govt. Stanley Medical College Hospital',
    nearestHospitalKm: 0.8,
    keyVulnerabilityFactors: ['Extreme population density (28.2k/km²)', 'Harbor & fish market outdoor workers', 'Severe urban heat island retention']
  },
  {
    id: 'loc-manali',
    name: 'Manali Industrial Belt',
    subdivision: 'Zone II Manali',
    zone: 'Zone II - North Industrial',
    lat: 13.1764,
    lng: 80.2625,
    pincode: '600068',
    category: 'Industrial',
    population: 154000,
    densityKm2: 7400,
    outdoorWorkerPct: 54.0,
    elderlyPct: 8.8,
    tinRoofPct: 48.0,
    canopyPct: 3.2,
    builtUpPct: 85.0,
    nearestHospital: 'Madhavaram Taluk Hospital / Stanley Referral',
    nearestHospitalKm: 3.4,
    keyVulnerabilityFactors: ['Petrochemical refineries & thermal radiation', 'Highest outdoor labor ratio (54%)', 'Low tree canopy & high ambient air pollution']
  },
  {
    id: 'loc-ennore',
    name: 'Ennore',
    subdivision: 'Zone I Tiruvottiyur',
    zone: 'Zone I - Coastal North',
    lat: 13.2144,
    lng: 80.3235,
    pincode: '600057',
    category: 'Port & Logistics',
    population: 142000,
    densityKm2: 6800,
    outdoorWorkerPct: 48.0,
    elderlyPct: 10.5,
    tinRoofPct: 44.0,
    canopyPct: 3.5,
    builtUpPct: 78.0,
    nearestHospital: 'Ennore Urban Community Health Centre',
    nearestHospitalKm: 2.2,
    keyVulnerabilityFactors: ['Coal handling port & thermal power stations', 'High salt-mist humidity trapping radiant heat', 'Informal fishing hamlets']
  },
  {
    id: 'loc-redhills',
    name: 'Red Hills (Puzhal)',
    subdivision: 'Puzhal Town Panchayat',
    zone: 'Zone North West Outer',
    lat: 13.1972,
    lng: 80.1983,
    pincode: '600052',
    category: 'Suburban',
    population: 185000,
    densityKm2: 8200,
    outdoorWorkerPct: 38.0,
    elderlyPct: 11.0,
    tinRoofPct: 36.0,
    canopyPct: 8.4,
    builtUpPct: 65.0,
    nearestHospital: 'Puzhal Urban Primary Health Centre',
    nearestHospitalKm: 1.5,
    keyVulnerabilityFactors: ['Grain & rice wholesale loading godowns', 'Highway transport hub with prolonged sun exposure', 'Open unshaded quarry stretches']
  },
  {
    id: 'loc-tambaram',
    name: 'Tambaram',
    subdivision: 'Tambaram Municipal Corporation',
    zone: 'Zone South Grand Gateway',
    lat: 12.9249,
    lng: 80.1000,
    pincode: '600045',
    category: 'Commercial & Transit',
    population: 420000,
    densityKm2: 15600,
    outdoorWorkerPct: 32.0,
    elderlyPct: 14.2,
    tinRoofPct: 26.0,
    canopyPct: 11.2,
    builtUpPct: 82.0,
    nearestHospital: 'Tambaram Taluk Govt. Hospital (Chromepet)',
    nearestHospitalKm: 1.4,
    keyVulnerabilityFactors: ['Massive transit junction with intense commuter thermal load', 'Heavy railway siding & auto stand exposure', 'Market yard congestion']
  },
  {
    id: 'loc-porur',
    name: 'Porur',
    subdivision: 'Zone XI Valasaravakkam',
    zone: 'Zone XI - West Corridor',
    lat: 13.0382,
    lng: 80.1565,
    pincode: '600116',
    category: 'Dense Residential',
    population: 265000,
    densityKm2: 16400,
    outdoorWorkerPct: 29.0,
    elderlyPct: 13.0,
    tinRoofPct: 22.0,
    canopyPct: 8.9,
    builtUpPct: 84.0,
    nearestHospital: 'Sri Ramachandra Hospital & Medical Centre',
    nearestHospitalKm: 0.8,
    keyVulnerabilityFactors: ['Junction bottlenecks with high vehicular emission heat', 'Dense multi-story concrete canyon effect']
  },
  {
    id: 'loc-sholinganallur',
    name: 'Sholinganallur (OMR IT Corridor)',
    subdivision: 'Zone XV Sholinganallur',
    zone: 'Zone XV - South Outer',
    lat: 12.9009,
    lng: 80.2279,
    pincode: '600119',
    category: 'Suburban',
    population: 225000,
    densityKm2: 8900,
    outdoorWorkerPct: 48.0,
    elderlyPct: 8.2,
    tinRoofPct: 35.0,
    canopyPct: 6.8,
    builtUpPct: 76.0,
    nearestHospital: 'Gleneagles Global Health City / Govt. PHC',
    nearestHospitalKm: 3.1,
    keyVulnerabilityFactors: ['Unshaded mega construction sites & migrant laborers', 'Long emergency transit times', 'High humidity microclimate']
  },
  {
    id: 'loc-perungudi',
    name: 'Perungudi',
    subdivision: 'Zone XIV Perungudi',
    zone: 'Zone XIV - South East',
    lat: 12.9654,
    lng: 80.2461,
    pincode: '600096',
    category: 'Industrial',
    population: 286000,
    densityKm2: 13200,
    outdoorWorkerPct: 44.0,
    elderlyPct: 9.5,
    tinRoofPct: 38.0,
    canopyPct: 5.1,
    builtUpPct: 82.0,
    nearestHospital: 'Govt. Peripheral Hospital Saidapet',
    nearestHospitalKm: 2.4,
    keyVulnerabilityFactors: ['Major landfill thermal decomposition & unshaded waste handling', 'Large migrant workforce', 'Dense asphalt roadways']
  },
  {
    id: 'loc-guindy',
    name: 'Guindy & Ekkattuthangal',
    subdivision: 'Zone XII Alandur',
    zone: 'Zone XII - Industrial & Transit',
    lat: 13.0067,
    lng: 80.2206,
    pincode: '600032',
    category: 'Industrial',
    population: 185000,
    densityKm2: 14800,
    outdoorWorkerPct: 35.0,
    elderlyPct: 10.4,
    tinRoofPct: 26.0,
    canopyPct: 13.0,
    builtUpPct: 86.0,
    nearestHospital: 'Govt. King Institute & Peripheral Hospital',
    nearestHospitalKm: 1.1,
    keyVulnerabilityFactors: ['Guindy Industrial Estate outdoor workforce', 'Major multi-modal transit hub', 'Dense micro-manufacturing sheds']
  },
  {
    id: 'loc-velachery',
    name: 'Velachery',
    subdivision: 'Zone XIII Adyar',
    zone: 'Zone XIII - South Residential',
    lat: 12.9754,
    lng: 80.2206,
    pincode: '600042',
    category: 'Dense Residential',
    population: 338000,
    densityKm2: 17200,
    outdoorWorkerPct: 21.0,
    elderlyPct: 13.8,
    tinRoofPct: 19.5,
    canopyPct: 9.4,
    builtUpPct: 89.0,
    nearestHospital: 'Velachery Urban Community Health Centre',
    nearestHospitalKm: 1.3,
    keyVulnerabilityFactors: ['Rapid concrete densification', 'High afternoon solar radiation reflection', 'Transit choke points']
  },
  {
    id: 'loc-georgetown',
    name: 'George Town & Parrys',
    subdivision: 'Zone V Royapuram',
    zone: 'Zone V - Central Commercial',
    lat: 13.0898,
    lng: 80.2882,
    pincode: '600001',
    category: 'Commercial & Transit',
    population: 290000,
    densityKm2: 31000,
    outdoorWorkerPct: 46.0,
    elderlyPct: 13.5,
    tinRoofPct: 31.0,
    canopyPct: 2.1,
    builtUpPct: 98.0,
    nearestHospital: 'Rajiv Gandhi Govt. General Hospital (RGGGH)',
    nearestHospitalKm: 0.6,
    keyVulnerabilityFactors: ['Highest density wholesale markets in South India', 'Hand-cart pullers & head-load laborers under direct sun', 'Near-zero tree canopy (2.1%)']
  },
  {
    id: 'loc-triplicane',
    name: 'Triplicane & Chepauk',
    subdivision: 'Zone IX Teynampet',
    zone: 'Zone IX - Central Coastal',
    lat: 13.0588,
    lng: 80.2764,
    pincode: '600005',
    category: 'Dense Residential',
    population: 275000,
    densityKm2: 26800,
    outdoorWorkerPct: 28.0,
    elderlyPct: 15.4,
    tinRoofPct: 24.0,
    canopyPct: 5.6,
    builtUpPct: 93.0,
    nearestHospital: 'Govt. Kasturba Gandhi Hospital & Royapettah GH',
    nearestHospitalKm: 0.9,
    keyVulnerabilityFactors: ['Narrow alleyways with zero cross-ventilation', 'High elder cohort living in upper-floor tenements', 'Coastal humidity exacerbating WBGT']
  },
  {
    id: 'loc-mylapore',
    name: 'Mylapore',
    subdivision: 'Zone IX Teynampet',
    zone: 'Zone IX - South Central',
    lat: 13.0335,
    lng: 80.2672,
    pincode: '600004',
    category: 'Dense Residential',
    population: 312000,
    densityKm2: 23400,
    outdoorWorkerPct: 14.0,
    elderlyPct: 21.5,
    tinRoofPct: 18.0,
    canopyPct: 14.5,
    builtUpPct: 86.0,
    nearestHospital: 'Govt. Royapettah Hospital',
    nearestHospitalKm: 0.5,
    keyVulnerabilityFactors: ['Highest elder demographic ratio (21.5%)', 'Temple festival outdoor congregations', 'Moderate tree cover offset by aging vulnerability']
  },
  {
    id: 'loc-annanagar',
    name: 'Anna Nagar',
    subdivision: 'Zone VIII Anna Nagar',
    zone: 'Zone VIII - Central West',
    lat: 13.0847,
    lng: 80.2119,
    pincode: '600040',
    category: 'Dense Residential',
    population: 442000,
    densityKm2: 14200,
    outdoorWorkerPct: 14.5,
    elderlyPct: 18.2,
    tinRoofPct: 11.2,
    canopyPct: 19.4,
    builtUpPct: 80.0,
    nearestHospital: 'Govt. Peripheral Hospital Anna Nagar',
    nearestHospitalKm: 0.6,
    keyVulnerabilityFactors: ['High elderly demographic (>60y at 18.2%)', 'High tree canopy buffer (19.4%) mitigates direct thermal stress']
  },
  {
    id: 'loc-chromepet',
    name: 'Chromepet & Sanatorium',
    subdivision: 'Tambaram Corporation',
    zone: 'Zone South West Suburb',
    lat: 12.9516,
    lng: 80.1462,
    pincode: '600044',
    category: 'Suburban',
    population: 240000,
    densityKm2: 13800,
    outdoorWorkerPct: 34.0,
    elderlyPct: 12.8,
    tinRoofPct: 28.0,
    canopyPct: 8.5,
    builtUpPct: 81.0,
    nearestHospital: 'Govt. Chromepet Hospital / TB Sanatorium',
    nearestHospitalKm: 0.7,
    keyVulnerabilityFactors: ['Leather tanning & processing micro-clusters', 'Railway pedestrian overpass sun exposure', 'Suburban outdoor labor']
  }
];

export function computeHyperLocalBiometeorology(area: LocalArea, baseTemp: number, baseHumidity: number, baseWind: number, baseSolar: number) {
  // Microclimate spatial physics adjustment
  const distCoastFactor = (area.lng > 80.25) ? 3.8 : -1.5; // Coastal humidity effect
  const urbanHeatIsland = (area.builtUpPct / 100) * 1.6 + (area.densityKm2 / 25000) * 1.2;
  const canopyCooling = (area.canopyPct / 20) * 1.5;
  const industrialRadiantHeat = area.category === 'Industrial' ? 1.4 : area.category === 'Port & Logistics' ? 1.1 : 0.2;

  const temp = Math.round((baseTemp + urbanHeatIsland - canopyCooling + industrialRadiantHeat) * 10) / 10;
  const humidity = Math.round(Math.min(96, Math.max(22, baseHumidity + distCoastFactor - (urbanHeatIsland * 0.8))));
  const windSpeed = Math.round(Math.max(1.0, baseWind + (area.lng > 80.27 ? 2.5 : -1.0)) * 10) / 10;
  const solarRadiation = Math.round(Math.max(100, baseSolar - (area.canopyPct * 6) + (area.tinRoofPct * 2)));

  // Stull Wet-Bulb (°C)
  const Twb = temp * Math.atan(0.151977 * Math.pow(humidity + 8.313659, 0.5)) +
    Math.atan(temp + humidity) -
    Math.atan(humidity - 1.676331) +
    0.00391838 * Math.pow(humidity, 1.5) * Math.atan(0.023101 * humidity) -
    4.686035;

  const Tg = temp + (0.012 * solarRadiation) - (0.15 * Math.sqrt(windSpeed));
  const wbgt = Math.round((0.7 * Twb + 0.2 * Tg + 0.1 * temp) * 10) / 10;

  // Rothfusz Heat Index
  const TF = (temp * 9) / 5 + 32;
  const hiF = -42.379 + 2.04901523 * TF + 10.14333127 * humidity - 0.22475541 * TF * humidity -
    6.83783e-3 * TF * TF - 5.481717e-2 * humidity * humidity + 1.22874e-3 * TF * TF * humidity +
    8.5282e-4 * TF * humidity * humidity - 1.99e-6 * TF * TF * humidity * humidity;
  const heatIndex = Math.round((((hiF - 32) * 5) / 9) * 10) / 10;

  // UTCI
  const utci = Math.round((temp + (0.33 * (humidity / 100) * 6.105 * Math.exp((17.27 * temp) / (237.7 + temp))) - (0.7 * Math.sqrt(windSpeed)) + (solarRadiation * 0.008) - 4) * 10) / 10;

  // Vulnerability weighting
  const workerWeight = (area.outdoorWorkerPct / 50) * 0.35;
  const tinRoofWeight = (area.tinRoofPct / 50) * 0.25;
  const elderlyWeight = (area.elderlyPct / 25) * 0.25;
  const canopyMitigation = (area.canopyPct / 25) * 0.15;
  const healthPenalty = (area.nearestHospitalKm / 3.0) * 0.10;

  const vulnMultiplier = Math.max(0.75, Math.min(1.7, 0.85 + workerWeight + tinRoofWeight + elderlyWeight + healthPenalty - canopyMitigation));
  const thermalScore = Math.max(0, Math.min(100, Math.round(((wbgt - 24) / 12) * 100)));
  const compositeRiskScore = Math.max(10, Math.min(100, Math.round(thermalScore * vulnMultiplier)));

  let alertLevel: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' = 'GREEN';
  if (compositeRiskScore >= 80 || wbgt >= 32.5) alertLevel = 'RED';
  else if (compositeRiskScore >= 65 || wbgt >= 30.5) alertLevel = 'ORANGE';
  else if (compositeRiskScore >= 45 || wbgt >= 28.0) alertLevel = 'YELLOW';

  let isoWorkRest = 'Continuous outdoor work permitted with basic hydration.';
  if (wbgt >= 32.5) isoWorkRest = 'MANDATORY OUTDOOR WORK HALT (Red Protocol). Seek air-cooled shelter.';
  else if (wbgt >= 31.0) isoWorkRest = '15 min physical labor / 45 min shaded rest per hour with electrolyte solution.';
  else if (wbgt >= 29.5) isoWorkRest = '30 min work / 30 min shaded rest with mandatory hydration intervals.';
  else if (wbgt >= 28.0) isoWorkRest = '45 min work / 15 min shaded rest.';

  const hospitalSurgeFactor = Math.round((1.0 + (compositeRiskScore > 50 ? (compositeRiskScore - 50) * 0.035 : 0)) * 10) / 10;
  const mortalityRiskElevation = Math.max(0, Math.min(65, Math.round((wbgt >= 33.5 ? 32 : wbgt >= 31.5 ? 20 : wbgt >= 29.0 ? 9 : 2) * vulnMultiplier)));

  return {
    temp,
    humidity,
    windSpeed,
    solarRadiation,
    wbgt,
    heatIndex,
    utci,
    compositeRiskScore,
    alertLevel,
    isoWorkRest,
    hospitalSurgeFactor,
    mortalityRiskElevation,
    affectedOutdoorWorkers: Math.round(area.population * (area.outdoorWorkerPct / 100)),
    affectedElderly: Math.round(area.population * (area.elderlyPct / 100))
  };
}
