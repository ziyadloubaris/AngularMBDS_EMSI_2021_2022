import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;

  constructor() { }

  logIn() {
    // dans la vraie vie, on devrait ici passer un login et un password
    // puis envoyer une requête sur un web service distant qui va
    // vérifier si login/password sont ok (dans une BD ou via le
    // service oAuth par exemple), et si ok, alors on met loggedIn à true
    // sinon on redirige vers la page de connexion avec un message d'erreur

    // nous on simplifie pour le moment.
    this.loggedIn = true;
  }

  logOut() {
    // typiquement : appelé par le bouton de deconnexion...
    this.loggedIn = false;
  }

  isAdmin() {
    // renvoie true ou false juste si on est connecté/deconnecté
    return new Promise((resolve, reject) => {
      resolve(this.loggedIn);
    });
  }
}
