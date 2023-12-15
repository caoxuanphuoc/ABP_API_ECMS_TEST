import { DayOfTheWeek } from "./dateOfTheWeek";
import { Shift } from "./shift";

export interface CreateScheduleInput {
  roomId: number;
  dayOfWeek: DayOfTheWeek
  shift:Shift
  date: Date;
}
