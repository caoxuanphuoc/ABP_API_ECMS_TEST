import { GetClassOutput } from "../../class/dto/getClassOutput";
import { GetUserOutput } from "../../user/dto/getUserOutput";

export interface UpdateUserClassOutput {
  user: GetUserOutput;
  class: GetClassOutput;
  offTimes: number;
  DateStart: Date;
  isActive: boolean;
  id: number;
}
