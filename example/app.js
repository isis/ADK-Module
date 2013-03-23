// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// start window
var win = Ti.UI.createWindow({
	backgroundColor : 'white'
});
var label = Ti.UI.createLabel({
	text : 'ADK demo'
});
win.add(label);
win.open();


var infotext ='TiDemoKit \n\n'
+'TiDemoKit is a clone of Google\'s ADK DemoKit by using Titanium Mobile (Appcelerator Inc.) with the ADK module.\n'
+'It demonstrates the ADK module can make it easy to create an application supporting ADK by using JavaScript in Titanium Mobile.\n'
+'\n'
+'More informations :\n'
+' \n'
+' http://code.google.com/p/tidemokit/\n'
;


/// info
var infowin = Titanium.UI.createWindow({
	title : 'Info',
	backgroundColor : '#222'
});
var labelinfo = Ti.UI.createLabel({
	text : infotext,
	//height:'50dp',
	width : '300dp',
	left : '10dp',
	top : '50dp'
});
infowin.add(labelinfo);

var closebutton = Ti.UI.createButton({
	title : 'close',
	height : '30dp',
	width : '100dp',
	//left:'250dp',
	top : '350dp'

});
closebutton.addEventListener('click', function(event) {
	infowin.close({
		animated : true
	});
});
infowin.add(closebutton);

// report
function makereport(image) {
	var emailDialog = Titanium.UI.createEmailDialog();

	emailDialog.setSubject('report by TiDemoKit');
	emailDialog.setToRecipients(['isis.redirect4@gmail.com']);
	var t = text = '\n\n[device info]' + '\n/model:' + Ti.Platform.model + '\n/architecture:' + Ti.Platform.architecture + '\n/name:' + Ti.Platform.name + '\n/osname:' + Ti.Platform.osname + '\n/ostype:' + Ti.Platform.ostype + '\n/version:' + Ti.Platform.version + '\n/locale:' + Ti.Platform.locale;
	emailDialog.setMessageBody('Is your device OK? \nselect one of them \nand delete another \n-> OK / NG \nPlease send any comments:\n\n\n' + t);
	emailDialog.addAttachment(image);
	emailDialog.addEventListener('complete', function(e) {
		Ti.API.info("e.result " + e.result);
		switch (e.result) {
			case (e.source.SENT):
				if (e.success) {
					var alertDialog = Titanium.UI.createAlertDialog({
						title : 'Thank you for your report',
						message : 'Your feedback will be reflected in better product.',
						buttonNames : ['Close']
					});
					alertDialog.show();
				} else {
					var alertDialog = Titanium.UI.createAlertDialog({
						title : 'Error',
						message : ('Error occured when send mail. Please try again.\n' + e.error),
						buttonNames : ['Close']//,
					});
					alertDialog.show();
				}
				break;
			case e.source.SAVED:
				// not support on Android
				break;
			case e.source.CANCELED:
				// not support on Android
				{
					var alertDialog = Titanium.UI.createAlertDialog({
						title : 'Please report',
						message : 'Your feedback will be reflected in better product. Especially if flashlight do not work fine, we need your help.',
						buttonNames : ['Close']//,
					});
					alertDialog.show();
				}
				break;
			case e.source.FAILED:
				{
					var alertDialog = Titanium.UI.createAlertDialog({
						title : 'Error',
						message : ('Error occured when send mail. Please try again.\n' + e.error),
						buttonNames : ['Close']//,
					});
					alertDialog.show();
				}
				break;
		}
	});
	emailDialog.open();
}

function takeshot1() {
	Titanium.Media.takeScreenshot(function(event) {
		var image = event.media;
		makereport(image);
	});
}

// create tab group
var tabGroup = Titanium.UI.createTabGroup({
});
//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({
	title : 'In',
	backgroundColor : '#222'
});

var tab1 = Titanium.UI.createTab({
	icon : 'light_in.png',
	title : 'In',
	window : win1
});

