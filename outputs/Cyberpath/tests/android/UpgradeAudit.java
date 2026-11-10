package com.cyberpath.learning;
import android.app.*;
import android.content.*;
import android.os.*;
import android.util.AtomicFile;
import org.json.*;
import java.io.*;
import java.nio.charset.StandardCharsets;

/** Old APK -> current QA APK retention check on the fresh audit emulator only. */
public final class UpgradeAudit extends Instrumentation {
 private String phase;
 @Override public void onCreate(Bundle args){super.onCreate(args);phase=args.getString("phase","");start();}
 private void check(boolean value,String message){if(!value)throw new AssertionError(message);}
 private int completed(JSONObject workspace)throws Exception{int count=0;JSONObject courses=workspace.getJSONObject("courses");for(java.util.Iterator<String> ids=courses.keys();ids.hasNext();){JSONObject progress=courses.getJSONObject(ids.next()).optJSONObject("taskProgress");if(progress!=null)for(java.util.Iterator<String> keys=progress.keys();keys.hasNext();)if(progress.getJSONObject(keys.next()).optBoolean("done"))count++;}return count;}
 private long minutes(JSONObject workspace)throws Exception{long count=0;JSONObject courses=workspace.getJSONObject("courses");for(java.util.Iterator<String> ids=courses.keys();ids.hasNext();){JSONArray sessions=courses.getJSONObject(ids.next()).optJSONArray("sessions");if(sessions!=null)for(int i=0;i<sessions.length();i++)count+=sessions.getJSONObject(i).getLong("minutes");}return count;}
 @Override public void onStart(){Bundle report=new Bundle();MainActivity activity=null;try{
  Context context=getTargetContext();JSONObject backup;try(InputStream input=getContext().getAssets().open("upgrade-fixture.json")){backup=new JSONObject(new String(AppFiles.readBounded(input,10000000),StandardCharsets.UTF_8));}JSONObject expected=backup.getJSONObject("workspace");check("default".equals(ProfileFiles.active(context)),"Audit emulator was not on its primary profile");
  if("prepare".equals(phase)){synchronized(AppFiles.LOCK){JSONObject fixture=new JSONObject(expected.toString());fixture.put("revision",Math.max(1000,AppFiles.workspace(context).optLong("revision")+1000));AtomicFile target=new AtomicFile(new File(context.getFilesDir(),"studio-workspace.json"));FileOutputStream output=null;try{output=target.startWrite();output.write(fixture.toString().getBytes(StandardCharsets.UTF_8));target.finishWrite(output);}catch(Exception e){if(output!=null)target.failWrite(output);throw e;}JSONArray files=backup.getJSONArray("localFiles");for(int i=0;i<files.length();i++){JSONObject file=files.getJSONObject(i);LocalLibrary.put(context,"asset-"+file.getString("id"),file.toString());}}}
  long before=AppFiles.workspace(context).getLong("revision");Intent launch=new Intent(Intent.ACTION_MAIN).setClassName(context,"com.cyberpath.learning.MainActivity").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);activity=(MainActivity)startActivitySync(launch);JSONObject actual=null;for(int i=0;i<300;i++){actual=AppFiles.workspace(context);if(actual.optLong("revision")>before)break;SystemClock.sleep(100);}check(actual!=null&&actual.optLong("revision")>before,"The installed app did not load and save the historic fixture");
  check(completed(actual)==completed(expected),"Upgrade changed completed task records");check(minutes(actual)==minutes(expected),"Upgrade changed logged study minutes");JSONArray pages=expected.getJSONObject("learning").getJSONArray("pages"),current=actual.getJSONObject("learning").getJSONArray("pages");for(int i=0;i<pages.length();i++){JSONObject page=pages.getJSONObject(i),found=null;for(int j=0;j<current.length();j++)if(page.getString("id").equals(current.getJSONObject(j).getString("id")))found=current.getJSONObject(j);check(found!=null&&page.getString("title").equals(found.getString("title"))&&page.getJSONArray("blocks").toString().equals(found.getJSONArray("blocks").toString()),"Upgrade changed an existing notebook page");}
  JSONArray files=backup.getJSONArray("localFiles");for(int i=0;i<files.length();i++){JSONObject expectedFile=files.getJSONObject(i),file=new JSONObject(LocalLibrary.get(context,"asset-"+expectedFile.getString("id")));check(file.getString("dataURL").equals(expectedFile.getString("dataURL")),"Upgrade changed an attachment");}
  report.putString("phase",phase);report.putInt("completed_tasks_preserved",completed(actual));report.putLong("logged_minutes_preserved",minutes(actual));report.putInt("notebook_pages_preserved",pages.length());report.putInt("attachments_preserved",files.length());if("verify".equals(phase)){check(actual.getJSONObject("learning").has("voiceTools")&&actual.getJSONObject("learning").has("personalize"),"New offline sections were not added");report.putBoolean("new_sections_added_without_replacing_records",true);}report.putString("result","PASS");final MainActivity opened=activity;runOnMainSync(opened::finish);finish(Activity.RESULT_OK,report);
 }catch(Throwable e){report.putString("result","FAIL");report.putString("failure",e.toString());finish(Activity.RESULT_CANCELED,report);}}
}
