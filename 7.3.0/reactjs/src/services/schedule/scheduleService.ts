import { EntityDto } from '../dto/entityDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import { PagedScheduleResultRequestDto } from './dto/PagedScheduleResultRequestDto';
import { CreateOrUpdateScheduleInput } from './dto/createOrUpdateScheduleInput';
import { GetAllScheduleOutput } from './dto/getAllScheduleOutput';
import { UpdateScheduleInput } from './dto/updateScheduleInput';

class ScheduleService {
  public async create(createScheduleInput: CreateOrUpdateScheduleInput) {
    let result = await http.post(`api/services/app/Schedule/Create`, createScheduleInput);
    return result.data.result;
  }

  public async update(updateScheduleInput: UpdateScheduleInput) {
    let result = await http.put('api/services/app/Schedule/Update', updateScheduleInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete(`api/services/app/Schedule/Delete`, {
      params: entityDto,
    });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateScheduleInput> {
    let result = await http.get(`api/services/app/Schedule/Get`, {
      params: entityDto,
    });
    return result.data.result;
  }

  public async getAll(
    pagedFilterAndSortedRequest: PagedScheduleResultRequestDto
  ): Promise<PagedResultDto<GetAllScheduleOutput>> {
    let result = await http.get(`api/services/app/Schedule/GetAll`, {
      params: pagedFilterAndSortedRequest,
    });
    return result.data.result;
  }
}

export default new ScheduleService();
