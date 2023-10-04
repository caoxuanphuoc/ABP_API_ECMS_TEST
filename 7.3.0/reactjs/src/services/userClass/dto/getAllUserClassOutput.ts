import { GetClassOutput } from '../../class/dto/getClassOutput';
import { GetUserOutput } from '../../user/dto/getUserOutput';

export interface GetAllUserClassOutput {
  user: GetUserOutput;
  class: GetClassOutput;
  offTimes: number;
  dateStart: Date;
  isActive: boolean;
  id: number;
}
