import { Routes } from '@angular/router';
import { UsersComponent } from './core/components/users/users.component';
import { VariablesComponent } from './core/components/variables/variables.component';
import { RolesComponent } from './core/components/roles/roles.component';

export const routes: Routes = [
    {path: 'users', component: UsersComponent},
    {path: 'variables', component: VariablesComponent},
    {path: 'roles', component: RolesComponent},
    {path: '', redirectTo: 'users', pathMatch: 'full'}
];
