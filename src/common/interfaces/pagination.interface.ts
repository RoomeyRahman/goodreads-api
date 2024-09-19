/**
 * total: number of rows present in the query
 */
export interface IPagination {
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
}