var labelstate = Ti.UI.createLabel({
	text : 'disconected',
	height : '50dp',
	width : '120dp',
	left : '100dp',
	top : '0dp'
});
win1.add(labelstate);
win1.add(Ti.UI.createLabel({
	text : 'Accesory',
	height : '50dp',
	width : '100dp',
	left : '1dp',
	top : '0dp'
}));
var tempstate = Ti.UI.createLabel({
	text : '0',
	height : '50dp',
	width : '270dp',
	left : '100dp',
	top : '51dp'
});
win1.add(tempstate);
win1.add(Ti.UI.createLabel({
	text : 'Temp:',
	height : '50dp',
	width : '100dp',
	left : '1dp',
	top : '51dp'
}));
var lightstate = Ti.UI.createLabel({
	text : '0',
	height : '50dp',
	width : '270dp',
	left : '100dp',
	top : '101dp'
});
win1.add(lightstate);
win1.add(Ti.UI.createLabel({
	text : 'Light:',
	height : '50dp',
	width : '100dp',
	left : '1dp',
	top : '101dp'
}));
var button1state = Ti.UI.createLabel({
	text : 'off',
	height : '50dp',
	width : '70dp',
	left : '100dp',
	top : '151dp'
});
win1.add(button1state);
var button2state = Ti.UI.createLabel({
	text : 'off',
	height : '50dp',
	width : '70dp',
	left : '130dp',
	top : '151dp'
});
win1.add(button2state);
var button3state = Ti.UI.createLabel({
	text : 'off',
	height : '50dp',
	width : '70dp',
	left : '160dp',
	top : '151dp'
});
win1.add(button3state);
var button4state = Ti.UI.createLabel({
	text : 'off',
	height : '50dp',
	width : '70dp',
	left : '190dp',
	top : '151dp'
});
win1.add(button4state);
var button5state = Ti.UI.createLabel({
	text : 'off',
	height : '50dp',
	width : '70dp',
	left : '230dp',
	top : '151dp'
});
win1.add(button5state);
win1.add(Ti.UI.createLabel({
	text : 'Button:',
	height : '50dp',
	width : '100dp',
	left : '1dp',
	top : '151dp'
}));
var joystickstate = Ti.UI.createLabel({
	text : '0 0',
	height : '50dp',
	width : '270dp',
	left : '100dp',
	top : '201dp'
});
win1.add(joystickstate);
win1.add(Ti.UI.createLabel({
	text : 'Joystick:',
	height : '50dp',
	width : '100dp',
	left : '3dp',
	top : '201dp'
}));

/// device info
win1.add(Ti.UI.createLabel({
	text : 'Device Info',
	height : '50dp',
	width : '100dp',
	left : '3dp',
	top : '250dp'
}));
var labeldeviceinfo = Ti.UI.createLabel({
	text : '',
	width : '220dp',
	left : '100dp',
	top : '250dp'
});

labeldeviceinfo.text = '' + '/' + Ti.Platform.model + '/' + Ti.Platform.architecture + '/' + Ti.Platform.name + '/' + Ti.Platform.osname + '/' + Ti.Platform.ostype + '/' + Ti.Platform.version + '/' + Ti.Platform.locale;
win1.add(labeldeviceinfo);

/// report
var reportButton = Ti.UI.createButton({
	title : 'send report',
	height : '30dp',
	width : '100dp',
	left : '200dp',
	top : '300dp'

});

reportButton.addEventListener('click', function(event) {
	takeshot1();
});

win1.add(reportButton);
var infobutton = Ti.UI.createButton({
	//title:'info',
	image : 'light_info.png',
	height : '29dp',
	width : '27dp',
	left : '250dp',
	top : '350dp'

});
infobutton.addEventListener('click', function(event) {
	infowin.open({
		animated : true,
		fullscreen : true
	});
});
win1.add(infobutton);

