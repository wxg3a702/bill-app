package com.mobile.modules;

import android.app.Activity;
import android.app.DatePickerDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import android.widget.DatePicker;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.mobile.utils.LogUtils;
import com.mobile.utils.SPUtils;

import java.util.Calendar;

/**
 * Created by vison on 16/3/15.
 */
public class SPModule extends ReactContextBaseJavaModule {

    public SPModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SPModule";
    }

    @ReactMethod
    public void setTokenToSP(String token){
        LogUtils.d("token", token + " ");
        if(token != null)
        SPUtils.put(getReactApplicationContext(), "token", "Basic  " + token);
    }
    @ReactMethod
    public void setDefaultOffscreenPages(int limit){
        LogUtils.d("limit", limit + " ");
        SPUtils.put(getReactApplicationContext(), "OffscreenPages", limit);
    }

    @ReactMethod
    public void clearTokenFromSP(String token){
        SPUtils.put(getReactApplicationContext(), "token", "");
    }

}
