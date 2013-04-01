/*
Copyright (c) 2013 Katsumi ISHIDA. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to deal in the 
Software without restriction, including without limitation the rights to use, copy, 
modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
and to permit persons to whom the Software is furnished to do so, subject to the 
following conditions:

The above copyright notice and this permission notice shall be included in all copies
 or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE 
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
 OR OTHER DEALINGS IN THE SOFTWARE.
 */
package jp.isisredirect.adk;

import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.ref.WeakReference;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.appcelerator.kroll.KrollEventCallback;
import org.appcelerator.kroll.KrollInvocation;
import org.appcelerator.kroll.KrollModule;
import org.appcelerator.kroll.annotations.Kroll;
import org.appcelerator.kroll.KrollDict;

import org.appcelerator.titanium.TiApplication;
import org.appcelerator.titanium.TiBaseActivity;
import org.appcelerator.titanium.TiC;
import org.appcelerator.titanium.TiContext;
import org.appcelerator.titanium.proxy.ActivityProxy;
import org.appcelerator.titanium.proxy.IntentProxy;
import org.appcelerator.titanium.util.Log;
import org.appcelerator.titanium.util.TiConfig;

import ti.modules.titanium.BufferProxy;

import com.android.future.usb.UsbAccessory;
import com.android.future.usb.UsbManager;

import android.app.*;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Handler;
import android.os.ParcelFileDescriptor;

@Kroll.module(name = "Adk", id = "jp.isisredirect.adk")
public class AdkModule extends KrollModule implements Runnable {
	private static final String LCAT = "AdkModule";
	private static final boolean DBG = TiConfig.LOGD;

	private static final String ACTION_USB_PERMISSION = "jp.isisredirect.adk.action.USB_PERMISSION";

	@Kroll.constant
	public static final String CONNECTED = "connected";
	@Kroll.constant
	public static final String DISCONNECTED = "disconnected";
	@Kroll.constant
	public static final String RECEIVED = "received";
	@Kroll.constant
	public static final String DATA = "data";

	private UsbManager mUsbManager = null;
	private PendingIntent mPermissionIntent = null;
	private boolean mPermissionRequestPending = false;

	private boolean isOpened = false;
	UsbAccessory mAccessory = null;
	ParcelFileDescriptor mFileDescriptor = null;
	FileInputStream mInputStream = null;
	FileOutputStream mOutputStream = null;

	private Runnable mSender = null;
	private final int SENDER_REPEAT_INTERVAL = 300;
	private Handler mSenderHandler = new Handler();
	private Thread thread = null;
	private static Queue<BufferProxy> mQueue = null;
	/*
	 * private static WeakReference<ActivityProxy> foregroundActivityProxy =
	 * null;
	 */
	private final BroadcastReceiver mUsbReceiver = new BroadcastReceiver() {
		@Override
		public void onReceive(Context context, Intent intent) {
			if (DBG)
				Log.d(LCAT, "UsbReceiver");
			String action = intent.getAction();
			if (ACTION_USB_PERMISSION.equals(action)) {
				synchronized (this) {
					UsbAccessory accessory = UsbManager.getAccessory(intent);
					if (intent.getBooleanExtra(
							UsbManager.EXTRA_PERMISSION_GRANTED, false)) {
						openAccessory(accessory);
						if (DBG)
							Log.d(LCAT, "UsbReceiver openAccessory" + accessory);
						fireConnected();
					} else {
						if (DBG)
							Log.d(LCAT, "permission denied for accessory "
									+ accessory);
					}
					mPermissionRequestPending = false;
				}
			} else if (UsbManager.ACTION_USB_ACCESSORY_DETACHED.equals(action)) {
				UsbAccessory accessory = UsbManager.getAccessory(intent);
				if (accessory != null && accessory.equals(mAccessory)) {
					if (DBG)
						Log.d(LCAT, "UsbReceiver closeAccessory" + accessory);
					closeAccessory();
					KrollDict data = new KrollDict();
					data.put(TiC.EVENT_PROPERTY_SOURCE, AdkModule.this);
					fireEvent(DISCONNECTED, data);
				}
			}
		}
	};

	// You can define constants with @Kroll.constant, for example:
	// @Kroll.constant public static final String EXTERNAL_NAME = value;

	public AdkModule(TiContext tiContext) {
		super(tiContext);
	}

