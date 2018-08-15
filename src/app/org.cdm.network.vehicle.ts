import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
import {Oem} from './org.cdm.network.oem';
// export namespace org.cdm.network.vehicle{
   export class Vehicle extends Asset {
      vehicleId: string;
      vin: string;
      oem: Oem;
      manufacturingDate: Date;
      drivenUnits: number;
      unitSystemType: UnitSystem;
      operatingHours: number;
   }
   export enum UnitSystem {
      Metric,
      Miles,
   }
   export class UpdateVehicleData extends Transaction {
      vehicle: Vehicle;
      newDrivenUnits: number;
      newOperatingHours: number;
   }
// }
