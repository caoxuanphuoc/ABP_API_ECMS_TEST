import { GetClassOutput } from '../../class/dto/getClassOutput';
import { GetRoomOutput } from '../../room/dto/getRoomOutput';
import DayOfTheWeek from './dateOfTheWeek';
import { Shift } from './shift';

export interface CreateScheduleOutputItem {
  class: GetClassOutput;
  room: GetRoomOutput;
  dayOfWeek: DayOfTheWeek;
  shift: Shift;
  date: Date;
  id: number;
}

export interface CreateScheduleOuput {
  result: CreateScheduleOutputItem;
}