//
// create out window
//
var win2 = Titanium.UI.createWindow({
	title : 'Out',
	backgroundColor : '#222'
});

var tab2 = Titanium.UI.createTab({
	icon : 'light_out.png',
	title : 'Out',
	window : win2
});

var labelstate2 = Ti.UI.createLabel({
	text : 'disconected',
	height : '30dp',
	width : '120dp',
	left : '230dp',
	top : '20dp'
});
win2.add(labelstate2);
win2.add(Ti.UI.createLabel({
	text : 'Accesory',
	height : '30dp',
	width : '100dp',
	left : '230dp',
	top : '0dp'
}));
var relaybutton1 = Titanium.UI.createSwitch({
	value : false,
	title : 'Relay1',
	height : '30dp',
	width : '90dp',
	left : '230dp',
	top : '80dp'
});
win2.add(relaybutton1);
var relaybutton2 = Titanium.UI.createSwitch({
	value : false,
	title : 'Relay2',
	height : '30dp',
	width : '90dp',
	left : '230dp',
	top : '110dp'
});
win2.add(relaybutton2);
win2.add(Ti.UI.createLabel({
	text : 'Relay:',
	height : '30dp',
	width : '50dp',
	left : '230dp',
	top : '50dp'
}));

var servoslider1 = Titanium.UI.createSlider({
	min : 0,
	max : 255,
	value : 0,
	width : '170dp',
	height : '30dp',
	left : '51dp',
	top : '0dp'
});
win2.add(servoslider1);
var servoslider2 = Titanium.UI.createSlider({
	min : 0,
	max : 255,
	value : 0,
	width : '170dp',
	height : '30dp',
	left : '51dp',
	top : '30dp'
});
win2.add(servoslider2);
var servoslider3 = Titanium.UI.createSlider({
	min : 0,
	max : 255,
	value : 0,
	width : '170dp',
	height : '30dp',
	left : '51dp',
	top : '60dp'
});
win2.add(servoslider3);
win2.add(Ti.UI.createLabel({
	text : 'Servo:',
	height : '30dp',
	width : '50dp',
	left : '1dp',
	top : '0dp'
}));

var led1rslider = Titanium.UI.createSlider({
	min : 0,
	max : 255,
	value : 0,
	width : '170dp',
	height : '30dp',
	left : '51dp',
	top : '90dp'
});
win2.add(led1rslider);
win2.add(Ti.UI.createLabel({
	text : 'LED1:',
	height : '30dp',
	width : '50dp',
	left : '1dp',
	top : '90dp'
}));
var led1gslider = Titanium.UI.createSlider({
	min : 0,
	max : 255,
	value : 0,
	width : '170dp',
	height : '30dp',
	left : '51dp',
	top : '120dp'
});
win2.add(led1gslider);
var led1bslider = Titanium.UI.createSlider({
	min : 0,
	max : 255,
	value : 0,
	width : '170dp',
	height : '30dp',
	left : '51dp',
	top : '150dp'
});
win2.add(led1bslider);
var led2rslider = Titanium.UI.createSlider({
	min : 0,
	max : 255,
	value : 0,
	width : '170dp',
	height : '30dp',
	left : '51dp',
	top : '180dp'
});
win2.add(led2rslider);
win2.add(Ti.UI.createLabel({
	text : 'LED2:',
	height : '30dp',
	width : '50dp',
	left : '1dp',
	top : '180dp'
}));
var led2gslider = Titanium.UI.createSlider({
	min : 0,
	max : 255,
	value : 0,
	width : '170dp',
	height : '30dp',
	left : '51dp',
	top : '210dp'
});
win2.add(led2gslider);
var led2bslider = Titanium.UI.createSlider({
	min : 0,
	max : 255,
	value : 0,
	width : '170dp',
	height : '30dp',
	left : '51dp',
	top : '240dp'
});
win2.add(led2bslider);
var led3rslider = Titanium.UI.createSlider({
	min : 0,
	max : 255,
	value : 0,
	width : '170dp',
	height : '30dp',
	left : '51dp',
	top : '270dp'
});
win2.add(led3rslider);
win2.add(Ti.UI.createLabel({
	text : 'LED3:',
	height : '30dp',
	width : '50dp',
	left : '1dp',
	top : '270dp'
}));
var led3gslider = Titanium.UI.createSlider({
	min : 0,
	max : 255,
	value : 0,
	width : '170dp',
	height : '30dp',
	left : '51dp',
	top : '300dp'
});
win2.add(led3gslider);
var led3bslider = Titanium.UI.createSlider({
	min : 0,
	max : 255,
	value : 0,
	width : '170dp',
	height : '30dp',
	left : '51dp',
	top : '330dp'
});
win2.add(led3bslider);

