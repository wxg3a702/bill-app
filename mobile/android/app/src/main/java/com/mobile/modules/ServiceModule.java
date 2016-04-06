package com.mobile.modules;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.mobile.service.AppService;
import com.mobile.utils.LogUtils;
import com.mobile.utils.SPUtils;

/**
 * Created by wmge on 16/3/15.
 *
 */
public class ServiceModule extends ReactContextBaseJavaModule {

    public ServiceModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ServiceModule";
    }

    @ReactMethod
    public void setIsLoginToSP(boolean isLogin){
        LogUtils.d("isLogin", isLogin + " ");
        SPUtils.put(getReactApplicationContext(), "isLogin", isLogin);
    }

    @ReactMethod
    public void startAppService(){
        getReactApplicationContext().startService(new Intent(getReactApplicationContext(), AppService.class));
    }

    @ReactMethod
    public void stopAppService(){
        getReactApplicationContext().stopService(new Intent(getReactApplicationContext(), AppService.class));
    }
}
