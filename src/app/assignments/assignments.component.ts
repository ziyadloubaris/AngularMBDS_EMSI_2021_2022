import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ignoreElements } from 'rxjs';
import { AssignmentsService } from '../shared/assignments.service';
import { AuthService } from '../shared/auth.service';
import { Assignment } from './assignment.model';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit {
  couleur = 'orange';
  ajoutActive = false;
  editing = false;
  displayedColumns: string[] = ['id', 'nom', 'date-rendu', 'rendu','delete','edit'];

  assignments: Assignment[] = [];
  // slider pour changer la limite
  sliderLimit:number=200;

  // Pour pagination
  page: number = 1;
  limit: number = 20;
  totalDocs:number=0;
  totalPages: number=0;
  hasPrevPage: boolean = false;
  prevPage: number = 0;
  hasNextPage: boolean=false;
  nextPage: number = 0;

  constructor(
      private assignmentsService: AssignmentsService, 
      private authService: AuthService,

      ) {}

  ngOnInit(): void {
    console.log('Appelé avant affichage');
    // appelée avant l'affichage du composant
    // on demande les donnnées au service de gestion des assignments

    this.getAssignments();

  }

  getAssignments() {
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit).subscribe((data) => {
      this.assignments = data.docs;
      this.page = data.page;
       this.limit = data.limit;
       this.totalDocs = data.totalDocs;
       this.totalPages = data.totalPages;
       this.hasPrevPage = data.hasPrevPage;
       this.prevPage = data.prevPage;
       this.hasNextPage = data.hasNextPage;
       this.nextPage = data.nextPage;
       console.log("données reçues");
    });
  }

  changeLimit() {
    console.log("change limit")
    this.limit = this.sliderLimit;
    this.getAssignments();
  }

  pagePrecedente() {
      this.page = this.prevPage ;
      this.getAssignments();
  }

  pageSuivante() {
      this.page = this.nextPage ;
      this.getAssignments();
  }

  dernierePage() {
    this.page = this.totalPages;
    this.getAssignments();
  }

  premierePage() {
    this.page = 1;
    this.getAssignments();
  }
  onDelete(assignment:Assignment) {
    console.log(assignment);
    this.assignmentsService
        .deleteAssignment(assignment)
        .subscribe((reponse) => {
          console.log(reponse.message);
          this.getAssignments();

        });
     
  }
  isAdmin() {
    return this.authService.loggedIn;
  }
  onEditing(){
    this.editing= !this.editing;
    console.log(this.editing);
  }
}
