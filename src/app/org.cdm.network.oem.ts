import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
import {Vehicle} from './org.cdm.network.vehicle';
// export namespace org.cdm.network.oem{
   export class Oem extends Participant {
      oemId: string;
      name: string;
   }
   export class RegisterNewVehicle extends Transaction {
      vehicle: Vehicle;
   }
// }
