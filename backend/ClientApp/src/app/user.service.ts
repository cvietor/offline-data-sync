import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private selectedUser = null;

  constructor() { }

  selectUser(user) {
    this.selectedUser = user;
  }

  getSelectedUser() {
    return this.selectedUser;
  }
}
