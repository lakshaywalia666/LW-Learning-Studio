import java.io.*;
import java.util.*;
import java.util.zip.*;
/** Normalize Windows asset entry names before alignment/signing; preserve stored resources. */
public final class ZipNormalize {
 public static void main(String[] args)throws Exception {
  Set<String> names=new HashSet<>();
  try(ZipInputStream input=new ZipInputStream(new BufferedInputStream(new FileInputStream(args[0])));ZipOutputStream output=new ZipOutputStream(new BufferedOutputStream(new FileOutputStream(args[1])))){
   ZipEntry entry;byte[] buffer=new byte[32768];
   while((entry=input.getNextEntry())!=null){String name=entry.getName().replace('\\','/');if(name.startsWith("/")||Arrays.asList(name.split("/")).contains("..")||!names.add(name))throw new IOException("Unsafe or duplicate ZIP entry: "+name);ZipEntry next=new ZipEntry(name);if(entry.getTime()>=0)next.setTime(entry.getTime());next.setMethod(entry.getMethod());if(entry.getMethod()==ZipEntry.STORED){next.setSize(entry.getSize());next.setCrc(entry.getCrc());}output.putNextEntry(next);int n;while((n=input.read(buffer))!=-1)output.write(buffer,0,n);output.closeEntry();input.closeEntry();}
  }
 }
}
