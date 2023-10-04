import DayOfTheWeek from "./dateOfTheWeek";
import { Shift } from "./shift";

export interface CreateScheduleInput {
  classId: number;
  roomId: number;
  dayOfWeek: DayOfTheWeek
  shift:Shift
  date: Date;
}
