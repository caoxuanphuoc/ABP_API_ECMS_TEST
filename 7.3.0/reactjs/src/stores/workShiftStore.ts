import { action, observable } from 'mobx';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { GetWorkShiftOutput } from '../services/workShift/dto/getWorkShiftOutput';
import { CreateOrUpdateWorkShiftInput } from '../services/workShift/dto/createOrUpdateWorkShiftInput';
import workShiftService from '../services/workShift/workShiftService';
import { UpdateWorkShiftInput } from '../services/workShift/dto/updateWorkShiftInput';
import { EntityDto } from '../services/dto/entityDto';
import { PagedWorkShiftResultRequestDto } from '../services/workShift/dto/PagedWorkShiftResultRequestDto';

class WorkShiftStore {
  @observable workShifts!: PagedResultDto<GetWorkShiftOutput>;

  @observable editWorkShift!: CreateOrUpdateWorkShiftInput;

  @action
  async create(createWorkShiftInput: CreateOrUpdateWorkShiftInput) {
    let result = await workShiftService.create(createWorkShiftInput);
    this.workShifts.items.push(result);
  }

  @action
  async update(updateWorkShiftInput: UpdateWorkShiftInput) {
    let result = await workShiftService.update(updateWorkShiftInput);
    this.workShifts.items = this.workShifts.items.map((x: GetWorkShiftOutput) => {
      if (x.id === updateWorkShiftInput.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await workShiftService.delete(entityDto);
    this.workShifts.items = this.workShifts.items.filter(
      (x: GetWorkShiftOutput) => x.id !== entityDto.id
    );
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await workShiftService.get(entityDto);
    this.editWorkShift = result;
  }

  @action
  async createWorkShift() {
    this.editWorkShift = {
      code: '',
      timeStart: new Date(),
      timeEnd: new Date(),
      id: 0,
    };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedWorkShiftResultRequestDto) {
    let result = await workShiftService.getAll(pagedFilterAndSortedRequest);
    this.workShifts = result;
  }
}

export default WorkShiftStore;
