import { GetClassOutput } from '../../class/dto/getClassOutput';
import { GetScheduleOutput } from '../../schedule/dto/getScheduleOutput';

export interface UpdateClassTimelineOutput {
  startDate: Date;
  endDate: Date;
  class: GetClassOutput;
  schedule: GetScheduleOutput;
  id: number;
}
