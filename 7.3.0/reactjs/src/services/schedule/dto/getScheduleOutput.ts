import { GetRoomOutput } from '../../room/dto/getRoomOutput';
import { DayOfTheWeek } from './dateOfTheWeek';
import { Shift } from './shift';

export interface GetScheduleOutput {
  room: GetRoomOutput;
  dayOfWeek: DayOfTheWeek;
  shift: Shift;
  date: Date;
  id: number;
}
