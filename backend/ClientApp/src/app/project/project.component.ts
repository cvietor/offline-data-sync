import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from "rxjs/operators";
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  id: number;
  project;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    @Inject('BASE_URL') private baseUrl: string) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
       this.id = params['id'];
       this.getProject(this.id).subscribe((pro) => {
        this.project = pro;
       });
    });
  }

  getProject(id) {
    return this.http.get<any>(this.baseUrl + 'project/' + id);
  }

  updateProject(project) {
    this.patchProject(this.project).subscribe(() => {
      this.router.navigate(["/"]);
    });
  }

  addFlight() {
    const flightNr = prompt("Enter flight nr");

    const flight = {
      flightNr: flightNr
    };

    const flights = [...this.project.flights || [], flight];

    this.project.flights = flights;
    this.patchProject(this.project).subscribe(console.log);
  }

  patchProject(project) {
    return this.http.patch<any>(this.baseUrl + `project`, project).pipe(
      switchMap(r => {
        return this.getProject(this.id)
      }),
      map(p => this.project = p)
    );
  }
}
