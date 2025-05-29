import { Injectable } from '@angular/core';
import { environment } from '../../config/environment';
import { HttpClient } from '@angular/common/http';
import { Variable } from '../../models/variable.model';
import { VariableCreateDto } from '../../models/variable-create.dto';

@Injectable({
  providedIn: 'root'
})
export class VariableService {

  private apiUrlVariables = `${environment.apiUrl}variables/`

  constructor(private http: HttpClient) { }

  getVariables() {
    return this.http.get<Variable[]>(this.apiUrlVariables);
  }

  createVariable(variable: VariableCreateDto) {
    return this.http.post<Variable>(this.apiUrlVariables, variable);
  }

  updateVariable(id: number, variable: VariableCreateDto) {
    return this.http.put<Variable>(`${this.apiUrlVariables}${id}/`, variable);
  }

  deleteVariable(id: number) {
    return this.http.delete<void>(`${this.apiUrlVariables}${id}/`);
  }

}
