import { action, observable } from 'mobx';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { GetTeacherOutput } from '../services/teacher/dto/getTeacherOutput';
import { CreateOrUpdateTeacherInput } from '../services/teacher/dto/createOrUpdateTeacherInput';
import teacherService from '../services/teacher/teacherService';
import { UpdateTeacherInput } from '../services/teacher/dto/updateTeacherInput';
import { EntityDto } from '../services/dto/entityDto';
import { PagedTeacherResultRequestDto } from '../services/teacher/dto/PagedTeacherResultRequestDto';

class TeacherStore {
  @observable teachers!: PagedResultDto<GetTeacherOutput>;

  @observable editTeacher!: CreateOrUpdateTeacherInput;

  @action
  async create(createTeacherInput: CreateOrUpdateTeacherInput) {
    let result = await teacherService.create(createTeacherInput);
    this.teachers.items.push(result);
  }

  @action
  async update(updateTeacherInput: UpdateTeacherInput) {
    let result = await teacherService.update(updateTeacherInput);
    this.teachers.items = this.teachers.items.map((x: GetTeacherOutput) => {
      if (x.id === updateTeacherInput.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await teacherService.delete(entityDto);
    this.teachers.items = this.teachers.items.filter(
      (x: GetTeacherOutput) => x.id !== entityDto.id
    );
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await teacherService.get(entityDto);
    this.editTeacher = result;
  }

  @action
  async createTeacher() {
    this.editTeacher = {
      id: 0,
      user: {
        userName: '',
        name: '',
        surname: '',
        emailAddress: '',
        isActive: false,
        fullName: '',
        roleNames: [],
        id: 0,
      },
      schoolName: '',
      certificate: '',
      wage: 0,
      startTime: new Date(),
    };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedTeacherResultRequestDto) {
    let result = await teacherService.getAll(pagedFilterAndSortedRequest);
    this.teachers = result;
  }
}

export default TeacherStore;
