export interface CreateClassInput {
  code: string;
  courseId: number;
  startDate: Date;
  endDate: Date;
  limitStudent: number;
  currentStudent: number;
  lessionTimes: number;
  isActive: boolean;
}
