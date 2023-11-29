import { GetClassOutput } from "../../class/dto/getClassOutput";
import { GetUserOutput } from "../../user/dto/getUserOutput";

export interface GetUserClassOutput {
  user: GetUserOutput;
  class: GetClassOutput;
  offTimes: number;
  dateStart: Date;
  isActive: boolean;
  roleMember: string;
  id: number;
}
