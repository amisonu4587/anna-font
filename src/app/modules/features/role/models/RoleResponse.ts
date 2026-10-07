
export class RoleResponse {
  isSuccess!: boolean;
  statusCode!: number;
  message!: string;
  result!: RoleData[];
}

export class RoleData {
  id!: number;
  name!: string;
  isActive!: boolean;
}

