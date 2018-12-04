/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/CarrierModel.d.ts" />

export class CarrierDocument {
	CarrierPacketDocument: Array<ICarrierPacketDocument>;
	UploadedFileDetails: any;
	CarrierId: number;

	constructor(item?: ICarrierPacketDocument) {
		var self = this;
		if (item) {
		}

		return self;
	}
}

export class CarrierPacketDocument{
	DocumentPath: string;
	CarrierId: number;
	PackageType: number;
	InsuranceExpirationDate: Date;
	IsInsuranceExpired: boolean;
	DocumentPathToView: string;
	IsDocumentsUploaded: boolean;
	DocumentName: string;
	CarrierCode: string;

	constructor(item?: ICarrierPacketDocument) {
		var self = this;
		if (item) {
			self.DocumentPath = item.DocumentPath;
			self.CarrierId = item.CarrierId;
			self.PackageType = item.PackageType;
			self.InsuranceExpirationDate = item.InsuranceExpirationDate;
			self.IsInsuranceExpired = item.IsInsuranceExpired;
			self.DocumentPathToView = item.DocumentPathToView;
			self.IsDocumentsUploaded = item.IsDocumentsUploaded;
			self.DocumentName = item.DocumentName;
			CarrierCode: item.CarrierCode;
		}

		return self;
	}
}