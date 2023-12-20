import { WorkShiftDto } from "../../schedule/dto/workShiftDto";

export interface UpdateClassTimelineInput {
  classId: number;
  schedule: number;
  roomId: number;
  startDate: Date;
  endDate: Date;
  ListWorkShifts: WorkShiftDto[];
  id: number;
}
