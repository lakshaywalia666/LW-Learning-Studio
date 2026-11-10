package com.cyberpath.learning;
import android.app.Instrumentation;
import android.os.*;
import android.webkit.WebView;
import org.json.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicReference;

/** Runs the production JS audio facade against the real Android bridge. */
public final class NativeFacadeSmoke {
 public static void run(Instrumentation test,MainActivity activity,Bundle report,String dataURL)throws Exception{
  java.lang.reflect.Field field=MainActivity.class.getDeclaredField("web");field.setAccessible(true);WebView web=(WebView)field.get(activity);
  String js="window.__lwFacadeProbe={done:false,step:'starting'};(async()=>{let p;try{const {NativeAudio}=await import(new URL('./native-audio.js',location.href).href);p=new NativeAudio();const wait=async(fn,label)=>{const until=Date.now()+10000;window.__lwFacadeProbe.step=label;while(!fn()){if(Date.now()>until)throw new Error(label+': '+JSON.stringify(p.status()));await new Promise(r=>setTimeout(r,50));}};p.load("+JSONObject.quote(dataURL)+",{title:'JS bridge fixture',loop:{enabled:false,start:0,end:4}});await p.play();await wait(()=>p.status().playing,'startup');p.pause();await wait(()=>!p.status().playing,'pause');p.seek(1.25);await wait(()=>Math.abs(p.status().seconds-1.25)<.2&&!p.status().playing,'paused seek');p.reset();await p.play();await wait(()=>p.status().playing,'replay after Stop');p.stop();await wait(()=>!JSON.parse(AndroidApp.localAudioStatus(AndroidApp.getActiveProfile())).playing,'native Stop');window.__lwFacadeProbe={done:true,ok:true};}catch(e){window.__lwFacadeProbe={done:true,ok:false,error:String(e.message||e)};}finally{p?.dispose();}})();";
  test.runOnMainSync(()->web.evaluateJavascript(js,null));JSONObject result=null;long until=SystemClock.elapsedRealtime()+45000;
  while(SystemClock.elapsedRealtime()<until){CountDownLatch latch=new CountDownLatch(1);AtomicReference<String> value=new AtomicReference<>();test.runOnMainSync(()->web.evaluateJavascript("JSON.stringify(window.__lwFacadeProbe||null)",text->{value.set(text);latch.countDown();}));if(latch.await(2,TimeUnit.SECONDS)&&value.get()!=null){Object decoded=new JSONTokener(value.get()).nextValue();if(decoded instanceof String){JSONObject row=new JSONObject((String)decoded);if(row.optBoolean("done")){result=row;break;}}}SystemClock.sleep(50);}
  if(result==null||!result.optBoolean("ok"))throw new AssertionError("Production JS/native player check failed: "+result);
  report.putBoolean("production_js_native_audio_start_pause_seek_stop_replay",true);
 }
}
