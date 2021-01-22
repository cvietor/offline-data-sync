import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  projects = [];

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {

  }

  ngOnInit() {
    this.getProjects().subscribe(result => {
      this.projects = result;
    }, error => console.error(error));
  }

  getProjects() {
    const obs = this.http.get<any>(this.baseUrl + 'project');
    obs.subscribe(result => {
      console.log("getProjects::", result);
    }, error => console.error(error));

    return obs;
  }

  openAddModal() {
    const projectName = prompt("Enter project name");

    const project = {
      name: projectName
    };

    this.http.post<any>(this.baseUrl + `project`, project).subscribe(result => {
      this.getProjects().subscribe(result => {
        this.projects = result;
      });
    }, error => console.error(error));
  }

  delete(project) {
    if (!confirm("Delete ?")) {
      return;
    }

    this.http.delete<any>(this.baseUrl + `project?key=${project.id}`).subscribe(result => {
      this.projects = this.projects.filter(x => x.id !== project.id);
    }, error => console.error(error));
  }
}
