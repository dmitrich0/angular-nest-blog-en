import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {UsersComponent} from "./components/users/users.component";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {UpdateUserProfileComponent} from "./components/update-user-profile/update-user-profile.component";
import {AuthGuard} from "./guards/auth.guard";
import {HomeComponent} from "./components/home/home.component";
import {CreateBlogEntryComponent} from "./components/create-blog-entry/create-blog-entry.component";

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'update-profile',
    component: UpdateUserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'users',
    children: [
      {
        path: '',
        component: UsersComponent
      },
      {
        path: ':id',
        component: UserProfileComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'create-blog-entry',
    component: CreateBlogEntryComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
