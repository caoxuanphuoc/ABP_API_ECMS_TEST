import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedPositionResultRequestDto extends PagedFilterAndSortedRequest {
  keyword: string;
}