/// device info
win2.add(Ti.UI.createLabel({
	text : 'Device Info',
	height : '50dp',
	width : '100dp',
	left : '230dp',
	top : '140dp'
}));
var labeldeviceinfo2 = Ti.UI.createLabel({
	text : '',
	width : '100dp',
	left : '230dp',
	top : '170dp'
});

labeldeviceinfo2.text = '' + '/' + Ti.Platform.model + '/' + Ti.Platform.architecture + '/' + Ti.Platform.name + '/' + Ti.Platform.osname + '/' + Ti.Platform.ostype + '/' + Ti.Platform.version + '/' + Ti.Platform.locale;
win2.add(labeldeviceinfo2);

/// report
var reportButton2 = Ti.UI.createButton({
	title : 'send report',
	height : '30dp',
	width : '100dp',
	left : '230dp',
	top : '300dp'

});
reportButton2.addEventListener('click', function(event) {
	takeshot1();
});
win2.add(reportButton2);

var infobutton2 = Ti.UI.createButton({
	//title:'info',
	image : 'light_info.png',
	height : '29dp',
	width : '27dp',
	left : '250dp',
	top : '350dp'

});
infobutton2.addEventListener('click', function(event) {
	infowin.open({
		animated : true,
		fullscreen : true
	});
});
win2.add(infobutton2);

//
//  add tabs
//
tabGroup.addTab(tab1);
tabGroup.addTab(tab2);

// for adk

var adk = null;

adk = require('jp.isisredirect.adk');

adk.addEventListener("connected", function() {
	labelstate.text = 'connected';
	labelstate2.text = 'connected';
	// open tab group
	tabGroup.open();
});
adk.addEventListener("disconnected", function() {
	labelstate.text = 'disconnected';
	labelstate2.text = 'disconnected';
	tabGroup.close();

});

