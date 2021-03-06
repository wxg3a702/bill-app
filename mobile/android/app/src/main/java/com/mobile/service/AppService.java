package com.mobile.service;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.IBinder;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.facebook.stetho.common.LogUtil;
import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import com.mobile.BuildConfig;
import com.mobile.MainActivity;
import com.mobile.R;
import com.mobile.bean.NtfBean;
import com.mobile.updatedata.UpdateData;
import com.mobile.utils.AppUtils;
import com.mobile.utils.LogUtils;
import com.mobile.utils.SPUtils;

import java.net.URISyntaxException;


/**
 * Created by amarsoft on 2016/1/17.
 */
public class AppService extends Service {

    private static String MY_PKG_NAME = "com.amarsoft.zxbill_fe_android";
    private Socket mSocket;
    private NotificationManager manager;
    private NotificationCompat.Builder mBuilder;

    @Override
    public void onCreate() {
        super.onCreate();
            try {
                if (mSocket == null) {
                    mSocket = IO.socket("http://121.40.51.79:3000");
                }
            } catch (URISyntaxException e) {
                e.printStackTrace();
            }
//        if(mSocket.connected()){
//            mSocket.disconnect();
//        }
            if (mSocket.hasListeners("new.msg")) {
                Log.d("TAG", "hasListeners");
                mSocket.off("new.msg", onNewMessage);
            }
            if (mSocket.hasListeners(Socket.EVENT_CONNECT)) {
                mSocket.off(Socket.EVENT_CONNECT, onConnect);
            }
            if (mSocket.hasListeners(Socket.EVENT_CONNECT_ERROR)) {
                mSocket.off(Socket.EVENT_CONNECT_ERROR, onConnectError);
            }
            if (mSocket.hasListeners(Socket.EVENT_CONNECT_TIMEOUT)) {
                mSocket.off(Socket.EVENT_CONNECT_TIMEOUT, onConnectError);
            }
            mSocket.on(Socket.EVENT_CONNECT_ERROR, onConnectError);
            mSocket.on(Socket.EVENT_CONNECT_TIMEOUT, onConnectError);
            mSocket.on(Socket.EVENT_CONNECT, onConnect);
//        mSocket.on("user.login", onMessage);
            mSocket.on("new.msg", onNewMessage);
            LogUtils.d("SPToken", "" + SPUtils.get(AppService.this, "token", ""));
            mSocket.emit("user.login", SPUtils.get(AppService.this, "token", ""));
            mSocket.connect();
        Log.d("true", "AppService");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        LogUtils.d("AppService:onStartCommand");
        flags = START_STICKY;
        return super.onStartCommand(intent, flags, startId);
    }

    /*@Override
    public boolean onUnbind(Intent intent) {
        LogUtils.d("AppService:onUnbind");
//        mSocket.emit("disconnect");
        //断开Socket链接 需要将所有的监听器关掉。！！！！！！！！！！！
        mSocket.disconnect();
        mSocket.off("new.msg", onNewMessage);
        mSocket.off(Socket.EVENT_CONNECT, onConnect);
        mSocket.off(Socket.EVENT_CONNECT_ERROR, onConnectError);
        mSocket.off(Socket.EVENT_CONNECT_TIMEOUT, onConnectError);
//        mSocket.close();
//        mSocket = null;
        stopSelf();
//        stopService(new Intent(this, AppService.class));
        return super.onUnbind(intent);
    }*/

    @Override
    public void onDestroy() {
        LogUtils.d("AppService:onDestroy");
        /*Intent localIntent = new Intent();
        localIntent.setClass(this, AppService.class); // 销毁时重新启动Service
        this.startService(localIntent);*/
        stopForeground(true);
        mSocket.disconnect();
        mSocket.off("new.msg", onNewMessage);
        mSocket.off(Socket.EVENT_CONNECT, onConnect);
        mSocket.off(Socket.EVENT_CONNECT_ERROR, onConnectError);
        mSocket.off(Socket.EVENT_CONNECT_TIMEOUT, onConnectError);
        /*Intent mIntent1 = new Intent("my.amarsoft.destroy");
        sendBroadcast(mIntent1);*/
    }

    @Override
    public IBinder onBind(Intent intent) {
        LogUtils.d("AppService" + "onBind");
        return null;
    }

    private Emitter.Listener onConnectError = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            LogUtils.d("onConnectError:");
        }
    };
    private Emitter.Listener onConnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            LogUtils.d("EVENT_CONNECT");
            mSocket.emit("user.login", SPUtils.get(AppService.this, "token", ""));
