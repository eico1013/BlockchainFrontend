/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { VehicleService } from './Vehicle.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-vehicle',
  templateUrl: './Vehicle.component.html',
  styleUrls: ['./Vehicle.component.css'],
  providers: [VehicleService]
})
export class VehicleComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  vehicleId = new FormControl('', Validators.required);
  vin = new FormControl('', Validators.required);
  oem = new FormControl('', Validators.required);
  manufacturingDate = new FormControl('', Validators.required);
  drivenUnits = new FormControl('', Validators.required);
  unitSystemType = new FormControl('', Validators.required);
  operatingHours = new FormControl('', Validators.required);

  constructor(public serviceVehicle: VehicleService, fb: FormBuilder) {
    this.myForm = fb.group({
      vehicleId: this.vehicleId,
      vin: this.vin,
      oem: this.oem,
      manufacturingDate: this.manufacturingDate,
      drivenUnits: this.drivenUnits,
      unitSystemType: this.unitSystemType,
      operatingHours: this.operatingHours
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceVehicle.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.cdm.network.vehicle.Vehicle',
      'vehicleId': this.vehicleId.value,
      'vin': this.vin.value,
      'oem': this.oem.value,
      'manufacturingDate': this.manufacturingDate.value,
      'drivenUnits': this.drivenUnits.value,
      'unitSystemType': this.unitSystemType.value,
      'operatingHours': this.operatingHours.value
    };

    this.myForm.setValue({
      'vehicleId': null,
      'vin': null,
      'oem': null,
      'manufacturingDate': null,
      'drivenUnits': null,
      'unitSystemType': null,
      'operatingHours': null
    });

    return this.serviceVehicle.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'vehicleId': null,
        'vin': null,
        'oem': null,
        'manufacturingDate': null,
        'drivenUnits': null,
        'unitSystemType': null,
        'operatingHours': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.cdm.network.vehicle.Vehicle',
      'vin': this.vin.value,
      'oem': this.oem.value,
      'manufacturingDate': this.manufacturingDate.value,
      'drivenUnits': this.drivenUnits.value,
      'unitSystemType': this.unitSystemType.value,
      'operatingHours': this.operatingHours.value
    };

    return this.serviceVehicle.updateAsset(form.get('vehicleId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceVehicle.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceVehicle.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'vehicleId': null,
        'vin': null,
        'oem': null,
        'manufacturingDate': null,
        'drivenUnits': null,
        'unitSystemType': null,
        'operatingHours': null
      };

      if (result.vehicleId) {
        formObject.vehicleId = result.vehicleId;
      } else {
        formObject.vehicleId = null;
      }

      if (result.vin) {
        formObject.vin = result.vin;
      } else {
        formObject.vin = null;
      }

      if (result.oem) {
        formObject.oem = result.oem;
      } else {
        formObject.oem = null;
      }

      if (result.manufacturingDate) {
        formObject.manufacturingDate = result.manufacturingDate;
      } else {
        formObject.manufacturingDate = null;
      }

      if (result.drivenUnits) {
        formObject.drivenUnits = result.drivenUnits;
      } else {
        formObject.drivenUnits = null;
      }

      if (result.unitSystemType) {
        formObject.unitSystemType = result.unitSystemType;
      } else {
        formObject.unitSystemType = null;
      }

      if (result.operatingHours) {
        formObject.operatingHours = result.operatingHours;
      } else {
        formObject.operatingHours = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'vehicleId': null,
      'vin': null,
      'oem': null,
      'manufacturingDate': null,
      'drivenUnits': null,
      'unitSystemType': null,
      'operatingHours': null
      });
  }

}
