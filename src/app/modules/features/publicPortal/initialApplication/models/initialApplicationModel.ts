export class PermitTypeResponse {
  isSuccess!: boolean;
  statusCode!: number;
  message!: string;
  result!: permitType[];
}

class permitType {
  id!: number;
  name!: string;
  code!: string;
  isActive!: boolean;
}

export class ApplicationResponse {
  isSuccess!: boolean;
  statusCode!: number;
  message!: string;
  result!: ApplicationResult;
}

export class ApplicationResult {
  applicationId!: number;
  applicationNo!: string;
}



