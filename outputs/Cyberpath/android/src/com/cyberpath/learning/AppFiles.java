package com.cyberpath.learning;
import android.content.Context;
import android.util.AtomicFile;
import org.json.JSONObject;
import java.io.*;
import java.nio.charset.StandardCharsets;
public final class AppFiles {
 public static final Object LOCK=new Object();
 public static byte[] readBounded(InputStream input,int limit)throws IOException{ByteArrayOutputStream out=new ByteArrayOutputStream();byte[] buffer=new byte[16384];int n;while((n=input.read(buffer))!=-1){if(out.size()+n>limit)throw new IOException("The file exceeds the supported size");out.write(buffer,0,n);}return out.toByteArray();}
 public static String read(Context context)throws IOException{synchronized(LOCK){AtomicFile file=new AtomicFile(new File(ProfileFiles.root(context),"studio-workspace.json"));if(!file.getBaseFile().exists())return"";try(InputStream in=file.openRead()){return new String(readBounded(in,30_000_000),StandardCharsets.UTF_8);}}}
 public static JSONObject workspace(Context context){try{return new JSONObject(read(context));}catch(Exception ignored){return new JSONObject();}}
}
