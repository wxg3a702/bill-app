package com.mobile.modules;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.mobile.utils.SDCardUtils;
import com.soundcloud.android.crop.Crop;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Date;

/**
 * Created by vison on 16/3/11.
 */
public class UserPhotoPicModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final int USER_IMAGE_REQUEST_CODE = 0x01;
    private static final int USER_CAMERA_REQUEST_CODE = 0x02;
    private Callback mCallback;
    private boolean crop;
    private String fileName;
    private WritableMap response;
    private File file;
    private Uri uri;

    public UserPhotoPicModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "UserPhotoPicModule";
    }

    @ReactMethod
    public void showImagePic(boolean needCrop, String name, final Callback callback) {
        crop = needCrop;
        fileName = name + new Date().getTime() + ".jpg";
        Activity currentActivity = getCurrentActivity();
        String[] items = {"拍照上传", "本地上传"};
        new AlertDialog.Builder(currentActivity)
                .setItems(items, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        switch (which) {
                            case 0:
                                launchCamera(callback);
                                break;
                            case 1:
                                launchImage(callback);
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
    public void launchCamera(Callback callback) {
        Activity activity = getCurrentActivity();
        mCallback = callback;
        Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        // 判断存储卡是否可用，存储照片文件
        if (SDCardUtils.hasSdcard()) {
            file = new File(Environment.getExternalStorageDirectory(), fileName);
            uri = Uri.fromFile(file);
            cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, uri);
            Log.d("Directory", Environment.getExternalStorageDirectory().toString() + fileName);
            File file = new File(Environment.getExternalStorageDirectory(), fileName);
            if (file.exists()) {
                file.delete();
            }
        }
        if (activity != null) {
            activity.startActivityForResult(cameraIntent, USER_CAMERA_REQUEST_CODE);
        }
    }

    @ReactMethod
    public void launchImage(Callback callback) {
        mCallback = callback;
        Activity activity = getCurrentActivity();
        Intent imageIntent;
        if (Build.VERSION.SDK_INT < 19) {
            imageIntent = new Intent();
            imageIntent.setAction(Intent.ACTION_GET_CONTENT);
            imageIntent.setType("image/*");
            try {
                activity.startActivityForResult(imageIntent, USER_IMAGE_REQUEST_CODE);
            } catch (Exception e) {
                Log.d("Exception", e.toString());
            }
        } else {
            imageIntent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            imageIntent.setType("image/*");
            try {
                activity.startActivityForResult(imageIntent, USER_IMAGE_REQUEST_CODE);
            } catch (Exception e) {
                Log.d("Exception", e.toString());
            }
        }

    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode != Activity.RESULT_OK) {
            return;
        }
        switch (requestCode) {
            case USER_CAMERA_REQUEST_CODE:
                if (SDCardUtils.hasSdcard()) {
                    if (crop) {
                        beginCrop(uri);
                    } else {
                        try {
                            BitmapFactory.Options options = new BitmapFactory.Options();
                            options.inSampleSize = 2;
                            Bitmap bitmap = BitmapFactory.decodeFile(file.getPath(), options);
                            if (bitmap != null) {
                                if (file.exists()) {
                                    file.delete();
                                }
                                // 保存图片
                                FileOutputStream fos = null;
                                fos = new FileOutputStream(file);
                                bitmap.compress(Bitmap.CompressFormat.JPEG, 50, fos);
                                fos.flush();
                                fos.close();
                            }
                        } catch (Exception e) {
                            // TODO: handle exception

                        }
                        response = Arguments.createMap();
                        response.putString("uri", uri.toString());
                        mCallback.invoke(response);
                    }
                }
                break;
            case USER_IMAGE_REQUEST_CODE:
                Uri uri = null;
                if (data == null) {
                    return;
                }
                uri = data.getData();
                if (crop) {
                    beginCrop(uri);
                } else {
                    try {
                        File file = new File(new URI(uri.toString()));
                        File tempFile = new File(Environment.getExternalStorageDirectory(), fileName);
                        BitmapFactory.Options options = new BitmapFactory.Options();
                        options.inSampleSize = 2;
                        Bitmap bitmap = BitmapFactory.decodeFile(file.getPath(), options);
                        if (bitmap != null) {
                            // 保存图片
                            FileOutputStream fos = null;
                            fos = new FileOutputStream(tempFile);
                            bitmap.compress(Bitmap.CompressFormat.JPEG, 30, fos);
                            fos.flush();
                            fos.close();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    response = Arguments.createMap();
                    response.putString("uri", uri.toString());
                    mCallback.invoke(response);
                }
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
        } catch (Exception e) {
            Log.d("Exception", e.toString());
        }
    }

    //开始裁剪，到裁剪界面
    private void beginCrop(Uri source) {
        Uri destination = Uri.fromFile(new File(Environment.getExternalStorageDirectory(), new Date().getTime() + ".jpg"));
        try {
            Crop.of(source, destination).asSquare().start(getCurrentActivity());
        } catch (Exception e) {
            Log.d("Exception", e.toString());
        }

    }

    //剪切后回调的方法,返回裁剪后的uri
    private void handleCrop(int resultCode, Intent result) {
        if (resultCode == Activity.RESULT_OK) {
            Log.d("Crop", Crop.getOutput(result) + "00");
            Uri uri = Crop.getOutput(result);
            response = Arguments.createMap();
            response.putString("uri", uri.toString());
            mCallback.invoke(response);
        } else if (resultCode == Crop.RESULT_ERROR) {
            Toast.makeText(getCurrentActivity(), "裁剪出错", Toast.LENGTH_SHORT).show();
        }
    }

    //将content:  uri的bitMap缓存到本地，转化为file： uri
    private Uri saveBitMap(Bitmap bm) {
        File tmpDir = new File(Environment.getExternalStorageDirectory() + "/Zxbill");
        if (!tmpDir.exists()) {
            tmpDir.mkdir();
        }
        File image = new File(tmpDir.getAbsolutePath() + "/" + fileName + ".png");
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
