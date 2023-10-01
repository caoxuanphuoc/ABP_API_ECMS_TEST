import { GetCourseOutput } from '../../course/dto/getCourseOutput';

export interface GetClassOutput {
  code: string;
  course: GetCourseOutput;
  startDate: Date;
  endDate: Date;
  limitStudent: number;
  currentStudent: number;
  lessionTimes: number;
  isActive: boolean;
  id: number;
}
