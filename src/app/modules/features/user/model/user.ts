export class ApiResponse<T> {
  isSuccess!: boolean;
  statusCode!: number;
  message!: string;
  result!: T;
}



export class UserSearchResultDto {
  id!: number;
  name!: string;
  cellPhone!: string;
  workPhone!: string;
  email!: string;
  roleId!: number;
  role!: string;
  status!: string;
  createdOn!: string;
}


export class UserListResponse {
  isSuccess!: boolean;
  statusCode!: number;
  message!: string;
  result!: UserSearchResult;
}

export class UserSearchResult {
  userSearchResultDto!: UserSearchResultDto[];

  name!: string;
  email!: string;
  roleId!: number;
  status!: string;

  currentPage!: number;
  recordsPerPage!: number;
  hasPrevious!: boolean;
  hasNext!: boolean;
  totalPages!: number;
  totalRecords!: number;
}



export class UserDetails {
  id!: number;
  name!: string;
  cellPhone!: string;
  workPhone!: string;
  email!: string;
  roleId!: number;
  role!: string;
  isActive!: boolean;
  isDeleted!: boolean;
  createdBy!: string;
  createdOn!: string;
  updatedBy!: string | null;
  updatedOn!: string | null;
}


