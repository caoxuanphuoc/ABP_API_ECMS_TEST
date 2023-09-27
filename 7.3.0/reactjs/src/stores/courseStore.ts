import { action, observable } from 'mobx';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { GetCourseOutput } from '../services/course/dto/getCourseOutput';
import { CreateOrUpdateCourseInput } from '../services/course/dto/createOrUpdateCourseInput';
import courseService from '../services/course/courseService';
import { UpdateCourseInput } from '../services/course/dto/updateCourseInput';
import { EntityDto } from '../services/dto/entityDto';
import { PagedCourseResultRequestDto } from '../services/course/dto/PagedCourseResultRequestDto';

class CourseStore {
  @observable courses!: PagedResultDto<GetCourseOutput>;

  @observable editCourse!: CreateOrUpdateCourseInput;

  @action
  async create(createCourseInput: CreateOrUpdateCourseInput) {
    let result = await courseService.create(createCourseInput);
    this.courses.items.push(result);
  }

  @action
  async update(updateCourseInput: UpdateCourseInput) {
    let result = await courseService.update(updateCourseInput);
    this.courses.items = this.courses.items.map((x: GetCourseOutput) => {
      if (x.id === updateCourseInput.id) x = result;
      return x;
    });
  }

  @action
  async delete(enttiyDto: EntityDto) {
    await courseService.delete(enttiyDto);
    this.courses.items = this.courses.items.filter((x: GetCourseOutput) => x.id !== enttiyDto.id);
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await courseService.get(entityDto);
    this.editCourse = result;
  }

  @action
  async createCourse() {
    this.editCourse = {
      courseName: '',
      courseFee: 0,
      quantity: 0,
      id: 0,
    };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedCourseResultRequestDto) {
    let result = await courseService.getAll(pagedFilterAndSortedRequest);
    this.courses = result;
  }
}

export default CourseStore;
