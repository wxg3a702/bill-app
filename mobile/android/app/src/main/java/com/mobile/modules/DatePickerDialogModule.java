package com.mobile.modules;

import android.app.Activity;
import android.app.DatePickerDialog;
import android.util.Log;
import android.widget.DatePicker;


import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;


import java.util.Calendar;

/**
 * Created by vison on 16/3/15.
 */
public class DatePickerDialogModule extends ReactContextBaseJavaModule {
    String dateTime;
    public DatePickerDialogModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "DatePickerDialogModule";
    }

    @ReactMethod
    public void showDatePickerDialog(){
        Activity currentActivity = getCurrentActivity();
        Calendar calendar = Calendar.getInstance();
        new DatePickerDialog(currentActivity,
                new DatePickerDialog.OnDateSetListener() {
                    @Override
                    public void onDateSet(DatePicker datePicker, int year, int month, int dayOfMonth) {
                        dateTime = year + "-" + (month + 1) + "-" + dayOfMonth;
                        WritableMap params = Arguments.createMap();
                        params.putString("date", dateTime);
                        ReactContext reactContext = getReactApplicationContext();
                        //ReactContext reactContext = new ReactContext(getCurrentActivity());
                        sendEvent(reactContext, "getDate", params);
                    }
                }
                , calendar.get(Calendar.YEAR)
                , calendar.get(Calendar.MONTH)
                , calendar.get(Calendar.DAY_OF_MONTH)).show();
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
}
