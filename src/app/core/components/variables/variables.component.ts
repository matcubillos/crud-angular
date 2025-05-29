import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VariableService } from '../../services/variable/variable.service';
import { Variable } from '../../models/variable.model';
import { VariableCreateDto } from '../../models/variable-create.dto';

@Component({
  selector: 'app-variables',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, CommonModule, FormsModule],
  templateUrl: './variables.component.html',
  styleUrl: './variables.component.scss'
})
export class VariablesComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'value', 'type', 'actions'];
  dataSource: Variable[] = [];
  showForm = false;
  editingVariable: Variable | null = null;

  variableName = '';
  variableValue = '';
  variableType = 'text';

  constructor(
    private variableService: VariableService
  ) { }

  ngOnInit(): void {
    this.loadVariables();
  }

  loadVariables(): void {
    this.variableService.getVariables().subscribe({
      next: (variables) => this.dataSource = variables,
      error: (err) => {
        console.error('Error al obtener variables', err);
        alert('Error al cargar las variables');
      }
    });
  }

  showAddForm(): void {
    this.showForm = true;
    this.editingVariable = null;
    this.clearForm();
  }

  showEditForm(variable: Variable): void {
    this.showForm = true;
    this.editingVariable = variable;
    this.variableName = variable.name;
    this.variableValue = variable.value;
    this.variableType = variable.type;
  }

  clearForm(): void {
    this.variableName = '';
    this.variableValue = '';
    this.variableType = 'text';
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingVariable = null;
    this.clearForm();
  }

  saveVariable(): void {
    if (!this.variableName.trim()) {
      alert('El nombre es requerido');
      return;
    }

    if (!this.variableValue.trim()) {
      alert('El valor es requerido');
      return;
    }

    if (!this.variableType) {
      alert('Seleccione un tipo');
      return;
    }

    const variableData: VariableCreateDto = {
      name: this.variableName.trim(),
      value: this.variableValue.trim(),
      type: this.variableType
    };

    if (this.editingVariable) {
      // PUT 
      this.variableService.updateVariable(this.editingVariable.id, variableData).subscribe({
        next: () => {
          this.loadVariables();
          this.cancelForm();
          alert('Variable actualizada correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar variable', err);
          alert('Error al actualizar la variable');
        }
      });
    } else {
      // POST 
      this.variableService.createVariable(variableData).subscribe({
        next: () => {
          this.loadVariables();
          this.cancelForm();
          alert('Variable creada correctamente');
        },
        error: (err) => {
          console.error('Error al crear variable', err);
          alert('Error al crear la variable');
        }
      });
    }
  }

  deleteVariable(variable: Variable): void {
    if (confirm(`¿Está seguro de eliminar la variable "${variable.name}"?`)) {
      this.variableService.deleteVariable(variable.id).subscribe({
        next: () => {
          this.loadVariables();
          alert('Variable eliminada correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar variable', err);
          alert('Error al eliminar la variable');
        }
      });
    }
  }
}