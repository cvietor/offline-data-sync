import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { map, switchMap } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { prompt } from "@nativescript/core";

@Component({
    selector: "ns-project",
    templateUrl: "./project.component.html",
    styleUrls: ["./project.component.css"],
})
export class ProjectComponent implements OnInit {
    baseUrl: string = "http://localhost:5000/api/";
    selectedUser = null;
    project = null;
    id;

    constructor(
        private http: HttpClient,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: RouterExtensions
    ) {
        this.selectedUser = this.userService.getSelectedUser();
    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.id = params["id"];
            this.getProject(this.id).subscribe((pro) => {
                this.project = pro;
            });
        });
    }

    getProject(id) {
        const obs = this.http.get<any>(this.baseUrl + "project/" + id);

        obs.subscribe(
            (result) => {
                console.log("getProject::", result);
                this.project = result;
            },
            (error) => console.error(error)
        );

        return obs;
    }

    async addFlight() {
        const flightNr = await prompt("Enter flight nr");

        const flight = {
            flightNr: flightNr.text,
            userId: this.userService.getSelectedUser().id,
        };

        const flights = [...(this.project.flights || []), flight];
        console.log('flights :', flights);

        this.project.flights = flights;
        console.log('this.project :', this.project);
        this.patchProject(this.project).subscribe(console.log);
    }

    updateProject(project) {
        this.patchProject(project).subscribe(() => {
            this.router.navigate(["/"]);
        });
    }

    deleteFlight(flight) {
        this.project.flights = this.project.flights.filter((x) => x.flightNr !== flight.flightNr);
        console.log('flights :', this.project.flights);

        this.patchProject(this.project).subscribe(console.log);

    }

    patchProject(project) {
        return this.http.patch<any>(this.baseUrl + `project`, project).pipe(
            switchMap((r) => {
                console.log('r :', r);
                return this.getProject(this.id);
            }),
            map((p) => (this.project = p))
        );
    }
}
