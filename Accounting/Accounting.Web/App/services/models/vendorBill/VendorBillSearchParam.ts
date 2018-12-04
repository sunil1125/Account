/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/VendorBillSearchModel.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />

/* File Created: April 14, 2014
** Created By: Achal Rastogi
*/

export module Models {
    export class VendorBillSearchParam {
        ItemID: string;
		VendorName: string;
        FromDate: Date;
        ToDate: Date;
        Amount: number;
        ProcessStatus: number;
        CustomerBol: string;
        ProNumber: string;
        BolNumber: string;
        ShipperComName: string;
        ConsigneeCompName: string;
        ShipperZipCode: string;
        ConsigneeZipcode: string;
        CustomerName: string;
        UserId: number;
        RoleId: number;
        PageNumber: number;
        PageSize: number;
        PagesFound: number;
        PoNumber: string;
        RefNumber: string;
        ShipperCity: string;
        ConsigneeCity: string;
        TotalWeight: number;
		TotalPieces: number;
		DateRange: number;

        constructor(args?: IVendorBillSearchParameter) {
            if (args) {
                this.ItemID = args.ItemID ? args.ItemID : '';
				this.VendorName = args.VendorName ? args.VendorName : '';
                this.FromDate = args.FromDate ? args.FromDate : new Date();
                this.ToDate = args.ToDate ? args.ToDate : new Date();
                this.Amount = args.Amount ? args.Amount : 0;
                this.ProcessStatus = args.ProcessStatus ? args.ProcessStatus : 0;
                this.CustomerBol = args.CustomerBol ? args.CustomerBol : '';
                this.ProNumber = args.ProNumber ? args.ProNumber :'';
                this.BolNumber = args.BolNumber ? args.BolNumber : '';
                this.ShipperComName = args.ShipperComName ? args.ShipperComName : '';
                this.ConsigneeCompName = args.ConsigneeCompName ? args.ConsigneeCompName : '';
                this.ShipperZipCode = args.ShipperZipCode ? args.ShipperZipCode : '';
                this.ConsigneeZipcode = args.ConsigneeZipcode ? args.ConsigneeZipcode : '';
                this.CustomerName = args.CustomerName ? args.CustomerName : '';
                this.UserId = args.UserId ? args.UserId : 0;
                this.RoleId = args.RoleId ? args.RoleId : 0;
                this.PageNumber = args.PageNumber ? args.PageNumber : 0;
                this.PageSize = args.PageSize ? args.PageSize : 0;
                this.PagesFound = args.PagesFound ? args.PagesFound : 0;
                this.PoNumber = args.PoNumber ? args.PoNumber : '';
                this.RefNumber = args.RefNumber ? args.RefNumber : '';
                this.ShipperCity = args.ShipperCity ? args.ShipperCity : '';
                this.ConsigneeCity = args.ConsigneeCity ? args.ConsigneeCity : '';
                this.TotalWeight = args.TotalWeight ? args.TotalWeight : 0;
				this.TotalPieces = args.TotalPieces ? args.TotalPieces : 0;
				this.DateRange = args.DateRange ? args.DateRange : 0;
            }
        }
    }
}