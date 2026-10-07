import { Routes } from '@angular/router';
import { LoginCompenent } from './modules/auth/login/login-compenent/login-compenent';
import { LayoutComponent } from './modules/sheared/layout/layout-component/layout-component';
import { authGuard } from './modules/auth/guard/auth-guard';
import { DashboardComponent } from './modules/features/dashboard/dashboard-component/dashboard-component';
import { RoleComponent } from './modules/features/role/role-component/role-component';
import { UserList } from './modules/features/user/component/user-list/user-list';
import { UserCreate } from './modules/features/user/component/user-create/user-create';

export const routes: Routes = [


 {
    path: 'login',
    component: LoginCompenent
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
        path: 'associate-data',
        children: [
          {
            path: 'users',
            children: [
              { path: '', component: UserList },
              { path: 'create', component: UserCreate }
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

  {
    path: '**',
    redirectTo: 'login'
  }



];
