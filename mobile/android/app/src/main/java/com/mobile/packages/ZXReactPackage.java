package com.mobile.packages;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.mobile.modules.DatePickerDialogModule;
import com.mobile.modules.UserPhotoPicModule;
import com.mobile.views.viewpager.ZXViewPagerManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by amarsoft on 16/3/9.
 */
public class ZXReactPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new UserPhotoPicModule(reactContext));
        modules.add(new DatePickerDialogModule(reactContext));
        modules.add(new CertifyPhotoPicModule(reactContext));
        return modules;
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
                new ZXViewPagerManager()
        );
    }

}
