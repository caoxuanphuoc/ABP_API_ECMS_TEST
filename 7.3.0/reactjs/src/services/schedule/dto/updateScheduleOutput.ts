import { GetRoomOutput } from '../../room/dto/getRoomOutput';
import { DayOfTheWeek } from './dateOfTheWeek';
import { Shift } from './shift';

export interface UpdateScheduleOutput {
  room: GetRoomOutput;
  dayOfWeek: DayOfTheWeek;
  shift: Shift;
  date: Date;
  id: number;
}
