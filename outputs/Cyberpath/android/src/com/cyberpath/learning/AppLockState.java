package com.cyberpath.learning;

/** Device-local session policy. Authentication material never enters the workspace or WebView. */
final class AppLockState {
 private boolean enabled,unlocked;
 private long generation,expires;
 private String purpose="";
 AppLockState(boolean enabled){this.enabled=enabled;unlocked=!enabled;}
 synchronized boolean enabled(){return enabled;}
 synchronized boolean unlocked(){return !enabled||unlocked;}
 synchronized boolean busy(){return !purpose.isEmpty();}
 synchronized boolean current(long token){return token==generation&&busy();}
 synchronized long begin(String action,long now){
  if(busy())throw new IllegalStateException("Finish the current unlock request first.");
  if(!("enable".equals(action)&&!enabled||"disable".equals(action)&&enabled||"unlock".equals(action)&&enabled))throw new IllegalArgumentException("Choose an available app lock action.");
  purpose=action;expires=now+120000;return ++generation;
 }
 synchronized boolean finish(long token,boolean authenticated,long now){
  if(token!=generation||!busy())return false;
  String action=purpose;purpose="";generation++;
  if(!authenticated||now>expires||now<expires-120000)return false;
  if("enable".equals(action))enabled=true;else if("disable".equals(action))enabled=false;
  unlocked=true;return true;
 }
 synchronized void background(){if(enabled)unlocked=false;}
 synchronized void cancel(){generation++;purpose="";}
}
