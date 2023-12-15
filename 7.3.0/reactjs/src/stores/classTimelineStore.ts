import { action, observable } from 'mobx';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { GetClassTimelineOutput } from '../services/classTimeline/dto/getClassTimelineOutput';
import { CreateOrUpdateClassTimelineInput } from '../services/classTimeline/dto/createOrUpdateClassTimelineInput';
import classTimelineService from '../services/classTimeline/classTimelineService';
import { UpdateClassTimelineInput } from '../services/classTimeline/dto/updateClassTimelineInput';
import { EntityDto } from '../services/dto/entityDto';
import { PagedClassTimelineResultRequestDto } from '../services/classTimeline/dto/PagedClassTimelineResultRequestDto';

class ClassTimelineStore {
  @observable classTimelines!: PagedResultDto<GetClassTimelineOutput>;

  @observable editClassTimeline!: CreateOrUpdateClassTimelineInput;

  @observable hashString!: string;

  @action
  async create(createClassTimelineInput: CreateOrUpdateClassTimelineInput) {
    let result = await classTimelineService.create(createClassTimelineInput);
    this.classTimelines.items.push(result);
  }

  @action
  async update(updateClassTimelineInput: UpdateClassTimelineInput) {
    let result = await classTimelineService.update(updateClassTimelineInput);
    this.classTimelines.items = this.classTimelines.items.map((x: GetClassTimelineOutput) => {
      if (x.id === updateClassTimelineInput.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await classTimelineService.delete(entityDto);
    this.classTimelines.items = this.classTimelines.items.filter(
      (x: GetClassTimelineOutput) => x.id !== entityDto.id
    );
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await classTimelineService.get(entityDto);
    this.editClassTimeline = result;
  }

  @action
  async createClassTimeline() {
    this.editClassTimeline = {
      id: 0,
      startDate: new Date(),
      endDate: new Date(),
      class: {
        id: 0,
        code: 'string',
        course: {
          id: 0,
          courseName: 'string',
          courseFee: 0,
          quantity: 0,
        },
        room: {
          roomName: '',
          maxContainer: 0,
          id: 0,
        },
        limitStudent: 0,
        currentStudent: 0,
        lessionTimes: 0,
        isActive: true,
        lsWorkSheet: [],
      },
      schedule: {
        id: 0,
        room: {
          roomName: '',
          maxContainer: 0,
          id: 0,
        },
        dayOfWeek: 0,
        shift: 1,
        date: new Date(),
      },
    };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedClassTimelineResultRequestDto) {
    let result = await classTimelineService.getAll(pagedFilterAndSortedRequest);
    this.classTimelines = result;
  }

  @action
  async hashSchedule(scheduleId: number) {
    let result = await classTimelineService.hashSchedule(scheduleId);
    this.hashString = result;
  }
}

export default ClassTimelineStore;
