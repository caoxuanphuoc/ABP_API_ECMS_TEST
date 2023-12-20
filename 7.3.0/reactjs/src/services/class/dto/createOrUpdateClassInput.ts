import { GetCourseOutput } from '../../course/dto/getCourseOutput';

export interface CreateOrUpdateClassInput {
  code: string;
  course: GetCourseOutput;
  limitStudent: number;
  currentStudent: number;
  lessionTimes: number;
  isActive: boolean;
  id: number
}
