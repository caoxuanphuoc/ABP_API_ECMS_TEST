import { action, observable } from 'mobx';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { GetClassOutput } from '../services/class/dto/getClassOutput';
import { CreateOrUpdateClassInput } from '../services/class/dto/createOrUpdateClassInput';
import classService from '../services/class/classService';
import { UpdateClassInput } from '../services/class/dto/updateClassInput';
import { EntityDto } from '../services/dto/entityDto';
import { PagedClassResultRequestDto } from '../services/class/dto/PagedClassResultRequestDto';

class ClassStore {
  @observable classes!: PagedResultDto<GetClassOutput>;

  @observable editClass!: CreateOrUpdateClassInput;

  @action
  async create(createClassInput: CreateOrUpdateClassInput) {
    let result = await classService.create(createClassInput);
    this.classes.items.push(result);
  }

  @action
  async update(updateClassInput: UpdateClassInput) {
    let result = await classService.update(updateClassInput);
    this.classes.items = this.classes.items.map((x: GetClassOutput) => {
      if (x.id === updateClassInput.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await classService.delete(entityDto);
    this.classes.items = this.classes.items.filter((x: GetClassOutput) => x.id !== entityDto.id);
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await classService.get(entityDto);
    this.editClass = result;
  }

  @action
  async createClass() {
    this.editClass = {
      code: '',
      course: {
        id: 0,
        courseName: '',
        courseFee: 0,
        quantity: 0,
      },
      limitStudent: 0,
      currentStudent: 0,
      lessionTimes: 0,
      isActive: true,
      id: 0,
    };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedClassResultRequestDto) {
    let result = await classService.getAll(pagedFilterAndSortedRequest);
    this.classes = result;
  }
}

export default ClassStore;
