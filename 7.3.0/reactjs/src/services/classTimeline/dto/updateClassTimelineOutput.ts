import { GetClassOutput } from '../../class/dto/getClassOutput';
import { GetRoomOutput } from '../../room/dto/getRoomOutput';
import { GetScheduleOutput } from '../../schedule/dto/getScheduleOutput';
import { WorkShiftDto } from '../../schedule/dto/workShiftDto';

export interface UpdateClassTimelineOutput {
  class: GetClassOutput;
  schedule: GetScheduleOutput;
  room: GetRoomOutput;
  startDate: Date;
  endDate: Date;
  ListWorkShifts: WorkShiftDto[];
  id: number;
}
