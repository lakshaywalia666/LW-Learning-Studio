package com.cyberpath.learning;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.Handler;
import android.os.Looper;
import org.json.JSONObject;
import java.util.function.Consumer;

/** One foreground, approximate location request. No service or background permission. */
final class ForestLocation {
 static final int PERMISSION=107;
 private final Activity activity;
 private final Consumer<String> result;
 private final Handler handler=new Handler(Looper.getMainLooper());
 private LocationManager manager;
 private CancellationSignal cancellation;
 private LocationListener listener;
 private boolean pending,waitingPermission,waitingResume,foreground=true;
 private final Runnable timeout=()->finishError("Location took too long. Choose a city or try again.");
 ForestLocation(Activity activity,Consumer<String> result){this.activity=activity;this.result=result;}
 boolean granted(){return activity.checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION)==PackageManager.PERMISSION_GRANTED;}
 void request(){
  if(pending||waitingPermission)return;
  if(!granted()){waitingPermission=true;activity.requestPermissions(new String[]{Manifest.permission.ACCESS_COARSE_LOCATION},PERMISSION);return;}
  locate();
 }
 void permissionResult(){if(!waitingPermission)return;waitingPermission=false;if(granted()){if(foreground)locate();else waitingResume=true;}else finishError("Location permission was not granted. You can choose a city instead.");}
 private void locate(){
  pending=true;
  try{
   manager=(LocationManager)activity.getSystemService(Activity.LOCATION_SERVICE);
   String provider=null;
   for(String candidate:new String[]{"fused",LocationManager.NETWORK_PROVIDER})if(manager.getAllProviders().contains(candidate)&&manager.isProviderEnabled(candidate)){provider=candidate;break;}
   if(provider==null){finishError("Enable the phone’s location service, or choose a city.");return;}
   Location cached=manager.getLastKnownLocation(provider);
   if(cached!=null&&Math.abs(System.currentTimeMillis()-cached.getTime())<600_000){finish(cached);return;}
   handler.postDelayed(timeout,20_000);
   if(Build.VERSION.SDK_INT>=30){cancellation=new CancellationSignal();manager.getCurrentLocation(provider,cancellation,activity.getMainExecutor(),location->{if(!pending)return;if(location==null)finishError("The phone could not find an approximate location. Choose a city instead.");else finish(location);});}
   else{listener=new LocationListener(){public void onLocationChanged(Location location){if(pending)finish(location);}public void onStatusChanged(String provider,int status,Bundle extras){}public void onProviderEnabled(String provider){}public void onProviderDisabled(String provider){if(pending)finishError("Location is disabled. Choose a city instead.");}};manager.requestLocationUpdates(provider,0,0,listener,Looper.getMainLooper());}
  }catch(Exception error){finishError("Approximate location is unavailable. Choose a city instead.");}
 }
 private void finish(Location location){try{JSONObject value=new JSONObject().put("latitude",Math.rint(location.getLatitude()*100)/100).put("longitude",Math.rint(location.getLongitude()*100)/100);clear();result.accept(value.toString());}catch(Exception error){finishError("The location could not be read.");}}
 private void finishError(String message){clear();try{result.accept(new JSONObject().put("error",message).toString());}catch(Exception ignored){}}
 private void clear(){pending=false;handler.removeCallbacks(timeout);if(cancellation!=null){cancellation.cancel();cancellation=null;}if(listener!=null&&manager!=null){try{manager.removeUpdates(listener);}catch(Exception ignored){}listener=null;}}
 void resume(){foreground=true;if(waitingResume){waitingResume=false;locate();}}
 void background(){foreground=false;if(pending)finishError("Location paused when the app left the foreground. Try again when you return.");}
 void destroy(){waitingPermission=false;waitingResume=false;clear();}
}
