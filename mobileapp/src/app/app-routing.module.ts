import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { ProjectsComponent } from "./projects/projects.component";

const routes: Routes = [
    { path: "", redirectTo: "/projects", pathMatch: "full" },
    { path: "projects", component: ProjectsComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
