import { GetCourseOutput } from '../../course/dto/getCourseOutput';
import { GetRoomOutput } from '../../room/dto/getRoomOutput';
import { WorkShiftDto } from '../../schedule/dto/workShiftDto';

export interface GetAllClassOuput {
  code: string;
  course: GetCourseOutput;
  room: GetRoomOutput;
  startDate: Date;
  endDate: Date;
  limitStudent: number;
  currentStudent: number;
  lessionTimes: number;
  isActive: boolean;
  lsWorkSheet: WorkShiftDto[];
  id: number;
}
