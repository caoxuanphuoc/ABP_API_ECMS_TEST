import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedRoomResultRequestDto extends PagedFilterAndSortedRequest {
  keyword: string;
}
