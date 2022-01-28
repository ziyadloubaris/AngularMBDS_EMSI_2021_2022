import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from './shared/assignments.service';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  titre = 'Application de gestion des assignments';

  constructor(private authService:AuthService,
              private assignmentsService:AssignmentsService,
              private router:Router) {}

  loginLogout() {
    if(this.authService.loggedIn) {
      this.authService.logOut();
    } else {
      this.authService.logIn();
    }
  }

  genererDonneesDeTest() {
    this.assignmentsService.peuplerBDAvecForkJoin()
    .subscribe(() => {
      // ok, les 1000 données ont bien été insérées...
      console.log("TOUTES LES DONNEES ONT BIEN ETE INSEREES");

      this.router.navigate(["/home"]);
    });
  }
}
