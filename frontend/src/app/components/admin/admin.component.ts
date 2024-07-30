import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  users: User[] = [];
  selectedUser: User | null = null; 


  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
      },
      error => {
        console.error('Error al cargar los usuarios', error);
      }
    );
  }

  editUser(user: User): void {
    this.selectedUser = { ...user }; // Crea una copia del usuario para editar
  }

  saveUser(): void {
    if (this.selectedUser && this.selectedUser._id) {
      this.userService.updateUser(this.selectedUser._id, this.selectedUser).subscribe(
        updatedUser => {
          this.users = this.users.map(user => user._id === updatedUser._id ? updatedUser : user);
          this.selectedUser = null; 
        },
        error => {
          console.error('Error al actualizar el usuario', error);
        }
      );
    }
  }

  deleteUser(user: User): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(user._id??'').subscribe(
        () => {
          this.users = this.users.filter(u => u._id !== user._id);
        },
        error => {
          console.error('Error al eliminar el usuario', error);
        }
      );
    }
  }
}
