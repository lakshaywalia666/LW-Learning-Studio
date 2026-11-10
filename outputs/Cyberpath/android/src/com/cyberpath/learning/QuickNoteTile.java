package com.cyberpath.learning;
import android.service.quicksettings.*;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Build;
/** A single capture action, only after the user adds and taps the tile. */
public final class QuickNoteTile extends TileService {
 @Override public void onStartListening(){super.onStartListening();Tile tile=getQsTile();if(tile!=null){tile.setLabel("LW quick note");tile.setState(Tile.STATE_INACTIVE);tile.updateTile();}}
 @Override public void onClick(){super.onClick();Runnable open=()->{Intent intent=new Intent(this,MainActivity.class).putExtra("lwRoute","notebook").putExtra("lwQuickNote",true).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP|Intent.FLAG_ACTIVITY_SINGLE_TOP);if(Build.VERSION.SDK_INT>=34)startActivityAndCollapse(PendingIntent.getActivity(this,356,intent,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE));else startActivityAndCollapse(intent);};if(isLocked())unlockAndRun(open);else open.run();}
}
