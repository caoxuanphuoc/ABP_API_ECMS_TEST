import { EntityDto } from '../dto/entityDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import { PagedWorkShiftResultRequestDto } from './dto/PagedWorkShiftResultRequestDto';
import { CreateOrUpdateWorkShiftInput } from './dto/createOrUpdateWorkShiftInput';
import { GetAllWorkShiftOutput } from './dto/getAllWorkShiftOutput';
import { UpdateWorkShiftInput } from './dto/updateWorkShiftInput';

class WorkShiftService {
  public async create(createWorkShiftInput: CreateOrUpdateWorkShiftInput) {
    let result = await http.post(`api/services/app/WorkShift/Create`, createWorkShiftInput);
    return result.data.result;
  }

  public async update(updateWorkShiftInput: UpdateWorkShiftInput) {
    let result = await http.put(`api/services/app/WorkShift/Update`, updateWorkShiftInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete(`api/services/app/WorkShift/Delete`, {
      params: entityDto,
    });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateWorkShiftInput> {
    let result = await http.get(`api/services/app/WorkShift/Get`, {
      params: entityDto,
    });
    return result.data.result;
  }

  public async getAll(
    pagedFilterAndSortedRequest: PagedWorkShiftResultRequestDto
  ): Promise<PagedResultDto<GetAllWorkShiftOutput>> {
    let result = await http.get(`api/services/app/WorkShift/GetAll`, {
      params: pagedFilterAndSortedRequest,
    });
    return result.data.result;
  }
}

export default new WorkShiftService();
