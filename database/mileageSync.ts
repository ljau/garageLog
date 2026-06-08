import type * as SQLite from 'expo-sqlite';

type SqlExecutor = Pick<SQLite.SQLiteDatabase, 'getFirstAsync' | 'runAsync' | 'getAllAsync'>;

export async function getMaxMaintenanceMileage(
  vehicleId: string,
  db: SqlExecutor,
): Promise<number | null> {
  const result = await db.getFirstAsync<{ max_mileage: number | null }>(
    `SELECT MAX(mileage) AS max_mileage FROM maintenance_records WHERE vehicle_id = ?`,
    vehicleId,
  );

  return result?.max_mileage ?? null;
}

export async function recalculateVehicleCurrentMileage(
  vehicleId: string,
  db: SqlExecutor,
  ownerDeclaredMileage?: number,
): Promise<void> {
  const maxMaintenance = await getMaxMaintenanceMileage(vehicleId, db);

  let newMileage: number | null = null;

  if (ownerDeclaredMileage !== undefined) {
    newMileage = Math.max(ownerDeclaredMileage, maxMaintenance ?? 0);
  } else if (maxMaintenance !== null) {
    newMileage = maxMaintenance;
  }

  if (newMileage === null) {
    return;
  }

  await db.runAsync(
    `UPDATE vehicles SET current_mileage = ? WHERE id = ?`,
    newMileage,
    vehicleId,
  );
}

export async function maybeBumpVehicleMileage(
  vehicleId: string,
  mileage: number,
  db: SqlExecutor,
): Promise<void> {
  const vehicle = await db.getFirstAsync<{ current_mileage: number }>(
    `SELECT current_mileage FROM vehicles WHERE id = ?`,
    vehicleId,
  );

  if (!vehicle || mileage <= vehicle.current_mileage) {
    return;
  }

  await db.runAsync(
    `UPDATE vehicles SET current_mileage = ? WHERE id = ?`,
    mileage,
    vehicleId,
  );
}

export async function repairStaleVehicleMileages(db: SqlExecutor): Promise<void> {
  const vehicles = await db.getAllAsync<{ id: string; current_mileage: number }>(
    `SELECT id, current_mileage FROM vehicles`,
  );

  for (const vehicle of vehicles) {
    const maxMaintenance = await getMaxMaintenanceMileage(vehicle.id, db);

    if (maxMaintenance !== null && maxMaintenance > vehicle.current_mileage) {
      await db.runAsync(
        `UPDATE vehicles SET current_mileage = ? WHERE id = ?`,
        maxMaintenance,
        vehicle.id,
      );
    }
  }
}
