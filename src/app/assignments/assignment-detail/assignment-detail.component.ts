import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Assignment } from '../assignment.model';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css'],
})
export class AssignmentDetailComponent implements OnInit {
  assignmentTransmis?: Assignment;

  constructor(
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // on va récupérer l'id de l'assignment dans l'URL...
    // + force la conversion de string vers number
    let id: number = +this.route.snapshot.params['id'];

    console.log('DANS COMPOSANT DETAIL id = ' + id);

    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      this.assignmentTransmis = assignment;
    });
  }

  onAssignmentRendu() {
    if (this.assignmentTransmis) this.assignmentTransmis.rendu = true;

    this.assignmentsService
      .updateAssignment(this.assignmentTransmis)
      .subscribe((reponse) => {
        console.log(reponse.message);

        // on revient à la page d'accueil
        this.router.navigate(['/home']);
      });
  }

  onDelete() {
    if (this.assignmentTransmis) {
      this.assignmentsService
        .deleteAssignment(this.assignmentTransmis)
        .subscribe((reponse) => {
          console.log(reponse.message);
          // on retourne à la page d'accueil APRES qu'on soit sur
          // que la suppression ait bien été effectuée
          this.router.navigate(['/home']);
        });
      // on cache l'affichage du detail puisqu'il a été supprimé
      this.assignmentTransmis = undefined;
    }
  }

  onClickEdit() {
    this.router.navigate(['/assignment', this.assignmentTransmis?.id, 'edit'], {
      queryParams: {
        nom: 'TOTO',
        prenom: 'TITI',
        age: 50,
      },
      fragment: 'edit',
    });
  }

  isAdmin() {
    return this.authService.loggedIn;
  }
}
