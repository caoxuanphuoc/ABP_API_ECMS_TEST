export interface CreateWorkShiftOutputItem {
  code: string;
  timeStart: Date;
  timeEnd: Date;
  id: number;
}

export interface CreateWorkShiftOutput {
  result: CreateWorkShiftOutputItem;
}
