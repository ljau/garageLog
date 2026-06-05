import { getBrands as getAutoPartsBrands } from 'auto-parts-db';
import { getMakes, getModels } from '@meterapp/vehicle-db';

import { motorcycleBrandNames } from '@/data/motorcycleModels';
import { formatNhtsaBrandName, mergeBrandNames, normalizeBrandKey } from '@/data/vehicleBrandFormat';
import { isConsumerVehicleModel, isHeavyCommercialModel } from '@/data/vehicleModelFilters';
import { supplementalTruckBrandNames } from '@/data/supplementalTruckModels';
import type { VehicleCategory } from '@/models/vehicle';

interface MakeClassification {
  hasPassenger: Set<number>;
  hasMpv: Set<number>;
  passengerModelCount: Map<number, number>;
  mpvModelCount: Map<number, number>;
  heavyTruckCount: Map<number, number>;
  consumerTruckCount: Map<number, number>;
}

let makeClassification: MakeClassification | null = null;
let brandCatalog: Record<Exclude<VehicleCategory, 'other'>, readonly string[]> | null = null;

const MIN_NHTSA_PASSENGER_MODELS = 20;
const JUNK_MAKE_NAME_PATTERN =
  /\b(INC|LLC|CORP|CORPORATION|GROUP|CUSTOM|REPLICA|COACHWORKS|ENTERPRISES|INDUSTRIES)\b/i;

function isLikelyRealAutomaker(makeName: string): boolean {
  if (JUNK_MAKE_NAME_PATTERN.test(makeName)) {
    return false;
  }
  if (makeName.length > 40) {
    return false;
  }
  if (makeName.split(/\s+/).length > 4) {
    return false;
  }
  return true;
}

function getMakeClassification(): MakeClassification {
  if (makeClassification) {
    return makeClassification;
  }

  const hasPassenger = new Set<number>();
  const hasMpv = new Set<number>();
  const passengerModelCount = new Map<number, number>();
  const mpvModelCount = new Map<number, number>();
  const heavyTruckCount = new Map<number, number>();
  const consumerTruckCount = new Map<number, number>();

  for (const model of getModels()) {
    if (model.vehicleTypeId === 2) {
      hasPassenger.add(model.makeId);
      passengerModelCount.set(model.makeId, (passengerModelCount.get(model.makeId) ?? 0) + 1);
    }
    if (model.vehicleTypeId === 7) {
      hasMpv.add(model.makeId);
      mpvModelCount.set(model.makeId, (mpvModelCount.get(model.makeId) ?? 0) + 1);
    }
    if (model.vehicleTypeId === 3) {
      if (isHeavyCommercialModel(model.modelName)) {
        heavyTruckCount.set(model.makeId, (heavyTruckCount.get(model.makeId) ?? 0) + 1);
      }
      if (isConsumerVehicleModel(model.modelName)) {
        consumerTruckCount.set(model.makeId, (consumerTruckCount.get(model.makeId) ?? 0) + 1);
      }
    }
  }

  makeClassification = {
    hasPassenger,
    hasMpv,
    passengerModelCount,
    mpvModelCount,
    heavyTruckCount,
    consumerTruckCount,
  };
  return makeClassification;
}

function passengerModelCount(makeId: number): number {
  const { passengerModelCount, mpvModelCount } = getMakeClassification();
  return (passengerModelCount.get(makeId) ?? 0) + (mpvModelCount.get(makeId) ?? 0);
}

function qualifiesAsTruckBrand(makeId: number): boolean {
  const { hasPassenger, heavyTruckCount, consumerTruckCount } = getMakeClassification();
  const heavy = heavyTruckCount.get(makeId) ?? 0;
  if (heavy === 0) {
    return false;
  }

  const consumer = consumerTruckCount.get(makeId) ?? 0;
  const isPassengerCarMaker = hasPassenger.has(makeId);

  if (isPassengerCarMaker && consumer >= 10 && heavy < consumer * 2) {
    return false;
  }

  return true;
}

function buildCarBrands(): readonly string[] {
  const autoPartsBrands = getAutoPartsBrands();
  const autoPartsKeys = new Set(autoPartsBrands.map((brand) => normalizeBrandKey(brand)));
  const { hasPassenger, hasMpv } = getMakeClassification();
  const passengerMakeIds = new Set([...hasPassenger, ...hasMpv]);

  const nhtsaCarBrands = getMakes()
    .filter((make) => {
      if (!passengerMakeIds.has(make.makeId)) {
        return false;
      }
      if (!isLikelyRealAutomaker(make.makeName)) {
        return false;
      }
      const key = normalizeBrandKey(formatNhtsaBrandName(make.makeName));
      if (autoPartsKeys.has(key)) {
        return false;
      }
      return passengerModelCount(make.makeId) >= MIN_NHTSA_PASSENGER_MODELS;
    })
    .map((make) => formatNhtsaBrandName(make.makeName));

  return mergeBrandNames([...autoPartsBrands, ...nhtsaCarBrands]);
}

function buildTruckBrands(): readonly string[] {
  const nhtsaTruckBrands = getMakes()
    .filter((make) => qualifiesAsTruckBrand(make.makeId) && isLikelyRealAutomaker(make.makeName))
    .map((make) => formatNhtsaBrandName(make.makeName));

  return mergeBrandNames([...supplementalTruckBrandNames(), ...nhtsaTruckBrands]);
}

function buildBrandCatalog(): Record<Exclude<VehicleCategory, 'other'>, readonly string[]> {
  return {
    car: buildCarBrands(),
    motorcycle: motorcycleBrandNames(),
    truck: buildTruckBrands(),
  };
}

export function getBrandCatalog(): Record<Exclude<VehicleCategory, 'other'>, readonly string[]> {
  if (!brandCatalog) {
    brandCatalog = buildBrandCatalog();
  }
  return brandCatalog;
}
