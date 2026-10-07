import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateChildFn, Router } from '@angular/router';


// export const authGuard: CanActivateChildFn = () => {

//   const router = inject(Router);

//   const token = localStorage.getItem('token');

//   if (!token) {
//     return router.createUrlTree(['/login']);
//   }

//   return true;
// };

export const authGuard: CanActivateChildFn = (childRoute, state) => {

  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // localStorage is available only in the browser
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = localStorage.getItem('token');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
