import {
  BodyType,
  DriveType,
  FuelType,
  PartType,
  Transmission,
} from '@prisma/client';

export class CreateOrder {
  id?: string;
  modelId: string;
  brandId: string;
  transportType: string;
  transmission: Transmission;
  bodyType: BodyType;
  drive: DriveType;
  year: number;
  engineVolume: number;
  vin: string;
  carParts: string;
  fuelType: FuelType[];
  partType: PartType[];
}
