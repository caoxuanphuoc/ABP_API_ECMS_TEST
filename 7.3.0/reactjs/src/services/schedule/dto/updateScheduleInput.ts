import DayOfTheWeek from './dateOfTheWeek';
import { Shift } from './shift';

export interface UpdateScheduleInput {
  classId: number;
  roomId: number;
  dayOfWeek: DayOfTheWeek;
  shift: Shift;
  date: Date;
  id: number;
}
