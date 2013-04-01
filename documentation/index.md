# ADK Module

## Description

The *ADK module* provides a simple support for ADK (Android Open *A*ccessory *D*evelopment *K*it).
ADK is a connection scheme between Android and Accessory (Arduino and so on) via USB, established by Google.
ADK make it available to create easily new Accessory (equipments and gadgets and so on) connected with Android powered devices.
But ADK supports originally only Java for the development of app, so it may be hard to write app for Arduino users.

If you use Titanium with ADK module, you can write Android app for ADK using JavaScript, and can communicate with Accessory very easily.


For details of ADK, see bellow site  :

<http://developer.android.com/guide/topics/usb/adk.html>

For the examples of the products and gadgets based on ADK , see also bellow site :

<http://www.open-accessories.com/>

For Arduino, see also bellow site :

<http://www.arduino.cc/>

## Getting Started

View the [Using Titanium Modules](https://wiki.appcelerator.org/display/tis/Using+Titanium+Modules) document for instructions on getting started with using this module in your application.


## System requirements

+	Target Android device : must support ADK .
	
Google API 2.3.4 (API level 10) or later  
Google API 3.1 (API Level 12) or later  
	
Note : ADK is originally implemented in API Level 12, thereafter, it is back-ported to API Level 10 for making available to use ADK on many Android smart phones now in use.  
The version number 'SDK 2.3.4' is a missing number, and 'SDK 2.3.3' includes the back-ported ADK among current SDKs.  
		
Note : ADK is not a required feature of Android. Therefor all Android devices compatible with above API versions does not support ADK.  
You should check whether your target Android devices support ADK.  
		
Note : Android emulator does not support ADK because of its mechanism. It is necessary for the developer to use *REAL* Android device that supports ADK.

+	Arduino : must support ADK (available to connect as USB host). 
 
The list of ADK compatible boards by Google is here :  
[Android Open Accessory Development Kit](http://developer.android.com/guide/topics/usb/adk.html)
	
In addition, various ADK supported boards are released by many manufacturers.
	
## Accessing the adk Module

To access this module from JavaScript, you would do the following:

	var adk = require("jp.isisredirect.adk");

The adk variable is a reference to the Module object.	

## Reference

### method
#### sendData  
Asynchronously send data specified by 1st argument *data* to Accessory (Arduino and so on).
##### Arguments
+	data [Ti.Buffer] : data to send. Sending data length is defined by Ti.Buffer.length.

### property
#### isConnected  [Boolean]
Permission: read-only
Obtain whether Android is connected to Accessory (Arduino and so on).  
true means 'connected' , and false means 'disconnected'.

### events
#### connected
fired when Android is connected to Accessory (Arduino and so on).  
No property.

#### disconnected
fired when Android is disconnected with Accessory (Arduino and so on).
No property.

#### received
fired when Android receives data from Accessory (Arduino and so on).
##### property
Property of the object passed to the event callback:

+	data [Ti.Buffer] :  received data  

## Usage
If any required configuration for ADK is not done, then ADK module cannot work fine.
For details of setting configurations of your Titanium project that is necessary to use ADK, see [Step by step](./stepbystep.html).
Here only to show sample code for a simple explanation about the usage of ADK module.  
Sample code is below:

     var adk = require('jp.isisredirect.adk');  
     // callback for connected event  
     adk.addEventListener("connected", function() {  
     	var a = Titanium.UI.createAlertDialog({  
     		title:'Accessory',  
     		message:'connected'  
     	});  
     	a.show();  
     });  
     // callback for disconnected event  
     adk.addEventListener("disconnected", function() {  
     	var a = Titanium.UI.createAlertDialog({  
     		title:'Accessory',  
     		message:'disconnected'  
     	});  
     	a.show();  
     });  
     // callback for received event  
     adk.addEventListener("received", function(e) {  
     	var length = e.data.length;  
     	if (length < 5) {  
     		return;  
     	}  
     	var i = 0;  
     	var command = Ti.Codec.decodeNumber({  
     		source: e.data,  
     		position: i,  
     		type: Ti.Codec.TYPE_BYTE  
     	});  
     	i++;  
     	var sw = Ti.Codec.decodeNumber({  
     		source: e.data,  
     		position: i,  
     		type: Ti.Codec.TYPE_SHORT,  
     		byteOrder : Ti.Codec.BIG_ENDIAN  
     	});  
     	i += 2;  
     	var val = Ti.Codec.decodeNumber({  
     		source: e.data,  
     		position: i,  
     		type: Ti.Codec..TYPE_SHORT,  
     		byteOrder : Ti.Codec.BIG_ENDIAN  
     	});  
     }  
     // sending data  
     buffer = Ti.createBuffer({ length: 3 }); // make 3 bytes data buffer.   
     Ti.Codec.encodeNumber({  
     	source: 0x01,  
     	dest: buffer,  
     	position: 0,  
     	type: Ti.Codec.TYPE_BYTE  
     });  
     Ti.Codec.encodeNumber({  
     	source: 0x02,  
     	dest: buffer,  
     	position: 1,  
     	type: Ti.Codec.TYPE_BYTE  
     });  
     Ti.Codec.encodeNumber({  
     	source: 0x03,  
     	dest: buffer,  
     	position: 2,  
     	type: Ti.Codec.TYPE_BYTE  
     });  
     adk.sendData(buffer);	
     //-- end of code --



## Author

Kastumi ISHIDA (isis re-direct) in k.i.office.

isis.redirect4@gmail.com


## License
Copyright (c) 2013 Katsumi ISHIDA. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.