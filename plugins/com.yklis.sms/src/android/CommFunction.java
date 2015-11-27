package com.yklis.sms;

import android.content.Context;
import android.net.Uri;
import android.database.Cursor;

import android.telephony.gsm.SmsManager;
import android.app.PendingIntent;
import android.content.Intent;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class CommFunction extends CordovaPlugin {

    private static final Uri SMS_INBOX = Uri.parse("content://sms/inbox");

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        //action:插件JS中调用时传入的方法名
        //args:入参
        //callbackContext:成功或失败时的回调函数，会传给JS
        if (action.equals("readSms")) {
            try{
                Context currentCtx = cordova.getActivity();//获取当前的Activity

                Cursor c = currentCtx.getContentResolver().query(SMS_INBOX, null, null, null, null);

                JSONArray jsonArray = new JSONArray();
                while(c.moveToNext())
                {
                  int iAddress=c.getColumnIndex("address");
                  int iBody=c.getColumnIndex("body");

                  JSONObject jsonObject = new JSONObject(); 
                  jsonObject.put("address",c.getString(iAddress));
                  jsonObject.put("body",c.getString(iBody));

                  jsonArray.put(jsonObject);
                }
                c.close();

                callbackContext.success(jsonArray);
                return true;
            } catch (Exception ex) {
                callbackContext.error(ex.toString());
            }
        }

        if (action.equals("sendSms")) {
            try{
                String sAddress = args.getString(0);
                String sBody = args.getString(1);

                Context currentCtx = cordova.getActivity();//获取当前的Activity

                SmsManager sm=SmsManager.getDefault();
                PendingIntent mPI=PendingIntent.getBroadcast(currentCtx, 0, new Intent(), 0);
                sm.sendTextMessage(sAddress, null, sBody, mPI, null);         

                callbackContext.success("Send Sms Success");
                return true;
            } catch (Exception ex) {
                callbackContext.error(ex.toString());
            }
        }   
        return false;
    }
}