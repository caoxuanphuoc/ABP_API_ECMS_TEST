import { DayOfTheWeek } from "./dateOfTheWeek"
import { Shift } from "./shift"

export interface WorkShiftDto {
    startDate: Date;
    endDate: Date;
    dateOfWeek: DayOfTheWeek
    shiftTime: Shift
}