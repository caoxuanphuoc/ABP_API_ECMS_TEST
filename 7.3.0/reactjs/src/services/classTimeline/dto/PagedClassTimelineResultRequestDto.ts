import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedClassTimelineResultRequestDto extends PagedFilterAndSortedRequest {
  keyword: string;
  classId: number;
  courseId: number;
}
