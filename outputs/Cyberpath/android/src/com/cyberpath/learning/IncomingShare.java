package com.cyberpath.learning;

import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.OpenableColumns;
import android.util.AtomicFile;
import android.util.Base64;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;

/** One bounded, profile-owned temporary intake. No workspace writes or remote URI reads. */
final class IncomingShare {
 private static final Object LOCK=new Object();
 private static boolean reading;
 private static final int LIMIT=25_000_000;
 private static AtomicFile file(Context c){return new AtomicFile(new File(c.getCacheDir(),"lw-incoming-review.json"));}
 static boolean accepts(Intent intent){return intent!=null&&(Intent.ACTION_SEND.equals(intent.getAction())||Intent.ACTION_VIEW.equals(intent.getAction())&&intent.getData()!=null);}
 interface Result {void finished(String error);}
 static void accept(Context c,Intent source,Result result){
  final String profile=ProfileFiles.active(c);final Intent intent=new Intent(source);
  synchronized(LOCK){if(reading||file(c).getBaseFile().exists()){result.finished("A shared item is already waiting. Review it in Bring into LW before sending another.");return;}reading=true;}
  NativeServices.IO.execute(()->{String error="";try{
   JSONObject value=new JSONObject().put("version",1).put("profileId",profile).put("token","share-"+java.util.UUID.randomUUID());
   Uri uri=null;
   if(Intent.ACTION_VIEW.equals(intent.getAction()))uri=intent.getData();
   else {Object stream=intent.getParcelableExtra(Intent.EXTRA_STREAM);if(stream!=null&&!(stream instanceof Uri))throw new IllegalArgumentException("Share one supported file at a time.");uri=(Uri)stream;}
   if(uri==null){CharSequence raw=intent.getCharSequenceExtra(Intent.EXTRA_TEXT);String text=raw==null?"":raw.toString().trim();if(text.isEmpty()||text.length()>10000)throw new IllegalArgumentException("Share between 1 and 10,000 characters of text.");value.put("kind","text").put("text",text);}
   else {
    if(!"content".equals(uri.getScheme())||uri.getAuthority()==null||uri.getAuthority().startsWith(c.getPackageName()))throw new IllegalArgumentException("Share a file from your file manager. Only content files are supported.");
    String name="Shared file";long size=-1;
    try(Cursor cursor=c.getContentResolver().query(uri,new String[]{OpenableColumns.DISPLAY_NAME,OpenableColumns.SIZE},null,null,null)){if(cursor!=null&&cursor.moveToFirst()){if(!cursor.isNull(0))name=cursor.getString(0);if(!cursor.isNull(1))size=cursor.getLong(1);}}
    if(name==null||name.trim().isEmpty()||name.length()>240||size>LIMIT)throw new IllegalArgumentException("Choose one file smaller than 25 MB with a short filename.");
    boolean course=name.toLowerCase(java.util.Locale.ROOT).endsWith(".lw");
    if(Intent.ACTION_VIEW.equals(intent.getAction())&&!course)throw new IllegalArgumentException("Open a .lw course file, or use Share for a picture, PDF, audio or text.");
    String type=course?"application/vnd.lw.course+json":type(name,c.getContentResolver().getType(uri));
    byte[] bytes;try(InputStream input=c.getContentResolver().openInputStream(uri)){if(input==null)throw new IllegalArgumentException("This shared file is unavailable.");bytes=bounded(input);}
    if(bytes.length==0)throw new IllegalArgumentException("This shared file is empty.");
    value.put("kind","file").put("name",name).put("type",type).put("bytes",bytes.length);
    if(course)value.put("text",StandardCharsets.UTF_8.newDecoder().onMalformedInput(CodingErrorAction.REPORT).onUnmappableCharacter(CodingErrorAction.REPORT).decode(ByteBuffer.wrap(bytes)).toString());
    else value.put("dataURL","data:"+type+";base64,"+Base64.encodeToString(bytes,Base64.NO_WRAP));
   }
   byte[] packet=value.toString().getBytes(StandardCharsets.UTF_8);if(packet.length>36_000_000)throw new IllegalArgumentException("The shared item is too large for review.");
   synchronized(LOCK){AtomicFile target=file(c);FileOutputStream out=null;try{out=target.startWrite();out.write(packet);target.finishWrite(out);}catch(Exception e){if(out!=null)target.failWrite(out);throw e;}}
  }catch(Exception e){error=e.getMessage()==null?"The shared item could not be opened.":e.getMessage();}finally{synchronized(LOCK){reading=false;}}result.finished(error);});
 }
 private static String type(String name,String reported){String ext=name.toLowerCase(java.util.Locale.ROOT).replaceAll("^.*\\.",""),type=reported==null?"":reported.split(";")[0].toLowerCase(java.util.Locale.ROOT);
  if(type.isEmpty()||"application/octet-stream".equals(type)){switch(ext){case"png":type="image/png";break;case"jpg":case"jpeg":type="image/jpeg";break;case"webp":type="image/webp";break;case"gif":type="image/gif";break;case"pdf":type="application/pdf";break;case"txt":type="text/plain";break;case"md":type="text/markdown";break;case"mp3":type="audio/mpeg";break;case"m4a":type="audio/mp4";break;case"wav":type="audio/wav";break;case"ogg":type="audio/ogg";break;case"aac":type="audio/aac";break;case"webm":type="audio/webm";break;case"flac":type="audio/flac";break;default:break;}}
  if("txt".equals(ext))type="text/plain";if("md".equals(ext))type="text/markdown";if("audio/x-m4a".equals(type))type="audio/mp4";if("audio/vnd.wave".equals(type))type="audio/wav";
  if(!type.matches("image/(png|jpeg|webp|gif)|audio/(mpeg|mp3|wav|x-wav|ogg|mp4|aac|webm|flac)|application/pdf|text/(plain|markdown)"))throw new IllegalArgumentException("Share a .lw course, picture, PDF, text file or audio recording.");return type;
 }
 private static byte[] bounded(InputStream input)throws Exception{ByteArrayOutputStream out=new ByteArrayOutputStream();byte[] buffer=new byte[16384];int n;while((n=input.read(buffer))!=-1){if(out.size()+n>LIMIT)throw new IllegalArgumentException("Choose one file smaller than 25 MB.");out.write(buffer,0,n);}return out.toByteArray();}
 private static JSONObject read(Context c)throws Exception{AtomicFile target=file(c);if(!target.getBaseFile().exists())return null;try(InputStream input=target.openRead()){ByteArrayOutputStream out=new ByteArrayOutputStream();byte[] buf=new byte[16384];int n;while((n=input.read(buf))!=-1){if(out.size()+n>36_000_000)throw new IllegalArgumentException("Shared review is too large.");out.write(buf,0,n);}return new JSONObject(out.toString("UTF-8"));}}
 static String status(Context c){synchronized(LOCK){try{JSONObject value=read(c);boolean own=value!=null&&ProfileFiles.active(c).equals(value.optString("profileId"));return new JSONObject().put("reading",reading).put("ready",own).put("otherProfile",value!=null&&!own).toString();}catch(Exception e){return "{\"error\":true}";}}}
 static String read(Context c,String profile){synchronized(LOCK){try{ProfileFiles.requireActive(c,profile);JSONObject value=read(c);if(value==null||!profile.equals(value.optString("profileId")))throw new IllegalArgumentException("No shared item is waiting in this profile.");return value.toString();}catch(Exception e){try{return new JSONObject().put("nativeError",e.getMessage()).toString();}catch(Exception ignored){return "{}";}}}}
 static void dismiss(Context c,String token,String profile){synchronized(LOCK){try{ProfileFiles.requireActive(c,profile);JSONObject value=read(c);if(value!=null&&profile.equals(value.optString("profileId"))&&value.optString("token").equals(token))file(c).delete();}catch(Exception ignored){}}}
}
