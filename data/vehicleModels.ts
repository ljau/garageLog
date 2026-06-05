import { getModelsByBrand } from 'auto-parts-db';
import { getMakes, getModels } from '@meterapp/vehicle-db';

import { normalizeBrandKey } from '@/data/vehicleBrandFormat';
import { isKnownBrand } from '@/data/vehicleBrands';
import { motorcycleModelsForBrand } from '@/data/motorcycleModels';
import {
  isConsumerVehicleModel,
  isHeavyCommercialModel,
} from '@/data/vehicleModelFilters';
import { supplementalTruckModelsForBrand } from '@/data/supplementalTruckModels';
import { nhtsaMakeCandidates } from '@/data/vehicleMakeAliases';
import type { VehicleCategory } from '@/models/vehicle';

const PASSENGER_CAR_TYPE_ID = 2;
const TRUCK_TYPE_ID = 3;
const MPV_TYPE_ID = 7;

function findMake(category: VehicleCategory, brand: string) {
  const candidateKeys = nhtsaMakeCandidates(category, brand).map((name) =>
    normalizeBrandKey(name),
  );

  return getMakes().find((make) => candidateKeys.includes(normalizeBrandKey(make.makeName)));
}

function uniqueSortedModelNames(modelNames: string[]): string[] {
  return [...new Set(modelNames)].sort((a, b) => a.localeCompare(b));
}

function modelNamesForType(makeId: number, vehicleTypeId: number): string[] {
  return getModels({ makeId, vehicleTypeId }).map((item) => item.modelName);
}

function modelsFromAutoPartsDb(brand: string): string[] {
  return getModelsByBrand(brand).map((item) => item.name);
}

function modelsForCarFromVehicleDb(brand: string): string[] {
  const make = findMake('car', brand);
  if (!make) {
    return [];
  }

  const passengerAndMpv = [
    ...modelNamesForType(make.makeId, PASSENGER_CAR_TYPE_ID),
    ...modelNamesForType(make.makeId, MPV_TYPE_ID),
  ].filter((name) => !isHeavyCommercialModel(name));

  const personalTrucks = modelNamesForType(make.makeId, TRUCK_TYPE_ID).filter(
    (name) => !isHeavyCommercialModel(name),
  );

  return uniqueSortedModelNames([...passengerAndMpv, ...personalTrucks]);
}

function modelsForCar(brand: string): string[] {
  return uniqueSortedModelNames([
    ...modelsForCarFromVehicleDb(brand),
    ...modelsFromAutoPartsDb(brand),
  ]);
}

function modelsForTruckFromVehicleDb(brand: string): string[] {
  const make = findMake('truck', brand);
  if (!make) {
    return [];
  }

  const modelNames = modelNamesForType(make.makeId, TRUCK_TYPE_ID).filter(
    (name) => !isConsumerVehicleModel(name),
  );
  return uniqueSortedModelNames(modelNames);
}

function modelsForTruck(brand: string): string[] {
  return uniqueSortedModelNames([
    ...modelsForTruckFromVehicleDb(brand),
    ...supplementalTruckModelsForBrand(brand),
  ]);
}

export function modelsForVehicle(category: VehicleCategory, brand: string): readonly string[] {
  if (!brand.trim()) {
    return [];
  }
  if (category === 'other' || !isKnownBrand(category, brand)) {
    return [];
  }
  if (category === 'motorcycle') {
    return motorcycleModelsForBrand(brand);
  }
  if (category === 'car') {
    return modelsForCar(brand);
  }
  return modelsForTruck(brand);
}

export function isKnownModel(
  category: VehicleCategory,
  brand: string,
  model: string,
): boolean {
  const catalog = modelsForVehicle(category, brand);
  if (!catalog.length) {
    return false;
  }
  const normalized = model.trim().toLowerCase();
  return catalog.some((item) => item.toLowerCase() === normalized);
}