	private void fireConnected() {
		KrollDict data = new KrollDict();
		data.put(TiC.EVENT_PROPERTY_SOURCE, AdkModule.this);
		fireEvent(CONNECTED, data);
	}

	// life cycle
	private class MyKrollEventCallback implements KrollEventCallback {
		@Override
		public void call(Object arg0) {
			if (DBG)
				Log.d(LCAT, "newIntent callback");
			KrollDict data = (KrollDict) arg0;
			IntentProxy ip = (IntentProxy) data.get(TiC.PROPERTY_INTENT);
			if (DBG)
				Log.d(LCAT, "newintent " + ip.getIntent());

			connentAccessory();

			// switch activity
			/*
			 * this is challenge ... ActivityProxy useractivity =
			 * getForegroundActivity(); if (useractivity != null) { //Activity
			 * root = TiApplication.getAppRootOrCurrentActivity(); //if
			 * (useractivity != root) { if (DBG) Log.d(LCAT,
			 * "newintent/ switch activity: " + useractivity); IntentProxy
			 * intentproxy = useractivity.getIntent();
			 * intentproxy.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP|
			 * Intent.FLAG_ACTIVITY_CLEAR_TOP);
			 * useractivity.startActivity(intentproxy);
			 * 
			 * //} }
			 */
		}
	}

	@Override
	public void onStart(Activity activity) {
		super.onStart(activity);
		if (DBG)
			Log.d(LCAT, "onStart----");
		mUsbManager = UsbManager.getInstance(activity);

		mPermissionIntent = PendingIntent.getBroadcast(activity, 0, new Intent(
				ACTION_USB_PERMISSION), 0);

		IntentFilter filter = new IntentFilter(ACTION_USB_PERMISSION);
		filter.addAction(UsbManager.ACTION_USB_ACCESSORY_DETACHED);
		activity.registerReceiver(mUsbReceiver, filter);
		if (DBG)
			Log.d(LCAT, "onStart end");
	}

	@Override
	public void onResume(Activity activity) {
		super.onResume(activity);
		if (DBG)
			Log.d(LCAT, "onResume");

		if (activity instanceof TiBaseActivity) {
			MyKrollEventCallback func = new MyKrollEventCallback();
			if (DBG)
				Log.d(LCAT, "onResume :" + activity);
			TiBaseActivity tibaseactivity = (TiBaseActivity) activity;
			ActivityProxy proxy = tibaseactivity.getActivityProxy();
			proxy.addEventListener("newIntent", func);

		} else {
			if (DBG)
				Log.d(LCAT, "onResume: not TiBaseActivity");
		}
		connentAccessory();
	}

	@Override
	public void onPause(Activity activity) {
		super.onPause(activity);
		if (DBG)
			Log.d(LCAT, "onPause");
	}

	@Override
	public void onStop(Activity activity) {
		super.onStop(activity);
		if (DBG)
			Log.d(LCAT, "onStop");
	}

	@Override
	public void onDestroy(Activity activity) {
		super.onDestroy(activity);
		if (DBG)
			Log.d(LCAT, "onDestroy");
		activity.unregisterReceiver(mUsbReceiver);
		closeAccessory();
	}

	// adk
	private void connentAccessory() {
		if (mInputStream != null && mOutputStream != null) {
			if (DBG)
				Log.d(LCAT, "connentAccessory" + mInputStream + mOutputStream);
			return;
		}

		UsbAccessory[] accessories = mUsbManager.getAccessoryList();
		UsbAccessory accessory = (accessories == null ? null : accessories[0]);
		if (DBG)
			Log.d(LCAT, "connentAccessory openAccessory" + accessory);
		if (accessory != null) {
			if (mUsbManager.hasPermission(accessory)) {
				openAccessory(accessory);
				fireConnected();
			} else {
				synchronized (mUsbReceiver) {
					if (!mPermissionRequestPending) {
						mUsbManager.requestPermission(accessory,
								mPermissionIntent);
						mPermissionRequestPending = true;
					}
				}
			}
		} else {
			if (DBG)
				Log.d(LCAT, "mAccessory is null");
		}
	}

