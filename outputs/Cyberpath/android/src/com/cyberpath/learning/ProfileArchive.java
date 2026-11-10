package com.cyberpath.learning;
import android.content.Context;
import android.util.AtomicFile;
import org.json.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
/** Read-only archive access. Never switches the active profile or includes signing keys. */
public final class ProfileArchive {
 private static JSONObject read(File file,int limit)throws Exception{AtomicFile atomic=new AtomicFile(file);if(!atomic.getBaseFile().exists())throw new IOException("A backup file is missing");try(InputStream input=atomic.openRead()){return new JSONObject(new String(AppFiles.readBounded(input,limit),StandardCharsets.UTF_8));}}
 public static String export(Context c,String id)throws Exception{
  if(!ProfileFiles.valid(id))throw new IOException("Invalid profile");boolean known="default".equals(id);String registry=ProfileFiles.registry(c);if(!registry.isEmpty()){JSONArray rows=new JSONObject(registry).getJSONArray("profiles");for(int i=0;i<rows.length();i++)known|=id.equals(rows.getJSONObject(i).getString("id"));}if(!known)throw new IOException("Profile not found");
  File root="default".equals(id)?c.getFilesDir():new File(c.getFilesDir(),"learner-profiles/"+id),state=new File(root,"studio-workspace.json");if(!state.exists())return "";JSONObject workspace=read(state,30000000),learning=workspace.optJSONObject("learning"),payload=new JSONObject().put("format","cyberpath-workspace").put("version",2).put("exportedAt",Instant.now().toString()).put("workspace",workspace);JSONArray files=new JSONArray(),history=new JSONArray();Set<String> assetIds=new HashSet<>(),eventIds=new HashSet<>();
  if(learning!=null){List<JSONArray> lists=new ArrayList<>();lists.add(learning.optJSONArray("assets"));JSONObject safety=learning.optJSONObject("dataSafety");if(safety!=null)lists.add(safety.optJSONArray("archivedAssets"));for(JSONArray list:lists)if(list!=null)for(int i=0;i<list.length();i++){String asset=list.getJSONObject(i).getString("id");if(!asset.matches("[A-Za-z0-9_-]{1,100}"))throw new IOException("Invalid asset ID");if(assetIds.add(asset))files.put(read(new File(root,"studio-library/asset-"+asset+".json"),40000000));}}
  File[] events=new File(root,"studio-library").listFiles();if(events!=null)for(File file:events)if(file.getName().matches("journal-[A-Za-z0-9_-]{1,100}\\.json")){JSONObject event=read(file,40000000);if(eventIds.add(event.getString("id")))history.put(event);}JSONArray pending=learning==null?null:learning.optJSONArray("pendingHistory");if(pending!=null)for(int i=0;i<pending.length();i++){JSONObject event=pending.getJSONObject(i);if(eventIds.add(event.getString("id")))history.put(event);}
  String result=payload.put("localFiles",files).put("activityHistory",history).toString();if(result.length()>150000000)throw new IOException("Profile archive exceeds 150 MB");return result;
 }
}
