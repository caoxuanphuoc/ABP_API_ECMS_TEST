import { WorkShiftDto } from '../../schedule/dto/workShiftDto';

export interface CreateClassInput {
  code: string;
  courseId: number;
  roomId: number;
  limitStudent: number;
  currentStudent: number;
  lessionTimes: number;
  isActive: boolean;
  lsWorkSheet: WorkShiftDto[];
}
