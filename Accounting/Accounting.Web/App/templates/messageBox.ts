/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/*
** <summary>
** Message Box View Model.
** </summary>
** <createDetails>
** <id>US8282</id> <by>SANKESH POOJARI</by> <date>04-15-2014</date>
** </createDetails>}
** <changeHistory>
** <id></id> <by></by> <date></date>
** </changeHistory>
*/
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
import refApp = require('durandal/app');
import refSystem = require('durandal/system');

/**
* Class for Message Box control for common DialogBox.
*/

class MessageBox {
    message: string;
    title: string;
	options: Array<IMessageBoxButtonOption>;
	ishtmlBinding: boolean;
	bindingObject: any;

    constructor() {
        this.title = '';
        this.message = '';
		this.options = new Array<IMessageBoxButtonOption>();
		this.ishtmlBinding = false;
		this.bindingObject = {};
    }

    onClick(option: IMessageBoxButtonOption , dialogResult) {
        var self = this;

        if (refSystem.isFunction(option.callback)) {
			dialogResult.__dialog__.close(this, dialogResult);
			var result = option.callback.apply(null, [self.bindingObject]);
            if (result) {
            }
			else {
                refSystem.log('Error occurred in the callback function');
            }
        }
    }

    public activate(data: IMessageBoxOption) {
        if (data != null) {
            if (refSystem.isString(data.message) && data.message) {
                this.message = data.message;
			}
			if (refSystem.isString(data.title) && data.title) {
				this.title = data.title;
			}
			if (refSystem.isBoolean(data.ishtmlBinding) && data.ishtmlBinding) {
				this.ishtmlBinding = data.ishtmlBinding;
			}
			if (refSystem.isObject(data.bindingObject)) {
				this.bindingObject = data.bindingObject;
			}
            if (data.options != null) {
                data.options.forEach((item) => {
                    this.options.push(item);
                });
            }
            else
            {
                this.options = [
                    {id: 0, name: 'OK', callback: (): boolean => {
                            return true;
                        }
                    }];
            }
        }
        else
        {
            refSystem.log('error in the calling method of MessageBox');
        }
    }

    public compositionComplete() {
        //var btnText = jQuery('#btnFooter').text().toUpperCase();
        //if (btnText == "YES" || btnText == "OK") {
        //    jQuery('#btnFooter').css("background", "#0055A6");
        //    //#0055A6
        //    //#2D72D9
        //}
    }
}
return MessageBox;