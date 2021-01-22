import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { map } from "rxjs/operators";
import { UserService } from "../user.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
  projects = [];

  constructor(
    private http: HttpClient,
    @Inject("BASE_URL") private baseUrl: string,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getProjects().subscribe(
      (result) => {},
      (error) => console.error(error)
    );
  }

  getProjects() {
    const obs = this.http
      .get<any>(this.baseUrl + "project")
      .pipe(
        map((result) =>
          result.filter(
            (r) => r.userId == this.userService.getSelectedUser().id
          )
        )
      );
    obs.subscribe(
      (result) => {
        console.log("getProjects::", result);
        this.projects = result;
      },
      (error) => console.error(error)
    );

    return obs;
  }

  openAddModal() {
    const projectName = prompt("Enter project name");

    const project = {
      name: projectName,
      userId: this.userService.getSelectedUser().id,
    };

    this.http.post<any>(this.baseUrl + `project`, project).subscribe(
      (result) => this.getProjects(),
      (error) => console.error(error)
    );
  }

  delete(project) {
    if (!confirm("Delete ?")) {
      return;
    }

    this.http.delete<any>(this.baseUrl + `project?key=${project.id}`).subscribe(
      (result) => {
        this.projects = this.projects.filter((x) => x.id !== project.id);
      },
      (error) => console.error(error)
    );
  }
}
