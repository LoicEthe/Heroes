import { Injectable } from '@angular/core';
import { HeroI } from './hero-i';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap }from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

/* la plupart du temps un service propose
 le CRUD sur des données (API)
 - lire la liste des données
 - récupérer une donnée
 - modifier une donnée
 - ajouter une donnée
 - supprimer une donnée */

export class HeroService {

  // url de l'api
  private heroUrl = "http://localhost:3000/heroes";
  httpOptions = {
    headers : new HttpHeaders({ 'Content-Type' : 'application/json' })
  };

  // injection du service message + http dans le service Hero
  constructor(private messageService: MessageService,
              private http: HttpClient) { }

  getHeroes(): Observable<HeroI[]> {
    // return HEROES;
    const heroes = of(HEROES);
    this.log("fetched heroes");
    // return heroes;
    return this.http.get<HeroI[]>(this.heroUrl)
    .pipe(
      tap( _ => this.log('fetched heroes')),
      catchError(this.handleError<HeroI[]>("getHeroes",[]))
    );
  }

  // récupération d'un Hero en fonction de son id
  getHero(id: Number): Observable<HeroI> {
    // const hero = HEROES.find(h => h.id === id)!;
    const url = `${this.heroUrl}/${id}`;
    /*this.log(`fetched hero id=${id}`);
    return of(hero);*/
    return this.http.get<HeroI>(url)
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<HeroI>(`getHero id=${id}`))
      )
  }

  /* ajout d'un Hero dans l'API (méthode POST) */
  addHero(hero: HeroI): Observable<HeroI>{
    return this.http.post<HeroI>(this.heroUrl, hero, this.httpOptions)
    .pipe(
      tap((newHero: HeroI) => this.log(`added Hero w/ id=${newHero.id}`)),
      catchError(this.handleError<HeroI>('addHero'))
    );
  }

  /** mise a jour d'un Hero dans l'API (methode PUT) */
  updateHero(hero: HeroI) : Observable<any> {
    return this.http.put(`${this.heroUrl}/${hero.id}`, hero, this.httpOptions)
    .pipe(
      tap(_ => this.log(`update hero id ${hero.id}`)),
      catchError(this.handleError<any>(`updateHero`))
    );
  }

  searchHero(term : string): Observable<HeroI[]>{
    // si vide retourner tableau vide
    if(!term.trim()){
      return of([]);
    }
    return this.http.get<HeroI[]>(`${this.heroUrl}/?q=${term}`)
    .pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`):
        this.log(`no heroes matching "${term}"`)),
        catchError(this.handleError<HeroI[]>('searchHeroes',[]))
    );
  }

  /* suppression d'un Hero dans l'API (methode Delete) */
  deleteHero(id: Number): Observable<HeroI> {
    const url = `${this.heroUrl}/${id}`;
    return this.http.delete<HeroI>(url, this.httpOptions)
    .pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<HeroI>(`deleteHero`))
    )
  }

  private log(msg: string){
    this.messageService.add(`HeroService: ${msg}`);
  }

  /**gere une opération en echec et laisse l'application continuer
   * @param operation - nom de l'operation en echec
   * @param result - valeur optionnelle à retourner à l'observable
   */
  private handleError<T>(operation = "operation", result?: T){
    return (error: any): Observable<T> => {
      // affichage de l'erreur dans la console
      console.log(error);

      // log de l'erreur sur la page
      this.log(`${operation} failed: ${error.message}`);

      // on continue l'appli en retournant un résultat vide
      return of(result as T)
    }
  }
}
