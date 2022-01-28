import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css'],
})
export class EditAssignmentComponent implements OnInit {
  assignment?: Assignment;
  // champs du formulaire
  nomAssignment?: string;
  dateDeRendu?: Date;

  constructor(
    private activatedRoute: ActivatedRoute,
    private assignmentsService: AssignmentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // exemple de récupération des paramètres situés après le ?
    // ce sont des "queryParams"
    console.log("Query params : ")
    console.log(this.activatedRoute.snapshot.queryParams);
    // et pour le fragment après le #...
    console.log("Fragment : ");
    console.log(this.activatedRoute.snapshot.fragment);

    const id = +this.activatedRoute.snapshot.params['id'];

    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      this.assignment = assignment;
      this.nomAssignment = assignment?.nom;
      this.dateDeRendu = assignment?.dateDeRendu;
    });
  }

  onSaveAssignment() {
    if (!this.assignment) return;

    if (this.nomAssignment) {
      this.assignment.nom = this.nomAssignment;
    }

    if (this.dateDeRendu) {
      this.assignment.dateDeRendu = this.dateDeRendu;
    }
    this.assignmentsService
      .updateAssignment(this.assignment)
      .subscribe((reponse) => {
        console.log(reponse.message);

        // navigation vers la home page
        this.router.navigate(['/home']);
      });
  }
}
// toto
