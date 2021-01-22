import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  selectedUser = null;

  users = [{
    id: "1",
    name: "Chris Vietor"
  },{
    id: "2",
    name: "Kai Gerken"
  }];

  constructor(private userService: UserService) {
    this.selectedUser = this.userService.getSelectedUser() || this.users[0];
    this.selectUser(this.selectedUser);
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  selectUser(user) {
    this.userService.selectUser(user);
  }
}
