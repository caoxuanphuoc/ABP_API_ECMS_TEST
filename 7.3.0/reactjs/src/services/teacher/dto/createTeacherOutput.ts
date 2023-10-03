import { GetUserOutput } from '../../user/dto/getUserOutput';

export interface CreateTeacherOutputItem {
  User: GetUserOutput;
  schoolName: string;
  certificate: string;
  wage: number;
  startTime: Date;
  id: number;
}

export interface CreateTeacherOutput {
  result: CreateTeacherOutputItem;
}
