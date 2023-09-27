import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedCourseResultRequestDto extends PagedFilterAndSortedRequest {
  keyword: string;
}
