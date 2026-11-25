

export class ApplicationVerificationResponse {
  isSuccess!: boolean;
  statusCode!: number;
  message!: string;
  result!: ApplicationVerificationResult;
}


export class ApplicationVerificationResult {
  isSuccess!: boolean;
  message!: string;
  applicationId!: string;
  applicationForId!: number;
  applicationFor!: string;
  applicationCode!: string;
  applicationNo!: string;
  applicantName!: string;
  email!: string;
  contactNumber!: string;
  applicationDate!: string;
  applicationStatusId!: number;
  applicationStatus!: string;
}