adk.addEventListener("received", function(e) {
	var length = e.data.length;
	if (length < 3) {
		return;
	}

	var i = 0;
	var command = Ti.Codec.decodeNumber({
		source : e.data,
		position : i,
		type : Ti.Codec.TYPE_BYTE
	});
	i++;
	switch (command) {
		case 0x1:
			{// switch
				var sw = Ti.Codec.decodeNumber({
					source : e.data,
					position : i,
					type : Ti.Codec.TYPE_BYTE
				});
				i++;
				var val = Ti.Codec.decodeNumber({
					source : e.data,
					position : i,
					type : Ti.Codec.TYPE_BYTE
				});
				i++;

				var target = null;
				switch (sw) {
					case 0:
						target = button1state;
						break;
					case 1:
						target = button2state;
						break;
					case 2:
						target = button3state;
						break;
					case 3:
						target = button4state;
						break;
					case 4:
						target = button5state;
						break;
				}
				if (target != null) {
					if (val) {
						target.text = 'on';
					} else {
						target.text = 'off';
					}
				}
			}
			break;

		case 0x4:
			{
				var temp = Ti.Codec.decodeNumber({
					source : e.data,
					position : i,
					type : Ti.Codec.TYPE_SHORT,
					byteOrder : Ti.Codec.BIG_ENDIAN
				});
				i += 2;
				var voltagemv = temp * 4.9;
				var kVoltageAtZeroCmv = 400;
				var kTemperatureCoefficientmvperC = 19.5;
				var ambientTemperatureC = (voltagemv - kVoltageAtZeroCmv) / kTemperatureCoefficientmvperC;
				var temperatureF = (9.0 / 5.0) * ambientTemperatureC + 32.0;

				tempstate.text = temperatureF;
			}
			break;

		case 0x5:
			{
				var lightValueFromArduino = Ti.Codec.decodeNumber({
					source : e.data,
					position : i,
					type : Ti.Codec.TYPE_SHORT,
					byteOrder : Ti.Codec.BIG_ENDIAN
				});
				i += 2;

				lval = 100.0 * lightValueFromArduino / 1024.0;
				lightstate.text = lightValueFromArduino + '  ' + lval;
			}
			break;

		case 0x6:
			{
				var x = Ti.Codec.decodeNumber({
					source : e.data,
					position : i,
					type : Ti.Codec.TYPE_BYTE
				});
				i++;
				var y = Ti.Codec.decodeNumber({
					source : e.data,
					position : i,
					type : Ti.Codec.TYPE_BYTE
				});
				i++;
				joystickstate.text = x + ' ' + y;
			}
			break;

		default:
			//Log.d(TAG, "unknown msg: " + buffer[i]);
			i = length;
			break;
	}

});

labelstate.text = adk.isConnected ? 'connected' : 'disconnected';
labelstate2.text = adk.isConnected ? 'connected' : 'disconnected';
//}

function sendCommand(command, target, value) {
	var buffer = Ti.createBuffer({
		length : 3
	});
	if (255 < value) {
		value = 255;
	}
	Ti.Codec.encodeNumber({
		source : command,
		dest : buffer,
		position : 0,
		type : Ti.Codec.TYPE_BYTE
	});
	Ti.Codec.encodeNumber({
		source : target,
		dest : buffer,
		position : 1,
		type : Ti.Codec.TYPE_BYTE
	});
	Ti.Codec.encodeNumber({
		source : value,
		dest : buffer,
		position : 2,
		type : Ti.Codec.TYPE_BYTE
	});
	adk.sendData(buffer);
}

relaybutton1.addEventListener('change', function(e) {
	if (e.value) {
		sendCommand(3, 0, 1);
	} else {
		sendCommand(3, 0, 0);
	}
});
relaybutton2.addEventListener('change', function(e) {
	if (e.value) {
		sendCommand(3, 1, 1);
	} else {
		sendCommand(3, 1, 0);
	}
});
servoslider1.addEventListener('change', function(e) {
	sendCommand(2, 16, e.value);
});
servoslider1.addEventListener('change', function(e) {
	sendCommand(2, 17, e.value);
});
servoslider1.addEventListener('change', function(e) {
	sendCommand(2, 18, e.value);
});
led1rslider.addEventListener('change', function(e) {
	sendCommand(2, 0, e.value);
});
led1gslider.addEventListener('change', function(e) {
	sendCommand(2, 1, e.value);
});
led1bslider.addEventListener('change', function(e) {
	sendCommand(2, 2, e.value);
});
led2rslider.addEventListener('change', function(e) {
	sendCommand(2, 3, e.value);
});
led2gslider.addEventListener('change', function(e) {
	sendCommand(2, 4, e.value);
});
led2bslider.addEventListener('change', function(e) {
	sendCommand(2, 5, e.value);
});
led3rslider.addEventListener('change', function(e) {
	sendCommand(2, 6, e.value);
});
led3gslider.addEventListener('change', function(e) {
	sendCommand(2, 7, e.value);
});
led3bslider.addEventListener('change', function(e) {
	sendCommand(2, 8, e.value);
});
