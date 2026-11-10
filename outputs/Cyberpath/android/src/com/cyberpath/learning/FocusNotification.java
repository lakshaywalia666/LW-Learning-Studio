package com.cyberpath.learning;
import android.app.*;
import android.content.*;
import android.content.pm.PackageManager;
import android.os.Build;
import org.json.*;
import java.time.Instant;
/** System-rendered focus countdown. Never completes a lesson or records study time. */
public final class FocusNotification {
 public static final String ACTION="com.cyberpath.learning.FOCUS_GOAL",DISMISS="com.cyberpath.learning.FOCUS_DISMISS",CHANNEL="lw-focus";
 private static final int NOTIFICATION=907,ALARM=347;
 private static PendingIntent alarm(Context c){return PendingIntent.getBroadcast(c,ALARM,new Intent(c,ReminderReceiver.class).setAction(ACTION),PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);}
 public static void channel(Context c){NotificationChannel channel=new NotificationChannel(CHANNEL,"Focus countdown",NotificationManager.IMPORTANCE_LOW);channel.setDescription("Your optional focus timer; opens the reflection screen");((NotificationManager)c.getSystemService(Context.NOTIFICATION_SERVICE)).createNotificationChannel(channel);}
 public static boolean allowed(Context c){NotificationManager nm=(NotificationManager)c.getSystemService(Context.NOTIFICATION_SERVICE);NotificationChannel channel=nm.getNotificationChannel(CHANNEL);return (Build.VERSION.SDK_INT<33||c.checkSelfPermission("android.permission.POST_NOTIFICATIONS")==PackageManager.PERMISSION_GRANTED)&&nm.areNotificationsEnabled()&&(channel==null||channel.getImportance()!=NotificationManager.IMPORTANCE_NONE);}
 private static JSONObject active(JSONObject workspace){JSONObject learning=workspace.optJSONObject("learning"),focus=learning==null?null:learning.optJSONObject("focus"),preferences=focus==null?null:focus.optJSONObject("preferences");if(preferences==null||!preferences.optBoolean("notify",false))return null;JSONArray sessions=focus.optJSONArray("sessions");if(sessions!=null)for(int i=0;i<sessions.length();i++){JSONObject row=sessions.optJSONObject(i);if(row!=null&&row.optString("endedAt").isEmpty())return row;}return null;}
 private static String key(Context c,JSONObject session){return ProfileFiles.active(c)+":"+session.optString("id")+":"+session.optString("startedAt")+":"+session.optInt("minutes");}
 public static void sync(Context c){synchronized(AppFiles.LOCK){sync(c,AppFiles.workspace(c));}}
 public static void sync(Context c,JSONObject workspace){synchronized(AppFiles.LOCK){NotificationManager nm=(NotificationManager)c.getSystemService(Context.NOTIFICATION_SERVICE);AlarmManager alarms=(AlarmManager)c.getSystemService(Context.ALARM_SERVICE);alarms.cancel(alarm(c));try{
  JSONObject session=active(workspace);if(session==null){nm.cancel(NOTIFICATION);NativeServices.prefs(c).edit().remove("focusDismissed").remove("focusError").apply();return;}
  String id=session.optString("id"),identity=key(c,session);int minutes=session.optInt("minutes");if(!id.matches("[A-Za-z0-9_-]{1,100}")||minutes<1||minutes>180)throw new IllegalArgumentException("Invalid focus timer");long deadline=Math.addExact(Instant.parse(session.getString("startedAt")).toEpochMilli(),minutes*60000L),now=System.currentTimeMillis();channel(c);if(!allowed(c)||identity.equals(NativeServices.prefs(c).getString("focusDismissed",""))){nm.cancel(NOTIFICATION);return;}
  Intent intent=new Intent(c,MainActivity.class).putExtra("lwRoute","focus").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP|Intent.FLAG_ACTIVITY_SINGLE_TOP);PendingIntent open=PendingIntent.getActivity(c,348,intent,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
  Intent dismiss=new Intent(c,ReminderReceiver.class).setAction(DISMISS).setData(android.net.Uri.parse("lw-focus://dismiss/"+android.net.Uri.encode(identity))).putExtra("identity",identity);PendingIntent hide=PendingIntent.getBroadcast(c,349,dismiss,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
  boolean running=deadline>now;String intention=session.optString("intention");if(intention.length()>240)intention=intention.substring(0,240);String text=running?(intention.isEmpty()?"One thing at a time. Tap to open Focus.":intention):"Finish when you are ready. Tap to reflect.";
  Notification.Builder builder=new Notification.Builder(c,CHANNEL).setSmallIcon(R.drawable.notification_leaf).setContentTitle(running?"A little focus":"Focus goal reached").setContentText(text).setStyle(new Notification.BigTextStyle().bigText(text)).setContentIntent(open).setDeleteIntent(hide).setCategory(Notification.CATEGORY_PROGRESS).setVisibility(Notification.VISIBILITY_PRIVATE).setOnlyAlertOnce(true).setOngoing(running).setAutoCancel(!running).setShowWhen(running);
  if(running){builder.setWhen(deadline).setUsesChronometer(true).setChronometerCountDown(true);alarms.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,deadline,alarm(c));}
  nm.notify(NOTIFICATION,builder.build());NativeServices.prefs(c).edit().remove("focusError").apply();
 }catch(Exception e){nm.cancel(NOTIFICATION);NativeServices.prefs(c).edit().putString("focusError","The focus notification could not be shown.").apply();}}}
 public static void dismiss(Context c,String identity){synchronized(AppFiles.LOCK){JSONObject session=active(AppFiles.workspace(c));if(session!=null&&key(c,session).equals(identity)){NativeServices.prefs(c).edit().putString("focusDismissed",identity).apply();((NotificationManager)c.getSystemService(Context.NOTIFICATION_SERVICE)).cancel(NOTIFICATION);((AlarmManager)c.getSystemService(Context.ALARM_SERVICE)).cancel(alarm(c));}}}
 public static JSONObject status(Context c){try{return new JSONObject().put("allowed",allowed(c)).put("error",NativeServices.prefs(c).getString("focusError",""));}catch(Exception ignored){return new JSONObject();}}
}
