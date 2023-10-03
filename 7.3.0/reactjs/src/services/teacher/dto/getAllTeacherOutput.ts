import { GetUserOutput } from '../../user/dto/getUserOutput';

export interface GetAllTeacherOutput {
  user: GetUserOutput;
  schoolName: string;
  certificate: string;
  wage: number;
  startTime: Date;
  id: number;
}
