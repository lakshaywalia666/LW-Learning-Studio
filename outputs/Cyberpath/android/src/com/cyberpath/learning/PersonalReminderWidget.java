package com.cyberpath.learning;
import android.app.*;
import android.appwidget.*;
import android.content.*;
import android.view.View;
import android.widget.RemoteViews;
import org.json.*;
import java.time.LocalDate;
import java.util.*;

/** A separate, bounded reminder widget; never completes learning tasks. */
public final class PersonalReminderWidget extends AppWidgetProvider {
 public static void updateAll(Context c){synchronized(AppFiles.LOCK){AppWidgetManager m=AppWidgetManager.getInstance(c);for(int id:m.getAppWidgetIds(new ComponentName(c,PersonalReminderWidget.class)))update(c,m,id);}}
 static void update(Context c,AppWidgetManager m,int id){try{
  JSONObject w=AppFiles.workspace(c),learning=w.optJSONObject("learning"),organizer=learning==null?null:learning.optJSONObject("organizer");JSONArray all=organizer==null?null:organizer.optJSONArray("items");List<JSONObject> rows=new ArrayList<>();String today=LocalDate.now().toString();boolean locked=AppLock.enabled(c);
  if(all!=null&&!locked)for(int i=0;i<all.length();i++){JSONObject r=all.optJSONObject(i);if(r!=null&&"pending".equals(r.optString("status"))&&!r.optString("date").isEmpty()&&r.optString("date").compareTo(today)<=0)rows.add(r);}
  rows.sort(Comparator.comparing((JSONObject r)->r.optString("date")).thenComparing(r->r.optString("time").isEmpty()?"99:99":r.optString("time")));
  RemoteViews v=new RemoteViews(c.getPackageName(),R.layout.personal_reminder_widget);PendingIntent open=PendingIntent.getActivity(c,id,new Intent(c,MainActivity.class).setAction("widget-reminders-"+id).putExtra("lwRoute","reminders"),PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);v.setOnClickPendingIntent(R.id.personal_widget_root,open);
  v.setTextViewText(R.id.personal_widget_heading,locked?"Unlock LW to see reminders":rows.size()+" reminder"+(rows.size()==1?"":"s")+" today");
  int[] titles={R.id.personal_title_1,R.id.personal_title_2,R.id.personal_title_3},done={R.id.personal_done_1,R.id.personal_done_2,R.id.personal_done_3},later={R.id.personal_later_1,R.id.personal_later_2,R.id.personal_later_3},containers={R.id.personal_row_1,R.id.personal_row_2,R.id.personal_row_3};
  int maxRows=m.getAppWidgetOptions(id).getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT,280)<260?2:3;for(int n=0;n<3;n++){v.setViewVisibility(containers[n],n<rows.size()&&n<maxRows?View.VISIBLE:View.GONE);if(n>=rows.size()||n>=maxRows)continue;JSONObject r=rows.get(n);v.setTextViewText(titles[n],r.optString("title")+(r.optString("time").isEmpty()?"":" · "+r.optString("time")));v.setTextViewText(done[n],UiText.of(c,"Done","पूरा हुआ"));v.setTextViewText(later[n],UiText.of(c,"+1 day","+1 दिन"));v.setContentDescription(done[n],UiText.of(c,"Complete reminder: ","रिमाइंडर पूरा करें: ")+r.optString("title"));v.setContentDescription(later[n],UiText.of(c,"Move one day later: ","एक दिन आगे करें: ")+r.optString("title"));v.setOnClickPendingIntent(titles[n],open);v.setOnClickPendingIntent(done[n],ReminderActions.pending(c,ProfileFiles.active(c),r,"done"));v.setOnClickPendingIntent(later[n],ReminderActions.pending(c,ProfileFiles.active(c),r,"tomorrow"));}
  v.setViewVisibility(R.id.personal_widget_empty,rows.isEmpty()?View.VISIBLE:View.GONE);v.setTextViewText(R.id.personal_widget_empty,locked?"Your reminders stay private.":"Nothing due. Open LW to add a reminder.");JSONObject receipt=new JSONObject(NativeServices.prefs(c).getString("reminderUndo","{}"));boolean undo=receipt.has("after")&&!locked;v.setTextViewText(R.id.personal_widget_undo,UiText.of(c,"Undo last reminder action","पिछला बदलाव वापस लें"));v.setViewVisibility(R.id.personal_widget_undo,undo?View.VISIBLE:View.GONE);if(undo){Intent i=new Intent(c,ReminderActions.class).setAction(ReminderActions.ACTION).setData(android.net.Uri.parse("lw-reminder://widget-undo/"+id)).putExtra("profile",ProfileFiles.active(c)).putExtra("operation","undo").putExtra("identity",receipt.getString("after"));v.setOnClickPendingIntent(R.id.personal_widget_undo,PendingIntent.getBroadcast(c,id,i,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE));}m.updateAppWidget(id,v);
 }catch(Exception ignored){}}
 @Override public void onAppWidgetOptionsChanged(Context c,AppWidgetManager m,int id,android.os.Bundle options){synchronized(AppFiles.LOCK){update(c,m,id);}}
 @Override public void onUpdate(Context c,AppWidgetManager m,int[] ids){synchronized(AppFiles.LOCK){for(int id:ids)update(c,m,id);}}
}
