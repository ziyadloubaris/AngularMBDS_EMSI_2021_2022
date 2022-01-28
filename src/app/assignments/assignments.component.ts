import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator !: MatPaginator;
  couleur = 'orange';
  ajoutActive = false;
  isEditMode = false;
  displayedColumns: string[] = ['id', 'nom', 'date-rendu', 'rendu','delete','edit'];

  assignments: Assignment[] = [];
  // slider pour changer la limite
  sliderLimit:number=20;

  @ViewChild('assignmentForm', { static: false })
  assignmentForm !: NgForm;

  assignmentData !: Assignment;

  nomAssignment?: string;
  dateDeRendu?: Date;

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
    this.dataSource.paginator = this.paginator;
    this.getAssignments(this.limit);
    this.nomAssignment = this.assignmentData?.nom;
    this.dateDeRendu = this.assignmentData?.dateDeRendu;

  }

  getAssignments(sliderLimit:number) {
    this.assignmentsService.getAssignments(sliderLimit).subscribe((response: any) => {
      this.dataSource.data = response.docs;
    });
    // this.assignmentsService.getAssignmentsPagine(this.page, this.limit).subscribe((data) => {
    //   this.assignments = data.docs;
    //   this.page = data.page;
    //    this.limit = data.limit;
    //    this.totalDocs = data.totalDocs;
    //    this.totalPages = data.totalPages;
    //    this.hasPrevPage = data.hasPrevPage;
    //    this.prevPage = data.prevPage;
    //    this.hasNextPage = data.hasNextPage;
    //    this.nextPage = data.nextPage;
    //    console.log("données reçues");
    // });
  }

  changeLimit() {
    console.log("change limit")
    this.limit = this.sliderLimit;
    this.getAssignments(this.limit);
  }

  pagePrecedente() {
      this.page = this.prevPage ;
      this.getAssignments(this.sliderLimit);
  }

  pageSuivante() {
      this.page = this.nextPage ;
      this.getAssignments(this.sliderLimit);
  }

  dernierePage() {
    this.page = this.totalPages;
    this.getAssignments(this.sliderLimit);
  }

  premierePage() {
    this.page = 1;
    this.getAssignments(this.sliderLimit);
  }

  isAdmin() {
    return this.authService.loggedIn;
  }

  onDelete(assignment:Assignment) {
    if (this.isAdmin()) {
      
      console.log(assignment);
      this.assignmentsService
          .deleteAssignment(assignment)
          .subscribe((reponse) => {
            console.log(reponse.message);
            this.getAssignments(this.sliderLimit);
  
          });
    }
     
  }
 
  onEditing(assignment:Assignment){
    if (this.isAdmin()) {
      this.assignmentData = assignment;
      this.nomAssignment = this.assignmentData?.nom;
      this.dateDeRendu = this.assignmentData?.dateDeRendu;
      this.isEditMode= !this.isEditMode;
      console.log(this.isEditMode);
      console.log(assignment);
    }
    
  }
  
  onSubmit() {
    if (this.assignmentForm.form.valid) {
      if (this.isEditMode){
        if (!this.assignmentData) return;

        if (this.nomAssignment) {
          this.assignmentData.nom = this.nomAssignment;
        }
    
        if (this.dateDeRendu) {
          this.assignmentData.dateDeRendu = this.dateDeRendu;
        }
        this.assignmentsService
          .updateAssignment(this.assignmentData)
          .subscribe((reponse) => {
            console.log(reponse.message);
            this.getAssignments(this.limit);
          });
      }
      else{ 
        console.log('nom = ' + this.nomAssignment);
        console.log('date = ' + this.dateDeRendu);
    
        let newAssignement = new Assignment();
    
        if (this.nomAssignment && this.dateDeRendu) {
          newAssignement.nom = this.nomAssignment;
          newAssignement.dateDeRendu = this.dateDeRendu;
          newAssignement.rendu = false;
          newAssignement.id = Math.round(Math.random()*10000000);
    
          this.assignmentsService.addAssignment(newAssignement)
          .subscribe(reponse => {
            console.log(reponse.message);
            this.getAssignments(++this.limit);
            this.assignmentForm.resetForm();

          })
        }
        // this.assignmentsService.addAssignment(this.assignmentData)
          
      }
    } else {
      console.log('Enter des donnée valide !');
    }
  }
  cancelEdit() {
    this.isEditMode = false;
    this.assignmentForm.resetForm();
  }
}
