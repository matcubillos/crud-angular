import { Injectable } from '@angular/core';
import { environment } from '../../config/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { UserCreateDto } from '../../models/user-create.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrlUsers = `${environment.apiUrl}users/`

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrlUsers)
  }

  //dto de post debe incluir el roleId, no el Role completo
  createUser(user: UserCreateDto): Observable<User> {
    return this.http.post<User>(this.apiUrlUsers, user);
  }

  //dto de put debe incluir el roleId, no el Role completo
  updateUser(id: number, user: { name: string; email: string; roleId: number }): Observable<User> {
    return this.http.put<User>(`${this.apiUrlUsers}${id}/`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlUsers}${id}/`)
  }
}