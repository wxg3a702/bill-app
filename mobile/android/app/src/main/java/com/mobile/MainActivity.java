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

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;
import com.mobile.modules.UserPhotoPicModule;
import com.mobile.service.AppService;
import com.mobile.utils.AppUtils;
import com.mobile.packages.ZXReactPackage;

import io.realm.react.RealmReactPackage;
import com.imagepicker.ImagePickerPackage; // import package

public class MainActivity  extends Activity implements DefaultHardwareBackBtnHandler {

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
                .addPackage((ReactPackage) new ImagePickerPackage())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        mReactRootView.startReactApplication(mReactInstanceManager, "mobile", null);
        setContentView(mReactRootView);
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
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onActivityResult(requestCode, resultCode, data);
        }
    }
}