import { Role } from '../../models/role.model';
import { RoleService } from '../../services/role/role.service';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleCreateDto } from '../../models/role-create.dto';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, CommonModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {
  //displayed columns para los header de la tabla
  displayedColumns: string[] = ['id', 'name'];
  dataSource: Role[] = [];
  showForm = false;
  editingRole: Role | null = null;

  roleName = '';

  constructor(
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (roles) => this.dataSource = roles,
      error: (err) => {
        console.error('Error al obtener roles', err);
        alert('Error al cargar los roles');
      }
    });
  }
  showAddForm(): void {
    this.showForm = true;
    this.editingRole = null;
    this.clearForm();
  }

  showEditForm(role: Role): void {
    this.showForm = true;
    this.editingRole = role;
    this.roleName = role.name;
  }

  clearForm(): void {
    this.roleName = '';
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingRole = null;
    this.clearForm();
  }

  saveRole(): void {
    if (!this.roleName.trim()) {
      alert('El nombre del rol es obligatorio');
      return;
    }

    const roleData:RoleCreateDto = { name: this.roleName.trim() };

    //PUT
    if (this.editingRole) {
      this.roleService.updateRole(this.editingRole.id, roleData).subscribe({
        next: () => {
          this.loadRoles();
          this.cancelForm();
        },
        error: (err) => {
          console.error('Error al actualizar el rol', err);
          alert('Error al actualizar el rol');
        }
      });
    } else {
      //POST
      this.roleService.createRole(roleData).subscribe({
        next: () => {
          this.loadRoles();
          this.cancelForm();
        },
        error: (err) => {
          console.error('Error al crear el rol', err);
          alert('Error al crear el rol');
        }
      });
    }
  }

  deleteRole(role: Role): void {
    if (confirm(`¿Estás seguro de eliminar el rol "${role.name}"?`)) {
      this.roleService.deleteRole(role.id).subscribe({
        next: () => {
          this.loadRoles();
        },
        error: (err) => {
          console.error('Error al eliminar el rol', err);
          alert('Error al eliminar el rol');
        }
      });
    }
  }
}
