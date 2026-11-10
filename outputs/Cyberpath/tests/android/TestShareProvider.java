package com.cyberpath.learning;
import android.content.*;
import android.database.*;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import java.io.*;
import java.nio.charset.StandardCharsets;
/** Test-APK-only document provider with an opaque URI and a dotted uppercase .LW filename. */
public final class TestShareProvider extends ContentProvider {
 public static final String TEXT="{\"format\":\"native-intake-fixture\",\"title\":\"A reviewed course\"}";
 @Override public boolean onCreate(){return true;}
 @Override public String getType(Uri uri){return "application/octet-stream";}
 @Override public Cursor query(Uri uri,String[] projection,String selection,String[] args,String order){String[] columns=projection==null?new String[]{OpenableColumns.DISPLAY_NAME,OpenableColumns.SIZE}:projection;MatrixCursor cursor=new MatrixCursor(columns);Object[] values=new Object[columns.length];for(int i=0;i<columns.length;i++)values[i]=OpenableColumns.DISPLAY_NAME.equals(columns[i])?("/bad".equals(uri.getPath())?"photo.png":"sample.course.v1.LW"):OpenableColumns.SIZE.equals(columns[i])?TEXT.getBytes(StandardCharsets.UTF_8).length:null;cursor.addRow(values);return cursor;}
 @Override public ParcelFileDescriptor openFile(Uri uri,String mode)throws FileNotFoundException{if(!"r".equals(mode)||!"/42".equals(uri.getPath()))throw new FileNotFoundException();try{File file=new File(getContext().getCacheDir(),"native-intake-fixture.lw");try(FileOutputStream out=new FileOutputStream(file)){out.write(TEXT.getBytes(StandardCharsets.UTF_8));}return ParcelFileDescriptor.open(file,ParcelFileDescriptor.MODE_READ_ONLY);}catch(IOException error){throw new FileNotFoundException(error.getMessage());}}
 @Override public Uri insert(Uri uri,ContentValues values){throw new UnsupportedOperationException();}
 @Override public int update(Uri uri,ContentValues values,String selection,String[] args){throw new UnsupportedOperationException();}
 @Override public int delete(Uri uri,String selection,String[] args){throw new UnsupportedOperationException();}
}
