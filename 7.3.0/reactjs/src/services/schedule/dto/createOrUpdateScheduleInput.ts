import { GetRoomOutput } from '../../room/dto/getRoomOutput';
import { DayOfTheWeek } from './dateOfTheWeek';
import { Shift } from './shift';

export interface CreateOrUpdateScheduleInput {
  room: GetRoomOutput;
  date: Date;
  dayOfWeek: DayOfTheWeek;
  shift: Shift;
  id: number;
}
