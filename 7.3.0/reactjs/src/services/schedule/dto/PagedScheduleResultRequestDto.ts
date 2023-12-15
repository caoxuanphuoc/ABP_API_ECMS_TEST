import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedScheduleResultRequestDto extends PagedFilterAndSortedRequest {
  keyword: string;
}
