import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor() { }

  log(nomAssignment:string, action:string) {
    // par exemple, affiche dans la console
    // "DEVOIR Mr BUFFA Angular supprimé"
    // action = supprimé, ajouté, modifé, etc.

    // identique à console.log(nomAssignment + " " + action)
    console.log(`LOGGIN SERVICE : ${nomAssignment} ${action}`);
  }
}
