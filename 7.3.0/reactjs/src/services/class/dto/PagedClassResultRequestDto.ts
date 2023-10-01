import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedClassResultRequestDto extends PagedFilterAndSortedRequest {
  keyword: string;
}
