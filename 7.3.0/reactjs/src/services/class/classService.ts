import { EntityDto } from '../dto/entityDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import { PagedClassResultRequestDto } from './dto/PagedClassResultRequestDto';
import { CreateOrUpdateClassInput } from './dto/createOrUpdateClassInput';
import { GetAllClassOuput } from './dto/getAllClassOutput';
import { UpdateClassInput } from './dto/updateClassInput';

class ClassService {
  public async create(createClassInput: CreateOrUpdateClassInput) {
    let result = await http.post(`api/services/app/Class/Create`, createClassInput);
    return result.data.result;
  }

  public async update(updateClassInput: UpdateClassInput) {
    let result = await http.put('api/services/app/Class/Update', updateClassInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('api/services/app/Class/Delete', {
      params: { id: entityDto.id },
    });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateClassInput> {
    let result = await http.get(`api/services/app/Class/Get`, {
      params: entityDto,
    });
    return result.data.result;
  }

  public async getAll(
    pagedFilterAndSortedRequest: PagedClassResultRequestDto
  ): Promise<PagedResultDto<GetAllClassOuput>> {
    let result = await http.get(`api/services/app/Class/GetAll`, {
      params: pagedFilterAndSortedRequest,
    });
    return result.data.result;
  }
}

export default new ClassService();
