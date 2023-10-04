import { GetUserOutput } from '../../user/dto/getUserOutput';

export interface CreateOrUpdateTeacherInput {
  user: GetUserOutput;
  schoolName: string;
  certificate: string;
  wage: number;
  startTime: Date;
  id: number;
}
