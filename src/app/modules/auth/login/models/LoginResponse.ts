export class LoginResponse {
  isSuccess!: boolean;
  statusCode!: number;
  message!: string;
  result!: loginData;
}

class loginData {
  userId!: number;
  name!: string;
  role!: string;
  token!: string;
}
