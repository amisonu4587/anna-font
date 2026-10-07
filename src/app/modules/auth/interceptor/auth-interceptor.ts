import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '../login/service/login-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const loginser = inject(LoginService);

  const token = loginser.getToken();

  if (!token) {
    return next(req);
  }

  const tokenizedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(tokenizedReq);
};
