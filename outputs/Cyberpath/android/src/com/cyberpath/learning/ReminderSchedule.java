package com.cyberpath.learning;
import java.time.*;
import java.util.Set;
public final class ReminderSchedule {
 public static ZonedDateTime next(String time,Set<Integer> days,ZonedDateTime now){
  LocalTime clock=LocalTime.parse(time);for(int i=0;i<8;i++){LocalDate date=now.toLocalDate().plusDays(i);ZonedDateTime candidate=date.atTime(clock).atZone(now.getZone());if(days.contains(date.getDayOfWeek().getValue())&&candidate.isAfter(now))return candidate;}throw new IllegalArgumentException("Choose at least one reminder day");
 }
}
