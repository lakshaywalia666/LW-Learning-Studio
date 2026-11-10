package com.cyberpath.learning;
import android.content.*;
public final class ReminderReceiver extends BroadcastReceiver {
 @Override public void onReceive(Context c,Intent intent){PendingResult result=goAsync();new Thread(()->{try{synchronized(AppFiles.LOCK){if(FocusNotification.DISMISS.equals(intent.getAction()))FocusNotification.dismiss(c,intent.getStringExtra("identity"));else FocusNotification.sync(c);if(NativeServices.REMIND.equals(intent.getAction()))NativeServices.notifyStudy(c,false);if(PersonalReminders.ACTION.equals(intent.getAction()))PersonalReminders.deliver(c);else PersonalReminders.sync(c);NativeServices.scheduleReminder(c);NativeServices.scheduleBackups(c);LearningWidget.updateAll(c);}}finally{result.finish();}},"lw-reminder").start();}
}
