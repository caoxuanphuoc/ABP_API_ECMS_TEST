import { action, observable } from 'mobx';
import { GetScheduleOutput } from '../services/schedule/dto/getScheduleOutput';
import { CreateOrUpdateScheduleInput } from '../services/schedule/dto/createOrUpdateScheduleInput';
import scheduleService from '../services/schedule/scheduleService';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { UpdateScheduleInput } from '../services/schedule/dto/updateScheduleInput';
import { EntityDto } from '../services/dto/entityDto';
import { PagedScheduleResultRequestDto } from '../services/schedule/dto/PagedScheduleResultRequestDto';

class ScheduleStore {
  @observable schedules!: PagedResultDto<GetScheduleOutput>;

  @observable editSchedule!: CreateOrUpdateScheduleInput;

  @action
  async create(createScheduleInput: CreateOrUpdateScheduleInput) {
    let result = await scheduleService.create(createScheduleInput);
    this.schedules.items.push(result);
  }

  @action
  async update(updateScheduleInput: UpdateScheduleInput) {
    let result = await scheduleService.update(updateScheduleInput);
    this.schedules.items = this.schedules.items.map((x: GetScheduleOutput) => {
      if (x.id === updateScheduleInput.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await scheduleService.delete(entityDto);
    this.schedules.items = this.schedules.items.filter(
      (x: GetScheduleOutput) => x.id !== entityDto.id
    );
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await scheduleService.get(entityDto);
    this.editSchedule = result;
  }

  @action
  async createSchedule() {
    this.editSchedule = {
      id: 0,
      class: {
        id: 0,
        code: 'string',
        course: {
          id: 0,
          courseName: 'string',
          courseFee: 0,
          quantity: 0,
        },
        startDate: new Date(),
        endDate: new Date(),
        limitStudent: 0,
        currentStudent: 0,
        lessionTimes: 0,
        isActive: true,
      },
      workShift: {
        id: 0,
        code: 'string',
        timeStart: new Date(),
        timeEnd: new Date(),
      },
      date: new Date(),
    };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedScheduleResultRequestDto) {
    let result = await scheduleService.getAll(pagedFilterAndSortedRequest);
    this.schedules = result;
  }

  @action
  async getAllWithClassIdFilter(
    pagedFilterAndSortedRequest: PagedScheduleResultRequestDto,
    classId: number
  ) {
    let result = await scheduleService.getAllWithClassIdFilter(
      pagedFilterAndSortedRequest,
      classId
    );
    this.schedules = result;
  }
}

export default ScheduleStore;
