import { EntityDto } from '../dto/entityDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import { PagedTeacherResultRequestDto } from './dto/PagedTeacherResultRequestDto';
import { CreateOrUpdateTeacherInput } from './dto/createOrUpdateTeacherInput';
import { GetAllTeacherOutput } from './dto/getAllTeacherOutput';
import { UpdateTeacherInput } from './dto/updateTeacherInput';

class TeacherService {
  public async create(createTeacherInput: CreateOrUpdateTeacherInput) {
    let result = await http.post(`api/services/app/Teacher/Create`, createTeacherInput);
    return result.data.result;
  }

  public async update(updateTeacherInput: UpdateTeacherInput) {
    let result = await http.put(`api/services/app/Teacher/Update`, updateTeacherInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('api/services/app/Teacher/Delete', {
      params: entityDto,
    });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateTeacherInput> {
    let result = await http.get('api/services/app/Teacher/Get', {
      params: entityDto,
    });
    return result.data.result;
  }

  public async getAll(
    pagedFilterAndSortedRequest: PagedTeacherResultRequestDto
  ): Promise<PagedResultDto<GetAllTeacherOutput>> {
    let result = await http.get(`api/services/app/Teacher/GetAll`, {
      params: pagedFilterAndSortedRequest,
    });
    return result.data.result;
  }
}

export default new TeacherService();
