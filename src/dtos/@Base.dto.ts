export type PickRename<T, K extends keyof T, NewKey extends string> = {
  [P in K as NewKey]: T[P];
}

export interface IPageInfo {
  hasNextPage: boolean;
}

export interface IPaginationResponse<T = any> {
  data: T[];
  pageInfo: IPageInfo;
}

export type TSuccess = {
  success: boolean;
  message?: string
}