//            ReactContext currentReactContext = mReactInstanceManager.getCurrentReactContext();
        }
    };
    private Emitter.Listener onNewMessage = new Emitter.Listener() {
        @Override
        public void call(Object ... args) {
            JSONObject mJSONObject = JSON.parseObject(args[0].toString());
            LogUtils.d("有消息来了", args[0].toString());
            String mType = mJSONObject.getString("type");
//            String title = mJSONObject.getString("title");
            NtfBean mMsgBody = mJSONObject.getObject("body", NtfBean.class);
            boolean mBackground = AppUtils.isApplicationBroughtToBackground(AppService.this);
            if (mBackground && "BILL_REV".equals(mMsgBody.getCategory())) {
                manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
                Intent mIntent = new Intent(AppService.this, MainActivity.class);
                mIntent.putExtra("isMsg", true);
                mIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
                PendingIntent mPendingIntent = PendingIntent.getActivity(AppService.this,
                        0, mIntent, PendingIntent.FLAG_UPDATE_CURRENT);
                Bitmap mBitmap = BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher);
                mBuilder = new NotificationCompat.Builder(AppService.this)
                        .setLargeIcon(mBitmap)
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentTitle(mMsgBody.getTitle())
                        .setContentText(mMsgBody.getContent())
                        .setWhen(System.currentTimeMillis())
                        .setTicker(mMsgBody.getTitle())
                        .setAutoCancel(true)
                        .setContentIntent(mPendingIntent);
                manager.notify(121, mBuilder.build());
            } else {
                LogUtils.d("GoJs", "yes");
                UpdateData updateData = new UpdateData();
                updateData.getData(MainActivity.getContext(), "Msg");
            }
            /*LogUtils.d("onNewMessage:" + args[0].toString());
            JSONObject mJSONObject = JSON.parseObject(args[0].toString());
            String mType = mJSONObject.getString("type");
//            String title = mJSONObject.getString("title");
            NtfBean mMsgBody = mJSONObject.getObject("body", NtfBean.class);
            boolean mBackground = AppUtils.isApplicationBroughtToBackground(AppService.this);
            LogUtils.d("isApplicationBroughtToBackground" + (mBackground ? "是" : "否"));
            switch (mType) {
                //批准贴现申请
                case "APPROVE_DISCOUNT":
                //收到新票据
                case "REV_NEW_BILL":
                    LogUtils.d("REV_NEW_BILL", "REV_NEW_BILL");
                    MessageBean.MessageBeansEntity mMessageBeansEntity = new MessageBean.MessageBeansEntity();
                    mMessageBeansEntity.setReceiveDate(mMsgBody.getReceiveDate());
                    mMessageBeansEntity.setContent(mMsgBody.getContent());
                    mMessageBeansEntity.setTitle(mMsgBody.getTitle());
                    mMessageBeansEntity.setBillId(mMsgBody.getBillId());
                    mMessageBeansEntity.setCategory(mMsgBody.getCategory());
                    mMessageBeansEntity.setIsRead(mMsgBody.isIsRead());
                    mMessageBeansEntity.setRole(mMsgBody.getRole());
                    mMessageBeansEntity.setId(mMsgBody.getId());
                    CacheUtils.addRevNewsToList(mMessageBeansEntity);
                    RevBillBeans mBill = mJSONObject.getObject("bill", RevBillBeans.class);
                    CacheUtils.addRevBillToList(mBill);
                    MsgNumUtils.addRevBillMsgNum();
//                    BaseApplication.setRevUnRead(BaseApplication.getRevUnRead() + 1);
                    break;
                //受理票据开立，对方放弃贴现
                case "BILL_DRAW":
                case "OPP_IGNORED":
                    //市场动态
                case "MARKET_NEWS":
                    //企业认证失败
                case "ORG_AUTH_FAIL":
                    //企业认证成功
                case "ORG_AUTH_OK":
                    //系统通知
                case "SYSTEM_NOTICE":
                    *//*PushMsgBody mEntity = new PushMsgBody();
                    mEntity.setReceiveDate(mMsgBody.getReceiveDate());
                    mEntity.setContent(mMsgBody.getContent());
                    mEntity.setTitle(mMsgBody.getTitle());
                    mEntity.setCategory(mMsgBody.getCategory());
                    mEntity.setIsRead(mMsgBody.isIsRead());
                    mEntity.setIsRead(mMsgBody.isIsRead());
                    mEntity.setId(mMsgBody.getId());
                    if (mMsgBody.getRole() != null){
                        mEntity.setRole(mMsgBody.getRole());
                    }
                    //TODO:  不确定有无错误
                    if (mMsgBody.getBillId() != 0) {
                        mEntity.setBillId(mMsgBody.getBillId());
                    }*//*
                    if ("BILL_DRAW".equals(mType)) {
                        MsgSentBillBean mBill1 = mJSONObject.getObject("bill", MsgSentBillBean.class);
                        BillUtils.addSentBillToList(mBill1);
                    }
                    CacheUtils.updateNews(mMsgBody, mType);
//                    MsgNumUtils.addOthMsgNum(mType);
//                    BaseApplication.setUnRead(BaseApplication.getUnRead() + 1);
//                    EventBus.getDefault().post(new MsgEventBean());
                    break;
                case "LOGIN_OUT":
                    Intent mIntent = new Intent(AppService.this, LogoutActivity.class);
                    mIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
                    startActivity(mIntent);
                    break;
            }
            if (mBackground) {
                manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
                Intent mIntent = new Intent(AppService.this, MainActivity.class);
                mIntent.putExtra("tabNum", 2);
                mIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
                PendingIntent mPendingIntent = PendingIntent.getActivity(AppService.this,
                        0, mIntent, PendingIntent.FLAG_UPDATE_CURRENT);
                Bitmap mBitmap = BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher);
                mBuilder = new NotificationCompat.Builder(AppService.this)
                        .setLargeIcon(mBitmap)
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentTitle(mMsgBody.getTitle())
                        .setContentText(mMsgBody.getContent())
                        .setWhen(System.currentTimeMillis())
                        .setTicker(mMsgBody.getTitle())
                        .setAutoCancel(true)
                        .setContentIntent(mPendingIntent);
                manager.notify(121, mBuilder.build());
            }
//            else {
                AppUtils.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        activity.setData(MsgNumUtils.getRevBillMsgNum(), MsgNumUtils.getOthMsgNum());
                    }
                });
            EventBus.getDefault().post(new MsgEventBean());
//            }*/
        }
    };
    private Emitter.Listener onMessage = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            LogUtils.d("onMessage:" + args[0].toString());
        }
    };

//    public class MyBinder extends Binder {
//        // 获取service对象的引用
//        public AppService getService() {
//            return AppService.this;
//        }
//    }
//
//    public void setActivity(MainActivity _activity) {
//        this.activity = _activity;
//    }
}
