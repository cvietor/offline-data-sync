import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class UserService {
    users = [
        {
            id: "1",
            name: "Chris Vietor",
        },
        {
            id: "2",
            name: "Kai Gerken",
        },
    ];

    private selectedUser = null;

    constructor() {}

    selectUser(user) {
        this.selectedUser = user;
    }

    getSelectedUser() {
        return this.selectedUser || this.users[0];
    }
}
