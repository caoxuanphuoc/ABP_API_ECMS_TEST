import { DayOfTheWeek } from './dateOfTheWeek';
import { Shift } from './shift';

export interface UpdateScheduleInput {
  roomId: number;
  dayOfWeek: DayOfTheWeek;
  shift: Shift;
  date: Date;
  id: number;
}
