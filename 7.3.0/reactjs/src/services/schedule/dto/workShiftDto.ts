import DayOfTheWeek from "./dateOfTheWeek"
import { Shift } from "./shift"

export interface WorkShiftDto {
    dayOfWeek: DayOfTheWeek
    shift: Shift
}