import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: string[] = [];

  constructor() { }

  //  ajout d'un message dans la liste
  // push() permet d'ajouter un élément dans un tableau
  add(message: string){
    this.messages.push(message);
  }

  // mettoyage, on recrée un tableau vide
  clear()
  {
    this.messages = [];
  }

}
