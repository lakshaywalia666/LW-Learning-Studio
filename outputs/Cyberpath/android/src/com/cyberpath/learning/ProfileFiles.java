package com.cyberpath.learning;
import android.content.Context;
import org.json.*;
import java.io.*;
import java.util.*;
/** Device-local profile registry; the original learner keeps the original paths. */
public final class ProfileFiles {
 private static android.content.SharedPreferences host(Context c){return c.getSharedPreferences("lw-profile-host",Context.MODE_PRIVATE);}
 public static boolean valid(String id){return "default".equals(id)||id!=null&&id.matches("learner-[a-f0-9]{16,32}");}
 public static String active(Context c){String id=host(c).getString("active","default");return valid(id)?id:"default";}
 public static File root(Context c){String id=active(c);File root="default".equals(id)?c.getFilesDir():new File(c.getFilesDir(),"learner-profiles/"+id);if(!root.exists()&&!root.mkdirs())throw new IllegalStateException("The profile folder could not be created");return root;}
 public static void requireActive(Context c,String expected)throws IOException{if(!valid(expected)||!active(c).equals(expected))throw new IOException("The profile changed. Reload this screen before editing.");}
 public static String registry(Context c){return host(c).getString("registry","");}
 public static void registry(Context c,String text)throws Exception{if(text.length()>30000)throw new IOException("Too many profiles");JSONObject registry=new JSONObject(text);JSONArray profiles=registry.getJSONArray("profiles");Set<String> ids=new HashSet<>();if(registry.getInt("version")!=1||profiles.length()<1||profiles.length()>30)throw new IOException("Invalid profile profiles");for(int i=0;i<profiles.length();i++){JSONObject p=profiles.getJSONObject(i);String id=p.getString("id"),name=p.getString("name");if(!valid(id)||!ids.add(id)||name.trim().isEmpty()||name.length()>40)throw new IOException("Invalid profile name or ID");}if(!ids.contains("default")||!ids.contains(registry.getString("activeId")))throw new IOException("A profile is missing");if(!host(c).edit().putString("registry",text).commit())throw new IOException("The profile list could not be saved");}
 public static void activate(Context c,String id)throws Exception{if(!valid(id))throw new IOException("Invalid profile profile");if(!"default".equals(id)){JSONArray rows=new JSONObject(registry(c)).getJSONArray("profiles");boolean exists=false;for(int i=0;i<rows.length();i++)exists|=id.equals(rows.getJSONObject(i).getString("id"));if(!exists)throw new IOException("Profile not found");}File destination="default".equals(id)?c.getFilesDir():new File(c.getFilesDir(),"learner-profiles/"+id);if(!destination.exists()&&!destination.mkdirs())throw new IOException("The profile folder could not be created");if(!host(c).edit().putString("active",id).commit())throw new IOException("The profile could not be selected");root(c);}
}
