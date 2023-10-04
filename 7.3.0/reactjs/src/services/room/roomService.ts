import { EntityDto } from '../dto/entityDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import { PagedRoomResultRequestDto } from './dto/PagedRoomResultRequestDto';
import { CreateOrUpdateRoomInput } from './dto/createOrUpdateRoomInput';
import { GetAllRoomOutput } from './dto/getAllRoomOutput';
import { UpdateRoomInput } from './dto/updateRoomInput';

class RoomService {
  public async create(createRoomInput: CreateOrUpdateRoomInput) {
    let result = await http.post(`api/services/app/Room/Create`, createRoomInput);
    return result.data.result;
  }

  public async update(updateRoomInput: UpdateRoomInput) {
    let result = await http.put(`api/services/app/Room/Update`, updateRoomInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete(`api/services/app/Room/Delete`, {
      params: entityDto,
    });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateRoomInput> {
    let result = await http.get(`api/services/app/Room/Get`, {
      params: entityDto,
    });
    return result.data.result;
  }

  public async getAll(
    pagedFilterAndSortedRequest: PagedRoomResultRequestDto
  ): Promise<PagedResultDto<GetAllRoomOutput>> {
    let result = await http.get(`api/services/app/Room/GetAll`, {
      params: pagedFilterAndSortedRequest,
    });
    return result.data.result;
  }
}

export default new RoomService();
