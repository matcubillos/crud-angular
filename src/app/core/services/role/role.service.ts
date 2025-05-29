import { Injectable } from '@angular/core';
import { environment } from '../../config/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../../models/role.model';
import { RoleCreateDto } from '../../models/role-create.dto';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  //apiurl proviene de environment.ts(ENV)
  private apiUrlRoles = `${environment.apiUrl}roles/`

  constructor(private http: HttpClient) { }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrlRoles)
  }

  createRole(role: RoleCreateDto): Observable<RoleCreateDto> {
    return this.http.post<RoleCreateDto>(this.apiUrlRoles, role);
  }
  updateRole(id: number, role: RoleCreateDto): Observable<RoleCreateDto> {
    return this.http.put<RoleCreateDto>(`${this.apiUrlRoles}${id}/`, role);
  }
  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlRoles}${id}/`)
  }
  
}