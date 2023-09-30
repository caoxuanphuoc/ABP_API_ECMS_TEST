import { GetClassOutput } from '../../class/dto/getClassOutput';
import { GetWorkShiftOutput } from '../../workShift/dto/getWorkShiftOutput';

export interface CreateScheduleOutputItem {
  class: GetClassOutput;
  workShift: GetWorkShiftOutput;
  date: Date;
  id: number;
}

export interface CreateScheduleOuput {
  result: CreateScheduleOutputItem;
}
