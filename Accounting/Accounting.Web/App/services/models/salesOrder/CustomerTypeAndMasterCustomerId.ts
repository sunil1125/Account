/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />

import refSystem = require('durandal/system');

/* File Created: Dec 12, 2014
** Created By: Chandan
*/
export module Model {
    export class CustomerTypeAndMasterCustomerId {
        TermType: number;
        TermDescription: string;
        MasterCustomerId: number;
        constructor(args?: ICustomerTypeAndMasterCustomerId) {
            this.TermType = refSystem.isObject(args) ? args.TermType : 0;
            this.TermDescription = refSystem.isObject(args) ? args.TermDescription : '';
            this.MasterCustomerId = refSystem.isObject(args) ? args.MasterCustomerId : 0;
        }
    }
}