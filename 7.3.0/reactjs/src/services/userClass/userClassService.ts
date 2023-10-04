import { EntityDto } from '../dto/entityDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import { PagedUserClassResultRequestDto } from './dto/PagedUserClassResultRequestDto';
import { CreateOrUpdateUserClassInput } from './dto/createOrUpdateUserClassInput';
import { GetAllUserClassOutput } from './dto/getAllUserClassOutput';
import { UpdateUserClassInput } from './dto/updateUserClassInput';

class UserClassService {
  public async create(createUserClassInput: CreateOrUpdateUserClassInput) {
    let result = await http.post(`api/services/app/UserClass/Create`, createUserClassInput);
    return result.data.result;
  }

  public async update(updateUserClassInput: UpdateUserClassInput) {
    let result = await http.put(`api/services/app/UserClass/Update`, updateUserClassInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete(`api/services/app/UserClass/Delete`, {
      params: { id: entityDto.id },
    });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateUserClassInput> {
    let result = await http.get(`api/services/app/UserClass/Get`, {
      params: entityDto,
    });
    return result.data.result;
  }

  public async getAll(
    pagedFilterAndSortedRequest: PagedUserClassResultRequestDto
  ): Promise<PagedResultDto<GetAllUserClassOutput>> {
    let result = await http.get(`api/services/app/UserClass/GetAll`, {
      params: pagedFilterAndSortedRequest,
    });
    return result.data.result;
  }
}

export default new UserClassService();
