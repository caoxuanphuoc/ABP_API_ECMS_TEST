import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedTeacherResultRequestDto extends PagedFilterAndSortedRequest {
  keyword: string;
}
