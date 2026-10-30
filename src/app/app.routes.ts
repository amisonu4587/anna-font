import { Routes } from '@angular/router';
import { LoginCompenent } from './modules/auth/login/login-compenent/login-compenent';
import { LayoutComponent } from './modules/sheared/layout/layout-component/layout-component';
import { authGuard } from './modules/auth/guard/auth-guard';
import { DashboardComponent } from './modules/features/dashboard/dashboard-component/dashboard-component';
import { RoleComponent } from './modules/features/role/role-component/role-component';
import { UserList } from './modules/features/user/component/user-list/user-list';
import { UserCreate } from './modules/features/user/component/user-create/user-create';
import { UserUpdate } from './modules/features/user/component/user-update/user-update';
import { ProfileComponent } from './modules/features/profile/component/profile-component/profile-component';
import { GuestComponent } from './modules/sheared/guest/guest-component/guest-component';
import { InitialApplicationComponent } from './modules/features/publicPortal/initialApplication/component/initial-application-component/initial-application-component';

export const routes: Routes = [


  {
    path: 'login',
    component: LoginCompenent
  },
  {
    path: 'application',
    component: GuestComponent,
    children: [
      {
        path: '',
        redirectTo: 'online-application',
        pathMatch: 'full'
      },
      {
        path: 'online-application',
        component: InitialApplicationComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: 'application',
    pathMatch: 'full'
  },

  {
    path: '',
    component: LayoutComponent,
    canActivateChild: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'profile',
        component: ProfileComponent
      },

      {
        path: 'associate-data',
        children: [
          {
            path: 'users',
            children: [
              { path: '', component: UserList },
              { path: 'create', component: UserCreate },
              { path: 'update/:id', component: UserUpdate }

            ]
          },
          {
            path: 'roles',
            component: RoleComponent
          },
        ]
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // {
  //   path: '**',
  //   redirectTo: 'login'
  // }



];
