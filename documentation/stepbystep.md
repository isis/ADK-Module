# Step by step configuration to use the ADK Module in your app and Accessory

## Description

The ADK module provides a simple support for ADK (Android Open *A*ccessory *D*evelopment *K*it).

For details of ADK, see below site  :
<http://developer.android.com/guide/topics/usb/adk.html>

This document will show how to configure a Titanium project for using ADK step by step.

## Prepare 
### Setup Google API before creating a Titanium project

ADK requires Google API Level 10 (or Google API Level 12).
It is necessary to install Google API Level 10 in Titanium Studio.  

1.	Select [*Window > Android SDK Manager*]
2.	Check "Android 2.3.3 (API 10) > Google APIs by Google Inc." if not installed yet.
3.	Click [*Install ...*] button


Note : General issues of Titanium mobile for Android setup are [here](https://wiki.appcelerator.org/display/guides/Quick+Start) 

## Create your Titanium project
When you create your new Titanium project, you must setup Android SDK configuration to support ADK.  

1.	Select [*File > New > Titanium Mobile Project*]
1.	Select [*Set-up/Configure SDKs*] in "*New Titanium Mobile Project*"
2.	"*Android SDK Home*" is set to your Android SDK home according to your own environment.
3.	Select "*Google APIs Android 2.3.3*" in "*Default Android SDK*" 
4.	Setup other elements if needed, and click [Finish] button. At that time, "*Titanium SDK version*" must be set to "*1.7.5*" (current version of ADK module supports Titanium mobile SDK 1.7.5).

## Modify your Titanium project settings

### Modify "Tiapp.xml"
#### Add &lt;module&gt; tag
To use ADK module, you must add flowing &lt;module&gt; tag in &lt;modules&gt; session as same as other Titanium modules.

     <modules>
        <module platform="android" version="2.0">jp.isisredirect.adk</module>
     </modules>

#### Example "Tiapp.xml" resulted by above

     <?xml version="1.0" encoding="UTF-8"?>
     <ti:app xmlns:ti="http://ti.appcelerator.org">
     	... skipped ....
         <modules>
             <module platform="android" version="2.0">jp.isisredirect.adk</module>
         </modules>
     </ti:app>

### Add accessory_filter.xml
To determine what accessory can associate with your Titanium app, some values (manufacturer, model and version) must be specified by &lt;usb-accessory&gt; tag in &lt;resources&gt; session of the accessory_filter.xml file.

The accessory_filter.xml file must be located in 
     &lt;project_dir&gt;/platform/android/res/xml/ 

, and must be named just "accessory_filter.xml".

For example, accessory_filter.xml is below :  

     <?xml version="1.0" encoding="utf-8"?>
     <resources>
         <usb-accessory manufacturer="Google, Inc." model="DemoKit" version="1.0" />
     </resources>

These values may be specified by AndroidAccessory initializer in the accessary.
Here is an example in Arduino sketch :

     AndroidAccessory acc("Google, Inc.",	// manufacturer
                          "DemoKit",		// model
                          "DemoKit Arduino Board",	// description
                          "1.0",			// version
                          "http://www.android.com",	// uri for information to download app
                          "0000000012345678");	// serial number

These values are just an example in ADK DemoKit by Google.
You should determine your own values for your own accessory.

### Add intent filter and metadata 
To notify accessory_filter infomation to Android OS and to let Android OS to launch your app when Accessory is connected, you must add &lt;activity&gt; tag and intent filter to your "tiapp.xml".

Here is an example: (replace <your app name>)
    <android xmlns:android="http://schemas.android.com/apk/res/android">
        <manifest>
            <uses-sdk android:minSdkVersion="10"/>
            <application>
		 		<activity android:configChanges="keyboardHidden|orientation" 
		 			android:label="<your app name>" android:name=".<your app name>Activity" 
		 			android:launchMode="singleTask"
		 			android:theme="@style/Theme.Titanium">
					<intent-filter>
						<action android:name="android.intent.action.MAIN"/>
						<category android:name="android.intent.category.LAUNCHER"/>
					</intent-filter>
					<intent-filter>
						<action android:name="android.hardware.usb.action.USB_ACCESSORY_ATTACHED" />
					</intent-filter>

					<meta-data android:name="android.hardware.usb.action.USB_ACCESSORY_ATTACHED"
						android:resource="@xml/accessory_filter" />
				</activity>
           </application>
        </manifest>
    </android>
 

### That's all. 
Next, write your Titanium app by JavaScript!

## Author

Kastumi ISHIDA (isis re-direct) in k.i.office.

isis.redirect4@gmail.com


## License

read 'license' file
