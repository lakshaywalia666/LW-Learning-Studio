package com.cyberpath.learning;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Intent;
import android.graphics.Color;
import android.hardware.biometrics.BiometricManager;
import android.hardware.biometrics.BiometricPrompt;
import android.os.Build;
import android.os.CancellationSignal;
import android.os.SystemClock;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import org.json.JSONObject;

/** An opaque native gate over the app. Uses OS biometrics/PIN, not a home-grown password. */
final class AppLock {
 static final int CREDENTIAL_REQUEST=120;
 private final Activity activity;
 private final WebView web;
 private final LinearLayout gate;
 private final TextView message;
 private final Button unlock,settings;
 private final Runnable changed;
 private AppLockState state;
 private CancellationSignal cancellation;
 private Runnable firstLoad;
 private long credentialToken;
 private boolean destroyed;
 private String notice="";
 public static boolean enabled(android.content.Context c){android.content.SharedPreferences global=c.getSharedPreferences("lw-app-lock",android.content.Context.MODE_PRIVATE);if(global.contains("enabled"))return global.getBoolean("enabled",false);boolean old=c.getSharedPreferences(NativeServices.PREFS,android.content.Context.MODE_PRIVATE).getBoolean("appLockEnabled",false)||NativeServices.prefs(c).getBoolean("appLockEnabled",false);try{org.json.JSONArray profiles=new org.json.JSONObject(ProfileFiles.registry(c)).getJSONArray("profiles");for(int i=0;i<profiles.length();i++){String id=profiles.getJSONObject(i).getString("id");if(ProfileFiles.valid(id)&&!"default".equals(id))old|=c.getSharedPreferences(NativeServices.PREFS+"--"+id,android.content.Context.MODE_PRIVATE).getBoolean("appLockEnabled",false);}}catch(Exception ignored){}if(old)global.edit().putBoolean("enabled",true).commit();return old;}
 AppLock(Activity activity,WebView web,Runnable changed){
  this.activity=activity;this.web=web;this.changed=changed;
  state=new AppLockState(enabled(activity)); if(state.enabled())activity.getSharedPreferences("lw-app-lock",android.content.Context.MODE_PRIVATE).edit().putBoolean("enabled",true).commit();
  gate=new LinearLayout(activity);gate.setOrientation(LinearLayout.VERTICAL);gate.setGravity(Gravity.CENTER);int pad=Math.round(28*activity.getResources().getDisplayMetrics().density);gate.setPadding(pad,pad,pad,pad);gate.setBackgroundColor(Color.rgb(243,244,248));gate.setClickable(true);gate.setFocusable(true);gate.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_YES);
  TextView title=new TextView(activity);title.setText("Your studio is locked");title.setTextSize(25);title.setTextColor(Color.rgb(28,33,48));title.setGravity(Gravity.CENTER);gate.addView(title);
  message=new TextView(activity);message.setTextSize(16);message.setTextColor(Color.rgb(64,70,88));message.setGravity(Gravity.CENTER);message.setPadding(0,pad,0,pad);gate.addView(message);
  unlock=new Button(activity);unlock.setText("Unlock LW");unlock.setMinHeight(Math.round(48*activity.getResources().getDisplayMetrics().density));unlock.setOnClickListener(view->authenticate("unlock"));gate.addView(unlock);
  settings=new Button(activity);settings.setText("Phone security settings");settings.setOnClickListener(view->{try{activity.startActivity(new Intent(android.provider.Settings.ACTION_SECURITY_SETTINGS));}catch(Exception ignored){message.setText("Open your phone settings and set up a screen lock.");}});gate.addView(settings);
  activity.addContentView(gate,new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.MATCH_PARENT));paint();
 }
 private boolean secure(){KeyguardManager manager=activity.getSystemService(KeyguardManager.class);return manager!=null&&manager.isDeviceSecure();}
 void loadWhenUnlocked(Runnable load){firstLoad=load;paint();}
 private void paint(){
  if(destroyed)return;boolean locked=!state.unlocked();
  if(state.enabled())activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);else activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
  gate.setVisibility(locked?View.VISIBLE:View.GONE);web.setVisibility(locked?View.INVISIBLE:View.VISIBLE);web.setImportantForAccessibility(locked?View.IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS:View.IMPORTANT_FOR_ACCESSIBILITY_AUTO);
  unlock.setEnabled(!state.busy()&&secure());settings.setVisibility(secure()?View.GONE:View.VISIBLE);
  message.setText(secure()?"Use your phone’s fingerprint, face or screen lock to continue.":"Set up a screen lock in your phone settings, then return to unlock LW.");
  if(locked){web.onPause();gate.bringToFront();}else{web.onResume();if(firstLoad!=null){Runnable load=firstLoad;firstLoad=null;load.run();}}
 }
 String status(){try{return new JSONObject().put("enabled",state.enabled()).put("secure",secure()).put("busy",state.busy()).put("notice",notice).toString();}catch(Exception e){return "{}";}}
 void configure(boolean enabled){if(enabled==state.enabled()||destroyed)return;authenticate(enabled?"enable":"disable");}
 void lockNow(){if(state.enabled()){state.background();paint();}}
 void background(){state.background();paint();}
 void resume(){paint();}
 boolean locked(){return !state.unlocked();}
 private void authenticate(String action){
  if(destroyed)return;if(!secure()){notice="Set a phone screen lock before enabling app lock.";message.setText(notice);changed.run();return;}
  final long token;try{token=state.begin(action,SystemClock.elapsedRealtime());}catch(Exception ignored){return;}notice="";paint();
  try{
   if(Build.VERSION.SDK_INT>=30){
    cancellation=new CancellationSignal();BiometricPrompt prompt=new BiometricPrompt.Builder(activity).setTitle("LW Learning Studio").setSubtitle("enable".equals(action)?"Confirm to enable app lock":"disable".equals(action)?"Confirm to turn off app lock":"Unlock your studio").setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG|BiometricManager.Authenticators.DEVICE_CREDENTIAL).build();
    prompt.authenticate(cancellation,activity.getMainExecutor(),new BiometricPrompt.AuthenticationCallback(){@Override public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult result){finish(token,true);}@Override public void onAuthenticationError(int code,CharSequence error){finish(token,false);if(!destroyed&&locked())message.setText("Unlock was cancelled or unavailable. Tap Unlock LW to try again.");}});
   }else{
    KeyguardManager manager=activity.getSystemService(KeyguardManager.class);Intent intent=manager==null?null:manager.createConfirmDeviceCredentialIntent("LW Learning Studio","Confirm your phone’s screen lock");if(intent==null)throw new IllegalStateException("Screen lock unavailable");credentialToken=token;activity.startActivityForResult(intent,CREDENTIAL_REQUEST);
   }
  }catch(Exception error){finish(token,false);if(locked())message.setText("The system unlock could not open. Try your phone’s screen lock again.");}
 }
 private void finish(long token,boolean authenticated){if(destroyed||!state.current(token))return;boolean previous=state.enabled(),accepted=state.finish(token,authenticated,SystemClock.elapsedRealtime());if(accepted&&previous!=state.enabled()&&!activity.getSharedPreferences("lw-app-lock",android.content.Context.MODE_PRIVATE).edit().putBoolean("enabled",state.enabled()).commit()){state=new AppLockState(previous);notice="App lock preferences could not be saved. Try again.";paint();message.setText(notice);changed.run();return;}if(accepted){NativeServices.prefs(activity).edit().remove("appLockEnabled").apply();PersonalReminderWidget.updateAll(activity);LearningWidget.updateAll(activity);}notice=accepted?"":"Phone unlock was cancelled or timed out. The app lock preference is unchanged.";cancellation=null;paint();changed.run();}
 boolean result(int request,int result){if(request!=CREDENTIAL_REQUEST)return false;long token=credentialToken;credentialToken=0;finish(token,result==Activity.RESULT_OK);return true;}
 void close(){destroyed=true;state.cancel();if(cancellation!=null)cancellation.cancel();cancellation=null;firstLoad=null;}
}
