import { Routes } from "@angular/router";
import { AddAssignmentComponent } from "./assignments/add-assignment/add-assignment.component";
import { AssignmentDetailComponent } from "./assignments/assignment-detail/assignment-detail.component";
import { AssignmentsComponent } from "./assignments/assignments.component";
import { EditAssignmentComponent } from "./assignments/edit-assignment/edit-assignment.component";
import { AuthGuard } from "./shared/auth.guard";

const routes:Routes = [
  {
    path:"",
    component:AssignmentsComponent
  },
  {
    path:"home",
    component:AssignmentsComponent
  },
  {
    path:"add",
    component:AddAssignmentComponent
  },
  {
    path:"assignment/:id",
    component:AssignmentDetailComponent
  },
  {
    path:"assignment/:id/edit",
    component:EditAssignmentComponent,
    canActivate: [AuthGuard]
  },
  // appelé lorsque aucune route n'a matché...
  {
    path: '**',
    redirectTo: '/not-found.html'
  }
]

export {routes}
