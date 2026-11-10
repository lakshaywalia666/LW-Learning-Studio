package com.cyberpath.learning;

import android.Manifest;
import android.app.*;
import android.content.*;
import android.content.pm.PackageManager;
import android.os.Build;
import org.json.*;
import java.time.*;
import java.util.*;

/** Date-specific personal alerts. Only the active profile is read or notified. */
public final class PersonalReminders {
 public static final String ACTION="com.cyberpath.learning.PERSONAL_REMINDERS",CHANNEL="lw-personal-reminders";
 private static final int REQUEST=510,NOTIFICATION=912;
 private static final long CATCH_UP=24*60*60_000L;
 private static PendingIntent alarm(Context c){return PendingIntent.getBroadcast(c,REQUEST,new Intent(c,ReminderReceiver.class).setAction(ACTION),PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);}
 private static SharedPreferences prefs(Context c){return NativeServices.prefs(c);}
 private static JSONArray items(JSONObject workspace){JSONObject learning=workspace.optJSONObject("learning"),organizer=learning==null?null:learning.optJSONObject("organizer");JSONArray items=organizer==null?null:organizer.optJSONArray("items");return items==null?new JSONArray():items;}
 private static JSONObject delivered(Context c){try{return new JSONObject(prefs(c).getString("personalDelivered","{}"));}catch(Exception error){return new JSONObject();}}
 private static String tag(String profile,String id){return "personal-"+profile+"-"+id;}
 private static String key(JSONObject r){String date=r.optString("alertDate");if(date.isEmpty())date=r.optString("date");return date+"T"+r.optString("time")+(r.optString("snoozedUntil").isEmpty()?"":"@"+r.optString("snoozedUntil"))+"#"+(r.optJSONObject("extra")==null?"local:[0]":r.optJSONObject("extra").optString("timeZone","local")+r.optJSONObject("extra").optJSONArray("alerts"));}
 public static boolean permissionGranted(Context c){return Build.VERSION.SDK_INT<33||c.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)==PackageManager.PERMISSION_GRANTED;}
 public static boolean precise(Context c){return Build.VERSION.SDK_INT<31||((AlarmManager)c.getSystemService(Context.ALARM_SERVICE)).canScheduleExactAlarms();}
 public static boolean allowed(Context c){NotificationManager nm=(NotificationManager)c.getSystemService(Context.NOTIFICATION_SERVICE);NotificationChannel channel=nm.getNotificationChannel(CHANNEL);return permissionGranted(c)&&nm.areNotificationsEnabled()&&(channel==null||channel.getImportance()!=NotificationManager.IMPORTANCE_NONE);}
 public static void channel(Context c){NotificationChannel channel=new NotificationChannel(CHANNEL,"Personal reminders",NotificationManager.IMPORTANCE_DEFAULT);channel.setDescription("Dates and times chosen in your Reminders tab");((NotificationManager)c.getSystemService(Context.NOTIFICATION_SERVICE)).createNotificationChannel(channel);}
 private static long due(JSONObject r){try{String date=r.optString("alertDate"),time=r.optString("time");if(date.isEmpty())date=r.optString("date");if(!"pending".equals(r.optString("status"))||!r.optBoolean("notify")||!time.matches("([01][0-9]|2[0-3]):[0-5][0-9]")||!date.matches("[0-9]{4}-[0-9]{2}-[0-9]{2}"))return 0;String snoozed=r.optString("snoozedUntil");if(!snoozed.isEmpty())return Instant.parse(snoozed).toEpochMilli();return LocalDate.parse(date).atTime(LocalTime.parse(time)).atZone(r.optJSONObject("extra")==null||"local".equals(r.optJSONObject("extra").optString("timeZone","local"))?ZoneId.systemDefault():ZoneId.of(r.optJSONObject("extra").optString("timeZone"))).toInstant().toEpochMilli();}catch(Exception error){return 0;}}
 private static List<Long> times(JSONObject r){List<Long> result=new ArrayList<>();long base=due(r);if(base<=0)return result;if(!r.optString("snoozedUntil").isEmpty()){result.add(base);return result;}JSONObject extra=r.optJSONObject("extra");JSONArray offsets=extra==null?null:extra.optJSONArray("alerts");if(offsets==null)result.add(base);else for(int i=0;i<Math.min(4,offsets.length());i++){int offset=offsets.optInt(i,-1);if(offset>=0&&offset<=43200)result.add(base-offset*60000L);}Collections.sort(result);return result;}
 private static long remaining(JSONObject r,String sent){int deliveredCount=0;String prefix=key(r)+"|";if(sent.startsWith(prefix))try{deliveredCount=Integer.parseInt(sent.substring(prefix.length()));}catch(Exception ignored){}List<Long> values=times(r);if(deliveredCount<0||deliveredCount>values.size())deliveredCount=0;long oldest=System.currentTimeMillis()-CATCH_UP;for(int i=deliveredCount;i<values.size();i++)if(values.get(i)>=oldest)return values.get(i);return 0;}
 public static void sync(Context c){synchronized(AppFiles.LOCK){sync(c,AppFiles.workspace(c));}}
 public static void sync(Context c,JSONObject workspace){synchronized(AppFiles.LOCK){
  try{channel(c);AlarmManager alarms=(AlarmManager)c.getSystemService(Context.ALARM_SERVICE);alarms.cancel(alarm(c));
   JSONArray rows=items(workspace);Map<String,JSONObject> pending=new HashMap<>();int count=0;
   for(int i=0;i<rows.length();i++){JSONObject r=rows.optJSONObject(i);if(r!=null&&due(r)>0){pending.put(r.optString("id"),r);count++;}}
   JSONObject sent=delivered(c);NotificationManager nm=(NotificationManager)c.getSystemService(Context.NOTIFICATION_SERVICE);String profile=ProfileFiles.active(c);List<String> remove=new ArrayList<>();
   for(Iterator<String> it=sent.keys();it.hasNext();){String id=it.next();JSONObject r=pending.get(id);if(r==null||!sent.optString(id).startsWith(key(r)+"|")){nm.cancel(tag(profile,id),NOTIFICATION);remove.add(id);}}
   for(String id:remove)sent.remove(id);
   long now=System.currentTimeMillis(),next=Long.MAX_VALUE;if(allowed(c))for(JSONObject r:pending.values()){long at=remaining(r,sent.optString(r.optString("id")));if(at<=0)continue;next=Math.min(next,Math.max(now+1500,at));}
   SharedPreferences.Editor edit=prefs(c).edit().putString("personalDelivered",sent.toString()).putInt("personalCount",count).putLong("personalNext",next==Long.MAX_VALUE?0:next).remove("personalError");edit.apply();
   if(next!=Long.MAX_VALUE){try{if(precise(c))alarms.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,next,alarm(c));else alarms.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,next,alarm(c));}catch(SecurityException revoked){alarms.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,next,alarm(c));}}
  }catch(Exception error){prefs(c).edit().putLong("personalNext",0).putString("personalError","Phone alerts need attention: "+error.getMessage()).apply();}
 }}
 public static void deliver(Context c){synchronized(AppFiles.LOCK){
  try{channel(c);if(!allowed(c)){sync(c);return;}JSONObject workspace=AppFiles.workspace(c),sent=delivered(c);JSONArray rows=items(workspace);long now=System.currentTimeMillis();String profile=ProfileFiles.active(c);NotificationManager nm=(NotificationManager)c.getSystemService(Context.NOTIFICATION_SERVICE);int posted=0;
   for(int i=0;i<rows.length()&&posted<32;i++){JSONObject r=rows.optJSONObject(i);if(r==null)continue;String id=r.optString("id");long at=remaining(r,sent.optString(id));if(at<=0||at>now)continue;for(long candidate:times(r))if(candidate>=at&&candidate<=now)at=candidate;
    Intent open=new Intent(c,MainActivity.class).setAction("personal-open-"+id).putExtra("lwRoute","reminders").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP|Intent.FLAG_ACTIVITY_SINGLE_TOP);
    PendingIntent target=PendingIntent.getActivity(c,0,open,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
    String title=r.optString("title","Your reminder"),note=r.optString("note"),text=note.isEmpty()?"Open Reminders and tap Done when it’s finished.":note;
    Notification notification=new Notification.Builder(c,CHANNEL).setSmallIcon(R.drawable.notification_leaf).setContentTitle(title).setContentText(text).setStyle(new Notification.BigTextStyle().bigText(text)).setContentIntent(target).setAutoCancel(true).setVisibility(Notification.VISIBILITY_PRIVATE).setLocalOnly(!prefs(c).getBoolean("watchMirror",true)).setGroup("lw-personal").addAction(ReminderActions.button(c,profile,r,"done",UiText.of(c,"Done","पूरा हुआ"))).addAction(ReminderActions.button(c,profile,r,"snooze",UiText.of(c,"Snooze 10 min","10 मिनट बाद"))).build();
    nm.notify(tag(profile,id),NOTIFICATION,notification);int deliveredCount=0;for(long value:times(r))if(value<=at)deliveredCount++;sent.put(id,key(r)+"|"+deliveredCount);posted++;
   }
   prefs(c).edit().putString("personalDelivered",sent.toString()).apply();sync(c,workspace);
  }catch(Exception error){prefs(c).edit().putString("personalError","A phone alert could not be shown.").apply();}
 }}
 public static void beforeSwitch(Context c){synchronized(AppFiles.LOCK){((AlarmManager)c.getSystemService(Context.ALARM_SERVICE)).cancel(alarm(c));NotificationManager nm=(NotificationManager)c.getSystemService(Context.NOTIFICATION_SERVICE);nm.cancel("reminder-undo",913);nm.cancel(901);nm.cancel(902);String profile=ProfileFiles.active(c);JSONObject sent=delivered(c);for(Iterator<String> it=sent.keys();it.hasNext();)nm.cancel(tag(profile,it.next()),NOTIFICATION);prefs(c).edit().putLong("personalNext",0).apply();}}
 public static JSONObject status(Context c){try{return new JSONObject().put("allowed",allowed(c)).put("permissionGranted",permissionGranted(c)).put("precise",precise(c)).put("nextAt",prefs(c).getLong("personalNext",0)).put("count",prefs(c).getInt("personalCount",0)).put("error",prefs(c).getString("personalError",""));}catch(Exception error){return new JSONObject();}}
}
