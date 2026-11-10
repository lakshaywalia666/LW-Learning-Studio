package com.cyberpath.learning;
import android.content.*;
import android.database.*;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import org.json.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

/** Temporary read-only course exports. No workspace or private library paths are exposed. */
public final class CourseShareProvider extends ContentProvider {
 static Uri prepare(Context c,String raw,String filename)throws Exception{if(raw==null||raw.length()>100000000||filename==null||!filename.matches("[A-Za-z0-9._-]{1,120}\\.lw"))throw new IOException("Choose a portable .lw course within 100 MB.");JSONObject p=new JSONObject(raw);JSONObject course="lw-signed-course".equals(p.optString("format"))?p.optJSONObject("course"):p;if(course==null||!"lw-learning-studio".equals(course.optString("format"))||!"course".equals(course.optString("kind"))||course.optInt("version")!=2||!course.has("data"))throw new IOException("Only a course export can be shared.");if(p.has("workspace")||p.has("localFiles")||p.has("activityHistory"))throw new IOException("Private workspace data cannot be shared as a course.");File folder=new File(c.getCacheDir(),"course-shares");if(!folder.exists()&&!folder.mkdirs())throw new IOException("Course sharing could not be prepared.");File[] old=folder.listFiles();if(old!=null)for(File f:old)if(f.lastModified()<System.currentTimeMillis()-86400000L)f.delete();String token=UUID.randomUUID().toString();try(FileOutputStream out=new FileOutputStream(new File(folder,token+".lw"))){out.write(raw.getBytes(StandardCharsets.UTF_8));}try(FileOutputStream out=new FileOutputStream(new File(folder,token+".name"))){out.write(filename.getBytes(StandardCharsets.UTF_8));}return Uri.parse("content://"+c.getPackageName()+".course-share/"+token);}
 private File file(Uri uri)throws FileNotFoundException{String token=uri.getLastPathSegment();if(token==null||!token.matches("[a-f0-9-]{36}")||uri.getPathSegments().size()!=1)throw new FileNotFoundException("Invalid course link");File f=new File(new File(getContext().getCacheDir(),"course-shares"),token+".lw");if(!f.isFile()||f.lastModified()<System.currentTimeMillis()-86400000L)throw new FileNotFoundException("This shared copy expired. Share the course again.");return f;}
 @Override public boolean onCreate(){return true;}
 @Override public String getType(Uri uri){return "application/octet-stream";}
 @Override public ParcelFileDescriptor openFile(Uri uri,String mode)throws FileNotFoundException{if(!"r".equals(mode))throw new FileNotFoundException("Read-only shared course");return ParcelFileDescriptor.open(file(uri),ParcelFileDescriptor.MODE_READ_ONLY);}
 @Override public Cursor query(Uri uri,String[] projection,String selection,String[] args,String order){try{File f=file(uri);String[] columns=projection==null?new String[]{OpenableColumns.DISPLAY_NAME,OpenableColumns.SIZE}:projection;MatrixCursor cursor=new MatrixCursor(columns);Object[] row=new Object[columns.length];String name="Course.lw";try(InputStream in=new FileInputStream(new File(f.getParentFile(),uri.getLastPathSegment()+".name"))){name=new String(AppFiles.readBounded(in,256),StandardCharsets.UTF_8);}for(int i=0;i<columns.length;i++)if(OpenableColumns.DISPLAY_NAME.equals(columns[i]))row[i]=name;else if(OpenableColumns.SIZE.equals(columns[i]))row[i]=f.length();cursor.addRow(row);return cursor;}catch(Exception e){return null;}}
 @Override public Uri insert(Uri u,ContentValues v){throw new UnsupportedOperationException();}
 @Override public int update(Uri u,ContentValues v,String s,String[] a){throw new UnsupportedOperationException();}
 @Override public int delete(Uri u,String s,String[] a){throw new UnsupportedOperationException();}
}
