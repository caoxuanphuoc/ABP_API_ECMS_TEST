import { GetClassOutput } from '../../class/dto/getClassOutput';
import { GetUserOutput } from '../../user/dto/getUserOutput';

export interface CreateUserClassOutputItem {
  user: GetUserOutput;
  class: GetClassOutput;
  offTimes: number;
  dateStart: Date;
  isActive: boolean;
  id: number;
}

export interface CreateUseerClassOutput {
  result: CreateUserClassOutputItem;
}
