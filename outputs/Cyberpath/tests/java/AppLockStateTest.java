package com.cyberpath.learning;
public final class AppLockStateTest {
 private static void check(boolean value){if(!value)throw new AssertionError();}
 public static void main(String[] args){
  AppLockState off=new AppLockState(false);check(off.unlocked());long enable=off.begin("enable",100);check(!off.finish(enable,false,110));check(!off.enabled());
  enable=off.begin("enable",200);check(off.finish(enable,true,210));check(off.enabled()&&off.unlocked());check(!off.finish(enable,true,220));off.background();check(!off.unlocked());
  long unlock=off.begin("unlock",300);off.background();check(off.finish(unlock,true,310));check(off.unlocked());
  long disable=off.begin("disable",400);off.background();check(!off.finish(disable,false,410));check(off.enabled()&&!off.unlocked());
  unlock=off.begin("unlock",500);off.cancel();check(!off.finish(unlock,true,510));check(!off.unlocked());
  unlock=off.begin("unlock",600);check(!off.finish(unlock,true,120601));check(!off.unlocked());
  unlock=off.begin("unlock",700);check(!off.finish(unlock,true,699));check(!off.unlocked());
  disable=off.begin("disable",800);check(off.finish(disable,true,810));off.background();check(!off.enabled()&&off.unlocked());
  AppLockState fresh=new AppLockState(true);check(!fresh.unlocked());long first=fresh.begin("unlock",900);try{fresh.begin("disable",901);throw new AssertionError();}catch(IllegalStateException expected){}check(fresh.finish(first,true,910));
  System.out.println("App lock state: enable/cancel/background/unlock/disable/expiry/stale callbacks pass.");
 }
}
