import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { RoleService } from '../../services/role/role.service';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    CommonModule, 
    ReactiveFormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
  dataSource: User[] = [];
  roles: Role[] = [];
  showForm = false;
  editingUser: User | null = null;
  
  userForm: FormGroup;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) // Solo letras y espacios
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      roleId: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => this.dataSource = users,
      error: (err) => console.error('Error al obtener usuarios', err)
    });
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (roles) => this.roles = roles,
      error: (err) => console.error('Error al obtener roles', err)
    });
  }

  showAddForm(): void {
    this.showForm = true;
    this.editingUser = null;
    this.userForm.reset();
  }

  showEditForm(user: User): void {
    this.showForm = true;
    this.editingUser = user;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      roleId: user.role.id
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingUser = null;
    this.userForm.reset({
      name: '',
      email: '',
      roleId: 0
    });
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.showValidationErrors();
      return;
    }

    const formValue = this.userForm.value;
    const userData = {
      name: formValue.name.trim(),
      email: formValue.email.trim(),
      roleId: Number(formValue.roleId)
    };

    if (this.editingUser) {
      // PUT
      this.userService.updateUser(this.editingUser.id, userData).subscribe({
        next: () => {
          this.loadUsers();
          this.cancelForm();
          alert('Usuario actualizado correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar usuario', err);
          alert('Error al actualizar usuario');
        }
      });
    } else {
      // POST
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.loadUsers();
          this.cancelForm();
          alert('Usuario creado correctamente');
        },
        error: (err) => {
          console.error('Error al crear usuario', err);
          alert('Error al crear usuario');
        }
      });
    }
  }

  // Método para mostrar errores de validación
  private showValidationErrors(): void {
    const errors: string[] = [];
    
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control?.errors) {
        const fieldName = this.getFieldLabel(key);
        const errorMessage = this.getFieldError(key);
        if (errorMessage) {
          errors.push(errorMessage);
        }
      }
    });

    if (errors.length > 0) {
      alert('Errores de validación:\n\n' + errors.join('\n'));
    }
  }

  deleteUser(user: User): void {
    if (confirm(`¿Está seguro de eliminar al usuario ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
          alert('Usuario eliminado correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar usuario', err);
          alert('Error al eliminar usuario');
        }
      });
    }
  }

  // Métodos auxiliares para mostrar errores
  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `${this.getFieldLabel(fieldName)} no puede exceder ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['email']) return 'Ingrese un email válido';
      if (field.errors['pattern']) return `${this.getFieldLabel(fieldName)} contiene caracteres no válidos`;
      if (field.errors['min']) return 'Debe seleccionar un rol válido';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'name': 'El nombre',
      'email': 'El email',
      'roleId': 'El rol'
    };
    return labels[fieldName] || fieldName;
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field?.errors && field.touched);
  }

  // Getters para usar en el template (mantener compatibilidad)
  get userName(): string {
    return this.userForm.get('name')?.value || '';
  }

  set userName(value: string) {
    this.userForm.get('name')?.setValue(value);
  }

  get userEmail(): string {
    return this.userForm.get('email')?.value || '';
  }

  set userEmail(value: string) {
    this.userForm.get('email')?.setValue(value);
  }

  get userRoleId(): number {
    return this.userForm.get('roleId')?.value || 0;
  }

  set userRoleId(value: number) {
    this.userForm.get('roleId')?.setValue(value);
  }
}