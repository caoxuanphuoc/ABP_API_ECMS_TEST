import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedUserClassResultRequestDto extends PagedFilterAndSortedRequest {
  keyword: string;
  isActive: boolean;
}
