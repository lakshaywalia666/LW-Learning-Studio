package com.cyberpath.learning;
import android.content.Context;
public final class UiText {public static String of(Context c,String english,String hindi){return "hi".equals(NativeServices.prefs(c).getString("interfaceLanguage","en"))?hindi:english;}}
