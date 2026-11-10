package com.cyberpath.learning;
import android.content.*;
import android.database.*;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import java.io.*;
import java.util.UUID;
/** Grants a camera app access to one temporary JPEG, never to workspace files. */
public final class PageCaptureProvider extends ContentProvider {
 public static Uri create(Context c)throws IOException{File folder=new File(c.getCacheDir(),"lw-page-capture");if(!folder.exists()&&!folder.mkdirs())throw new IOException("The camera folder could not be prepared.");String name="page-"+UUID.randomUUID()+".jpg";if(!new File(folder,name).createNewFile())throw new IOException("The photo could not be prepared.");return new Uri.Builder().scheme("content").authority(c.getPackageName()+".capture").appendPath(name).build();}
 private static File file(Context c,Uri uri)throws FileNotFoundException{if(uri==null||!"content".equals(uri.getScheme())||!(c.getPackageName()+".capture").equals(uri.getAuthority())||uri.getQuery()!=null||uri.getFragment()!=null||uri.getPath()==null||!uri.getPath().matches("/page-[a-f0-9-]{36}\\.jpg"))throw new FileNotFoundException("Invalid photo");return new File(new File(c.getCacheDir(),"lw-page-capture"),uri.getLastPathSegment());}
 public static boolean ready(Context c,Uri uri){try{File f=file(c,uri);return f.isFile()&&f.length()>0&&f.length()<=25000000;}catch(Exception ignored){return false;}}
 @Override public boolean onCreate(){return true;}
 @Override public String getType(Uri uri){return "image/jpeg";}
 @Override public ParcelFileDescriptor openFile(Uri uri,String mode)throws FileNotFoundException{File f=file(getContext(),uri);int flags;if("r".equals(mode))flags=ParcelFileDescriptor.MODE_READ_ONLY;else if("w".equals(mode)||"wt".equals(mode))flags=ParcelFileDescriptor.MODE_WRITE_ONLY|ParcelFileDescriptor.MODE_TRUNCATE|ParcelFileDescriptor.MODE_CREATE;else if("rw".equals(mode)||"rwt".equals(mode))flags=ParcelFileDescriptor.MODE_READ_WRITE|ParcelFileDescriptor.MODE_CREATE|("rwt".equals(mode)?ParcelFileDescriptor.MODE_TRUNCATE:0);else throw new FileNotFoundException("Unsupported photo access");return ParcelFileDescriptor.open(f,flags);}
 @Override public Cursor query(Uri uri,String[] projection,String selection,String[] args,String order){try{File f=file(getContext(),uri);String[] columns=projection==null?new String[]{OpenableColumns.DISPLAY_NAME,OpenableColumns.SIZE}:projection;MatrixCursor cursor=new MatrixCursor(columns);Object[] row=new Object[columns.length];for(int i=0;i<columns.length;i++)row[i]=OpenableColumns.DISPLAY_NAME.equals(columns[i])?f.getName():OpenableColumns.SIZE.equals(columns[i])?f.length():null;cursor.addRow(row);return cursor;}catch(Exception ignored){return null;}}
 @Override public Uri insert(Uri uri,ContentValues values){throw new UnsupportedOperationException();}
 @Override public int update(Uri uri,ContentValues values,String selection,String[] args){throw new UnsupportedOperationException();}
 @Override public int delete(Uri uri,String selection,String[] args){throw new UnsupportedOperationException();}
}
