import { GetClassOutput } from '../../class/dto/getClassOutput';
import { GetWorkShiftOutput } from '../../workShift/dto/getWorkShiftOutput';

export interface GetScheduleOutput {
  class: GetClassOutput;
  workShift: GetWorkShiftOutput;
  date: Date;
  id: number;
}
