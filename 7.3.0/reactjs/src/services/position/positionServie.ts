import { EntityDto } from '../dto/entityDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import { PagedPositionResultRequestDto } from './dto/PagedPositionResultRequestDto';
import { CreateOrUpdatePositionInput } from './dto/createOrUpdatePositionInput';
import { GetAllPositionOutput } from './dto/getAllPositionOutput';
import { UpdatePositionInput } from './dto/updatePositionInput';

class PositionService {
  public async create(createPositionInput: CreateOrUpdatePositionInput) {
    let result = await http.post(`api/services/app/Position/Create`, createPositionInput);
    return result.data.result;
  }

  public async update(updatePositionInput: UpdatePositionInput) {
    let result = await http.put(`api/services/app/Position/Update`, updatePositionInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete(`api/services/app/Position/Delete`, {
      params: entityDto,
    });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdatePositionInput> {
    let result = await http.get(`api/services/app/Position/Get`, {
      params: entityDto,
    });
    return result.data.result;
  }

  public async getAll(
    pagedFilterAndSortedRequest: PagedPositionResultRequestDto
  ): Promise<PagedResultDto<GetAllPositionOutput>> {
    let result = await http.get(`api/services/app/Position/GetAll`, {
      params: pagedFilterAndSortedRequest,
    });
    return result.data.result;
  }
}

export default new PositionService();
