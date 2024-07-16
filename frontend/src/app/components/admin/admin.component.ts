import { Component } from '@angular/core';

interface User {
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  users: User[] = [
    { name: 'Usuario 1', email: 'usuario1@ejemplo.com', password: '********' },
    { name: 'Usuario 2', email: 'usuario2@ejemplo.com', password: '********' },
    { name: 'Usuario 3', email: 'usuario3@ejemplo.com', password: '********' }
  ];

  editUser(user: User) {
    console.log('Editar usuario:', user);
  }

  deleteUser(user: User) {
    console.log('Eliminar usuario:', user);
    this.users = this.users.filter(u => u !== user); 
  }
}
