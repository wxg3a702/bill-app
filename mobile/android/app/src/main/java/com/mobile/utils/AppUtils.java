package com.mobile.utils;

import android.app.ActivityManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.widget.EditText;

import java.util.List;

/**
 * Created by amarsoft on 2015/12/24.
 */
public class AppUtils {
    private AppUtils() {
        /* cannot be instantiated */
        throw new UnsupportedOperationException("cannot be instantiated");
    }

    /**
     * 获取应用程序名称
     */
    public static String getAppName(Context context) {
        try {
            PackageManager packageManager = context.getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(
                    context.getPackageName(), 0);
            int labelRes = packageInfo.applicationInfo.labelRes;
            return context.getResources().getString(labelRes);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * [获取应用程序版本名称信息]
     *
     * @param context
     * @return 当前应用的版本名称
     */
    public static String getVersionName(Context context) {
        try {
            PackageManager packageManager = context.getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(
                    context.getPackageName(), 0);
            return packageInfo.versionName;

        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 验证EditText是否为空
     *
     * @param editText
     * @return boolean
     */
    public static boolean editIsNull(EditText editText) {
        String editString = editText.getText().toString();
        if (editString.isEmpty()) {
            return true;
        } else {
            return false;
        }
    }

//    public static void runOnUiThread(Runnable runnable) {
//        if (android.os.Process.myTid() == BaseApplication.getMainTid()) {
//            runnable.run();
//        } else {
//            BaseApplication.getHandler().post(runnable);
//        }
//    }

    public static String replaceStr (String accountNo) {
        String mSubstring = accountNo.substring(4, accountNo.length() - 4);
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < mSubstring.length(); i++) {
            sb.append("*");
        }
        String mReplace = accountNo.replace(mSubstring, sb.toString());
        LogUtils.d("qwertyuiop:", mReplace);
        return mReplace;
    }

    public static String replacePhoneStr (String accountNo) {
        String mSubstring = accountNo.substring(3, 9);
        String mReplace = accountNo.replace(mSubstring, "******");
        return mReplace;
    }

    //判断一个Service是否在运行
    public static boolean isServiceWork (Context context, String serviceName) {
        boolean isWork = false;
        ActivityManager mManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningServiceInfo> mList = mManager.getRunningServices(40);
        if (mList.size() <= 0) {
            return false;
        }
        for (int i = 0; i < mList.size(); i++) {
            String mName = mList.get(i).service.getClassName();
            if (mName.equals(serviceName)) {
                isWork = true;
                break;
            }
        }
        return isWork;
    }

    /**
     * 需要权限:android.permission.GET_TASKS
     *
     * @param context
     * @return
     */
    public static boolean isApplicationBroughtToBackground(Context context) {
        ActivityManager am = (ActivityManager) context
                .getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningTaskInfo> tasks = am.getRunningTasks(1);
        if (tasks != null && !tasks.isEmpty()) {
            ComponentName topActivity = tasks.get(0).topActivity;
            if (!topActivity.getPackageName().equals(context.getPackageName())) {
                return true;
            }
        }
        return false;
    }
    /**
     * 获得当前显示的Activity
     *
     * @param context
     * @return
     */
    public static String getProsceniumAct(Context context) {
        ActivityManager am = (ActivityManager) context
                .getSystemService(Context.ACTIVITY_SERVICE);
        ComponentName mTopActivity = am.getRunningTasks(1).get(0).topActivity;
        return mTopActivity.getClassName();
    }
}
