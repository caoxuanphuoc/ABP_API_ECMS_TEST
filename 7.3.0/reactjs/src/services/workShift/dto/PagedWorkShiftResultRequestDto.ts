import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedWorkShiftResultRequestDto extends PagedFilterAndSortedRequest {
  keyword: string;
}
