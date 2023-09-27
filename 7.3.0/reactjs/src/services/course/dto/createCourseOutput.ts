export interface CreateCourseOutputItem {
  courseName: string;
  courseFee: number;
  quantity: number;
  id: number;
}

export interface CreateCourseOutput {
  result: CreateCourseOutputItem;
}
