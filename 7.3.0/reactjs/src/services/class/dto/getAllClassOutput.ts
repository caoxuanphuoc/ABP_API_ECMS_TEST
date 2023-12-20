import { GetCourseOutput } from '../../course/dto/getCourseOutput';

export interface GetAllClassOuput {
  code: string;
  course: GetCourseOutput;
  limitStudent: number;
  currentStudent: number;
  lessionTimes: number;
  isActive: boolean;
  id: number;
}
