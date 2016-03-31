package com.mobile;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.KeyEvent;
import android.widget.Toast;

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.shell.MainReactPackage;
import com.mobile.service.AppService;
import com.mobile.updatedata.UpdateData;
import com.mobile.utils.AppUtils;
import com.rnfs.RNFSPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.mobile.packages.ZXReactPackage;
import com.soundcloud.android.crop.Crop;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import io.realm.react.RealmReactPackage;

public class MainActivity  extends Activity implements DefaultHardwareBackBtnHandler {

    private static final int IMAGE_REQUEST_CODE = 0x01;
    private static final int CAMERA_REQUEST_CODE = 0x02;
    private static ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;
    private Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
        }
    };
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // 竖屏锁定
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        mReactRootView = new ReactRootView(this);

        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())
                .addPackage(new ZXReactPackage())
                .addPackage((ReactPackage)new RealmReactPackage())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        mReactRootView.startReactApplication(mReactInstanceManager, "FasApp", null);
        setContentView(mReactRootView);
        boolean isMsg = getIntent().getBooleanExtra("isMsg", false);
        if (isMsg) {
            UpdateData updateData = new UpdateData();
            updateData.getData(MainActivity.getContext(), "MsgByNotification");
        }
    }

    public static ReactContext getContext() {
        if (mReactInstanceManager == null) {
            // This doesn't seem to happen ...
            throw new IllegalStateException("Instance manager not available");
        }
        final ReactContext context = mReactInstanceManager.getCurrentReactContext();
        if (context == null) {
            // This really shouldn't happen ...
            throw new IllegalStateException("React context not available");
        }
        return context;
    }
    @Override
    public void onBackPressed() {
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onBackPressed();
        } else {
            super.onBackPressed();
        }
    }

    Runnable run = new Runnable() {
        @Override
        public void run() {
            if (!AppUtils.isServiceWork(MainActivity.this, "AppService")) {
                Intent mIntent = new Intent(MainActivity.this, AppService.class);
                Log.d("true", "true");
//            bindService(mIntent, localServiceConnection, BIND_AUTO_CREATE);
                startService(mIntent);
            }
        }
    };

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }


    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onPause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onResume(this, this);
            new Thread(){
                @Override
                public void run() {
                    handler.postDelayed(run, 15000);
                }
            }.start();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode != Activity.RESULT_OK){
            return;
        }
        Uri uri =null;
        switch (requestCode) {
            case CAMERA_REQUEST_CODE:
                if (data == null) {
                    return;
                } else {
                    Bundle extras = data.getExtras();
                    if (extras != null) {
                        Bitmap bitMap = extras.getParcelable("data");
                        uri= saveBitMap(bitMap);
                    }
                    beginCrop(uri);
                }

                break;
            case IMAGE_REQUEST_CODE:
                if (data == null) {
                    return;
                }
                uri = data.getData();
                beginCrop(uri);
                break;
            case Crop.REQUEST_CROP:
                handleCrop(resultCode, data);
                break;
        }
    }

    //发送事件到js代码
    private void sendEvent(ReactContext reactContext, String eventName, WritableMap params) {
        try {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }catch (Exception e){
            Log.d("Exception", e.toString());
        }
    }

    //开始裁剪，到裁剪界面
    private void beginCrop(Uri source) {
        Uri destination = Uri.fromFile(new File(Environment.getExternalStorageDirectory(), "crop.jpg"));
        try{
            Crop.of(source, destination).asSquare().start(MainActivity.this);
        }catch (Exception e){
            Log.d("Exception",e.toString());
        }

    }

    //剪切后回调的方法,返回裁剪后的uri
    private void handleCrop(int resultCode, Intent result) {
        if (resultCode == RESULT_OK) {
            Log.d("Crop", Crop.getOutput(result) + "00");
            Uri uri = Crop.getOutput(result);

            WritableMap params = Arguments.createMap();
            params.putString("uri", uri.toString());
            ReactContext reactContext = mReactInstanceManager.getCurrentReactContext();
            sendEvent(reactContext, "getPicture", params);
        } else if (resultCode == Crop.RESULT_ERROR) {
            Toast.makeText(this, "裁剪出错", Toast.LENGTH_SHORT).show();
        }
    }

    //将content:  uri的bitMap缓存到本地，转化为file： uri
    private Uri saveBitMap(Bitmap bm) {
        File tmpDir = new File(Environment.getExternalStorageDirectory() + "/Zxbill");
        if (!tmpDir.exists()) {
            tmpDir.mkdir();
        }
        File image = new File(tmpDir.getAbsolutePath() + "/" + "avater.png");
        try {
            FileOutputStream fos = new FileOutputStream(image);
            bm.compress(Bitmap.CompressFormat.PNG, 85, fos);
            fos.flush();
            fos.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return null;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
        return Uri.fromFile(image);
    }

}
