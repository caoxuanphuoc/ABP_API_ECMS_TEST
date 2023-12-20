import { WorkShiftDto } from '../../schedule/dto/workShiftDto';

export interface CreateClassTimelineInput {
  classId: number;
  scheduleId: number;
  roomId: number;
  startDate: Date;
  endDate: Date;
  ListWorkShifts: WorkShiftDto[];
}
