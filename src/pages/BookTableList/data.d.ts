export interface TableListItem {
  key: number;
  author?: Object<any>;
  publisher: Object<any>;
  originalName: Object<any>;
  translatoer: Object<any>;
  pages: Object<any>;
  price: Object<any>;
  layout: Object<any>;
  ISBN: string;
  createdAt: string;
  book: Object<any>;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter?: string;
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
}
