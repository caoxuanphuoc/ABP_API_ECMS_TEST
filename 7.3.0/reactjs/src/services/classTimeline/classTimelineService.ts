import { EntityDto } from '../dto/entityDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import http from '../httpService';
import { PagedClassTimelineResultRequestDto } from './dto/PagedClassTimelineResultRequestDto';
import { CreateOrUpdateClassTimelineInput } from './dto/createOrUpdateClassTimelineInput';
import { GetAllClassTimelineOutput } from './dto/getAllClassTimelineOutput';
import { UpdateClassTimelineInput } from './dto/updateClassTimelineInput';

class ClassTimelineService {
  public async create(createClassTimelineInput: CreateOrUpdateClassTimelineInput) {
    let result = await http.post(`api/services/app/ClassTimeline/CreateClassTimeline`, createClassTimelineInput);
    return result.data.result;
  }

  public async update(updateClassTimelineInput: UpdateClassTimelineInput) {
    let result = await http.put(`api/services/app/ClassTimeline/Update`, updateClassTimelineInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete(`api/services/app/ClassTimeline/Delete`, {
      params: entityDto,
    });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrUpdateClassTimelineInput> {
    let result = await http.get(`api/services/app/ClassTimeline/Get`, {
      params: entityDto,
    });
    return result.data.result;
  }

  public async getAll(
    pagedFilterAndSortedRequest: PagedClassTimelineResultRequestDto
  ): Promise<PagedResultDto<GetAllClassTimelineOutput>> {
    let result = await http.get(`api/services/app/ClassTimeline/GetAll`, {
      params: pagedFilterAndSortedRequest,
    });
    return result.data.result;
  }

  public async hashSchedule(id: number) {
    let result = await http.post(`api/services/app/ClassTimeline/HashSchedule?id=${id}`);
    return result.data.result;
  }
}

export default new ClassTimelineService();
