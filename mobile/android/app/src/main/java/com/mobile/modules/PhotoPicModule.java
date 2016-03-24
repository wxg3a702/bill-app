package com.mobile.modules;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Build;
import android.provider.MediaStore;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by vison on 16/3/11.
 */
public class PhotoPicModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final int IMAGE_REQUEST_CODE = 0x01;
    private static final int CAMERA_REQUEST_CODE = 0x02;

    public PhotoPicModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "PhotoPicModule";
    }

    @ReactMethod
    public void showImagePic() {
        Activity currentActivity = getCurrentActivity();
        String[] items = {"拍照上传", "本地上传"};
        new AlertDialog.Builder(currentActivity)
                .setItems(items, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        switch (which) {
                            case 0:
                                launchCamera();
                                break;
                            case 1:
                                launchImage();
                                break;
                        }
                    }

                })
                .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                }).show();
    }
    @ReactMethod
    public void launchCamera() {
        Activity activity = getCurrentActivity();
        /*response.putBoolean("didCancel", true);
        mCallback.invoke(response);*/
        Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        activity.startActivityForResult(cameraIntent, CAMERA_REQUEST_CODE);
    }

    @ReactMethod
    public void launchImage() {
        Activity activity = getCurrentActivity();
        Intent imageIntent ;
        if (Build.VERSION.SDK_INT < 19){
            imageIntent = new Intent();
            imageIntent.setAction(Intent.ACTION_GET_CONTENT);
            imageIntent.setType("image/*");
            try{
                activity.startActivityForResult(imageIntent, IMAGE_REQUEST_CODE);
            }catch (Exception e){
                Log.d("Exception", e.toString());
            }
        }else{
            imageIntent = new Intent(Intent.ACTION_PICK,MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            imageIntent.setType("image/*");
            try{
                activity.startActivityForResult(imageIntent, IMAGE_REQUEST_CODE);
            }catch (Exception e){
                Log.d("Exception",e.toString());
            }
        }

    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

    }
}