	private void openAccessory(UsbAccessory accessory) {
		if (DBG)
			Log.d(LCAT, "openAccessory");
		mFileDescriptor = mUsbManager.openAccessory(accessory);
		if (mFileDescriptor != null) {
			isOpened = true;
			mAccessory = accessory;
			FileDescriptor fd = mFileDescriptor.getFileDescriptor();
			mInputStream = new FileInputStream(fd);
			if (mInputStream == null) {
				if (DBG)
					Log.d(LCAT, "mInputStream not opened");
				isOpened = false;
			} else {
				if (DBG)
					Log.d(LCAT, "mInputStream " + mInputStream);
			}
			mOutputStream = new FileOutputStream(fd);
			if (mOutputStream == null) {
				isOpened = false;
				if (DBG)
					Log.d(LCAT, "mOutputStream not opened");
			} else {
				if (DBG)
					Log.d(LCAT, "mOutputStream " + mOutputStream);
			}

			mQueue = new ConcurrentLinkedQueue<BufferProxy>();

			thread = new Thread(null, this, "ADKThread");
			thread.start();

			mSender = new Runnable() {
				public void run() {

					while (!mQueue.isEmpty()) {
						send(mQueue.poll());
					}

					mSenderHandler.postDelayed(this, SENDER_REPEAT_INTERVAL);
				}
			};
			mSenderHandler.postDelayed(mSender, SENDER_REPEAT_INTERVAL);

			if (DBG)
				Log.d(LCAT, "accessory opened");

		} else {
			isOpened = false;
			if (DBG)
				Log.d(LCAT, "accessory open fail");
		}
	}

	private void closeAccessory() {
		if (DBG)
			Log.d(LCAT, "accessory close");
		try {
			isOpened = false;
			if (thread != null) {
				thread.interrupt();
			}
			if (mInputStream != null) {
				mInputStream.close();
			}
			if (mOutputStream != null) {
				mOutputStream.close();
			}
			if (mFileDescriptor != null) {
				mFileDescriptor.close();
			}
			if (mSenderHandler != null) {
				mSenderHandler.removeCallbacks(mSender);
			}
		} catch (IOException e) {
		} finally {
			thread = null;
			mFileDescriptor = null;
			mInputStream = null;
			mOutputStream = null;
			mAccessory = null;
			mSender = null;
			mQueue = null;
		}
	}

	public void run() {
		int ret = 0;
		byte[] buffer = new byte[16384];
		int i;
		// int c;
		if (0 < buffer.length) {
			while (ret >= 0) {
				try {
					if (mInputStream != null) {
						ret = mInputStream.read(buffer);
					} else {
						if (DBG)
							Log.d(LCAT, "run mInputStream null");
						break;
					}
				} catch (IOException e) {
					break;
				}
				if (0 < ret) {
					BufferProxy rec_buffer = new BufferProxy(ret);
					rec_buffer.write(0, buffer, 0, ret);
					KrollDict data = new KrollDict();
					data.put(TiC.EVENT_PROPERTY_SOURCE, AdkModule.this);
					data.put(DATA, rec_buffer);
					fireEvent(RECEIVED, data);
				}
			}
		} else {
			if (DBG)
				Log.d(LCAT, "run no buffer");
		}
		if (DBG)
			Log.d(LCAT, "run end");
	}

	private void send(BufferProxy buffer) {
		if (mOutputStream != null) {
			try {
				mOutputStream.write(buffer.getBuffer());
			} catch (IOException e) {
				if (DBG)
					Log.e(LCAT, "write failed", e);
			}
		}
	}

	// Methods
	@Kroll.method
	public void sendData(BufferProxy buffer) {
		if (mQueue != null) {
			mQueue.add(buffer);
		}
	}

	@Kroll.getProperty
	@Kroll.method
	public boolean getIsConnected() {
		return isOpened;
	}
	/*
	 * @SuppressWarnings("static-access")
	 * 
	 * @Kroll.getProperty @Kroll.method public void
	 * setForegroundActivity(ActivityProxy foregroundActivity) { if (DBG)
	 * Log.e(LCAT, "setForegroundActivity:" + foregroundActivity);
	 * this.foregroundActivityProxy = new
	 * WeakReference<ActivityProxy>(foregroundActivity); }
	 * 
	 * @Kroll.getProperty @Kroll.method public ActivityProxy
	 * getForegroundActivity() { if (foregroundActivityProxy != null) {
	 * ActivityProxy activityRef = foregroundActivityProxy.get(); if
	 * (activityRef != null) { return activityRef; } }
	 * 
	 * if (DBG) Log.e(LCAT, "Unable to get the foregroundActivity instance");
	 * return null; }
	 */

}
