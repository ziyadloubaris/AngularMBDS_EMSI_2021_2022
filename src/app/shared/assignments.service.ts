import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { Assignment } from '../assignments/assignment.model';
import { LoggingService } from './logging.service';
import { bdInitialAssignments } from './data';
@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  assignments:Assignment[] = [];

  constructor(private loggingService:LoggingService,
    private http:HttpClient) { }

    //url = 'http://localhost:8010/api/assignments';
    url = 'https://api-mbds-2021-2022.herokuapp.com/api/assignments';

  getAssignments(limit:number):Observable<Assignment[]> {
    //return of(this.assignments);

    return this.http.get<Assignment[]>(`${this.url}?&limit=${limit}`);
  }

  getAssignmentsPagine(page:number, limit:number):Observable<any> {
    //return of(this.assignments);

    return this.http.get<Assignment[]>(`${this.url}?page=${page}&limit=${limit}`);
  }

  getAssignment(id:number):Observable<Assignment|undefined> {
    //let a = this.assignments.find(elem => elem.id === id);

    //return of(a);

    return this.http.get<Assignment>(this.url + "/" + id);
  }

  addAssignment(assignment:Assignment):Observable<any> {
    //this.assignments.push(assignment);

    this.loggingService.log(assignment.nom, "ajouté");

    //return of("Assignment ajouté");

    return this.http.post(this.url, assignment);
  }

  updateAssignment(assignment:Assignment|undefined):Observable<any> {
    // ici on fait l'update, typiquement un appel http PUT
    // vers un web service qui fera un update dans une BD

    if(assignment)
      this.loggingService.log(assignment.nom, "ajouté");

    //return of("Assignment modifié");
    return this.http.put(this.url, assignment);
  }

  deleteAssignment(assignment:Assignment):Observable<any> {
    this.loggingService.log(assignment.nom, "supprimé");

    return this.http.delete(this.url + "/" + assignment._id);
  }

  // méthode qui marche mais on ne peut pas savoir quand
  // elle a vraiment fini d'insérer les données
  peuplerBD() {
    bdInitialAssignments.forEach(assignment => {
      const a = new Assignment();
      a.nom = assignment.nom;
      a.dateDeRendu = new Date(assignment.dateDeRendu);
      a.rendu = assignment.rendu;
      a.id = assignment.id;

      this.addAssignment(a)
      .subscribe(reponse => {
        console.log(reponse.message);
      });
    })
  }

  // Méthode qui permet de savoir quand on a bien inséré toutes
  // les données (elle renvoie un Observable)
  peuplerBDAvecForkJoin(): Observable<any> {
    const appelsVersAddAssignment:any = [];

    bdInitialAssignments.forEach((a) => {
      const nouvelAssignment = new Assignment();

      nouvelAssignment.id = a.id;
      nouvelAssignment.nom = a.nom;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;

      appelsVersAddAssignment.push(this.addAssignment(nouvelAssignment));
    });
    return forkJoin(appelsVersAddAssignment); // renvoie un seul Observable pour dire que c'est fini
  }

}
