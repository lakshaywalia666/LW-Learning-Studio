package com.cyberpath.learning;
import android.app.job.*;
public final class BackupJob extends JobService {
 @Override public boolean onStartJob(JobParameters params){NativeServices.IO.execute(()->{NativeServices.maybeBackup(this,false);LearningWidget.updateAll(this);jobFinished(params,false);});return true;}
 @Override public boolean onStopJob(JobParameters params){return true;}
}
