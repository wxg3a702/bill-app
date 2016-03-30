package com.mobile.updatedata;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nullable;

/**
 * Created by amarsoft on 16/3/11.
 */
public class UpdateData {
    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    public void getData(ReactContext reactContext, String key) {
        WritableMap params = Arguments.createMap();
        params.putString("test", "This is Test!");
        sendEvent(reactContext, key, params);
    }
}
