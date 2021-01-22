import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { map } from "rxjs/operators";
import { action } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";
import { prompt, confirm } from "@nativescript/core";

@Component({
    selector: "ns-projects",
    templateUrl: "./projects.component.html",
})
export class ProjectsComponent implements OnInit {
    baseUrl: string = "http://localhost:5000/api/";
    selectedUser = null;
    projects = [];

    constructor(
        private http: HttpClient,
        private userService: UserService,
        private router: RouterExtensions
    ) {
        this.selectedUser = this.userService.getSelectedUser();
    }

    ngOnInit(): void {
        this.getProjects();
    }

    getProjects() {
        const obs = this.http
            .get<any>(this.baseUrl + "project")
            .pipe(
                map((result) =>result.filter((r) => r.userId == this.userService.getSelectedUser().id)),
            );
        obs.subscribe(
            (result) => {
                console.log('result :', result.length);
                this.projects = result;
            },
            (error) => console.error(error)
        );

        return obs;
    }

    async openAddModal() {
        const projectName = await prompt("Enter project name");

        const project = {
          name: projectName.text,
          userId: this.userService.getSelectedUser().id,
        };

        this.http.post<any>(this.baseUrl + `project`, project).subscribe(
          (result) => {
              console.log("jup")
            this.getProjects().subscribe();
          },
          (error) => console.error(error)
        );
      }

      async delete(project) {
        if (!await confirm("Delete ?")) {
          return;
        }

        this.http.delete<any>(this.baseUrl + `project?key=${project.id}`).subscribe(
          (result) => {
            console.log('result :', result);
            this.projects = this.projects.filter((x) => x.id !== project.id);
          },
          (error) => console.error(error)
        );
      }

    switchUser() {
        let options = {
            title: "Race selection",
            message: "Choose your race",
            cancelButtonText: "Cancel",
            actions: ["Chris Vietor", "Kai Gerken"]
        };

        action(options).then((result) => {
            const newUser = this.userService.users.find(u => u.name === result);
            this.userService.selectUser(newUser);
            this.selectedUser = newUser;
        });
    }

    editProject(project) {
        this.router.navigate(['/project', project.id]);
    }
}
