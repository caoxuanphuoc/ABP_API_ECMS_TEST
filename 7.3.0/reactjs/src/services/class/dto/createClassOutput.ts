import { GetCourseOutput } from '../../course/dto/getCourseOutput';
export interface CreateClassOutputItem {
  code: string;
  course: GetCourseOutput;
  limitStudent: number;
  currentStudent: number;
  lessionTimes: number;
  isActive: boolean;
  id: number;
}

export interface CreateClassOuput {
  result: CreateClassOutputItem;
}
