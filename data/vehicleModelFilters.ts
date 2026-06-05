/** Models that appear under heavy-truck makes but belong in the car category. */
const LIGHT_MODEL_EXCEPTIONS = new Set(
  [
    'Amigo',
    'Hombre',
    'Metris',
    'Pickup',
    'Rodeo',
    'Rodeo Sport',
    'Sprinter',
    'Trooper',
    'Trooper II',
    'eSprinter',
  ].map(normalizeModelName),
);

const LIGHT_PERSONAL_MODEL_PATTERNS: RegExp[] = [
  /^F-1[05]0/,
  /^F-2[05]0/,
  /^F-3[05]0/,
  /^F-4[05]0/,
  /^F-5[09]0/,
  /^F-6[05]0/,
  /^F-7[05]0/,
  /Cybertruck/,
  /Silverado/,
  /Sierra/,
  /^Ram 1/,
  /^Ram 2/,
  /^Ram 3/,
  /^Ram 4/,
  /Tacoma/,
  /Tundra/,
  /T100/,
  /Colorado/,
  /Ranger/,
  /Maverick/,
  /4Runner/,
  /Pick-?Up/i,
  /Ridgeline/,
  /S-10/,
  /Avalanche/,
  /Suburban/,
  /Tahoe/,
  /Expedition/,
  /Explorer/,
  /Bronco/,
  /Escape/,
  /Blazer/,
  /Equinox/,
  /Traverse/,
  /Highlander/,
  /Sequoia/,
  /Pathfinder/,
  /Armada/,
  /Frontier/,
  /Titan/,
  /Navara/,
  /Outback/,
  /Forester/,
  /Crosstrek/,
  /Ascent/,
  /Wrangler/,
  /Gladiator/,
  /Grand Cherokee/,
  /Wagoneer/,
  /Durango/,
  /Journey/,
  /Transit Connect/,
  /Astro Van/,
  /Express/,
  /E-150/,
  /E-250/,
  /E-350/,
  /E-450/,
  /ProMaster/,
  /ProMaster City/,
  /NV200/,
  /NV1500/,
  /NV2500/,
  /NV3500/,
  /Odyssey/,
  /Sienna/,
  /Pacifica/,
  /Caravan/,
  /Town & Country/,
  /Model Y/,
  /Model X/,
];

const HEAVY_COMMERCIAL_MODEL_PATTERNS: RegExp[] = [
  /Cascadia/,
  /Columbia/,
  /Coronado/,
  /Condor/,
  /Argosy/,
  /108SD/,
  /114SD/,
  /eCascadia/,
  /eM2/,
  /T680/,
  /T880/,
  /T800/,
  /W900/,
  /W990/,
  /^579$/,
  /^589$/,
  /^567$/,
  /^389$/,
  /^379$/,
  /^359$/,
  /Medium Duty COE/,
  /Conventional Type Truck/,
  /Cab Behind Engine/,
  /Cab Over Engine/,
  /Forward Control Type Truck/,
  /Coach-Type Rear Engine Bus/,
  /Incomplete Vehicle/,
  /Tractor/,
  /Motorhome Chassis/,
  /^L[0-9]{3,4}/,
  /^LT[0-9]/,
  /^LN[0-9]/,
  /^LL[0-9]/,
  /^LA[0-9]/,
  /^LS[0-9]/,
  /^FL[0-9]/,
  /^FLD/,
  /^FLB$/,
  /^FLS/,
  /^FC[0-9]/,
  /^B[0-9]/,
  /^C[0-9]{3,4}/,
  /^CT[0-9]/,
  /^CL[0-9]/,
  /^A[0-9]{4}/,
  /^AT[0-9]/,
  /^P[0-9]/,
  /NPR/,
  /NQR/,
  /NRR/,
  /^F[67]/,
  /^FRR/,
  /^FSR/,
  /^FTR/,
  /^H-Series/,
  /^Hino/,
  /Western Star/,
  /Unimog/,
  /Sport Chassis/,
  /Cutaway Chassis/,
  /Platform Truck/,
  /Chassis/,
  /Conventional/,
  /^3 ton$/,
  /^B7$/,
  /^C[567]$/,
  /^P - Series$/,
  /^P6S$/,
  /^R Conventional$/,
  /^S6$/,
  /^S7$/,
  /^V Conventional$/,
  /Hi-Cube/,
  /BrightDrop/,
];

function normalizeModelName(name: string): string {
  return name.trim().toLowerCase();
}

function matchesAnyPattern(name: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(name));
}

export function isLightPersonalModel(modelName: string): boolean {
  const normalized = normalizeModelName(modelName);
  if (LIGHT_MODEL_EXCEPTIONS.has(normalized)) {
    return true;
  }
  return matchesAnyPattern(modelName, LIGHT_PERSONAL_MODEL_PATTERNS);
}

export function isHeavyCommercialModel(modelName: string): boolean {
  const normalized = normalizeModelName(modelName);
  if (LIGHT_MODEL_EXCEPTIONS.has(normalized)) {
    return false;
  }
  if (isLightPersonalModel(modelName)) {
    return false;
  }
  return matchesAnyPattern(modelName, HEAVY_COMMERCIAL_MODEL_PATTERNS);
}

/** Pickups, SUVs, vans, and other personal vehicles that belong in the car category. */
export function isConsumerVehicleModel(modelName: string): boolean {
  return isLightPersonalModel(modelName);
}
