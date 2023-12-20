import { action, observable } from 'mobx';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { GetUserClassOutput } from '../services/userClass/dto/getUserClassOutput';
import { CreateOrUpdateUserClassInput } from '../services/userClass/dto/createOrUpdateUserClassInput';
import userClassService from '../services/userClass/userClassService';
import { UpdateUserClassInput } from '../services/userClass/dto/updateUserClassInput';
import { EntityDto } from '../services/dto/entityDto';
import { PagedUserClassResultRequestDto } from '../services/userClass/dto/PagedUserClassResultRequestDto';

class UserClassStore {
  @observable userClasses!: PagedResultDto<GetUserClassOutput>;

  @observable editUserClass!: CreateOrUpdateUserClassInput;

  @action
  async create(createUserClassInput: CreateOrUpdateUserClassInput) {
    let result = await userClassService.create(createUserClassInput);
    this.userClasses.items.push(result);
  }

  @action
  async update(updateUserClassInput: UpdateUserClassInput) {
    let result = await userClassService.update(updateUserClassInput);
    this.userClasses.items = this.userClasses.items.map((x: GetUserClassOutput) => {
      if (x.id === updateUserClassInput.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await userClassService.delete(entityDto);
    this.userClasses.items = this.userClasses.items.filter(
      (x: GetUserClassOutput) => x.id !== entityDto.id
    );
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await userClassService.get(entityDto);
    this.editUserClass = result;
  }

  @action
  async createUserClass() {
    this.editUserClass = {
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
      class: {
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
      },
      offTimes: 0,
      dateStart: new Date(),
      isActive: false,
      id: 0,
    };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedUserClassResultRequestDto) {
    let result = await userClassService.getAll(pagedFilterAndSortedRequest);
    this.userClasses = result;
  }
}

export default UserClassStore;
