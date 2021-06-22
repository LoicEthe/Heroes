import { Component, OnInit } from '@angular/core';
import { HeroI } from '../hero-i';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {

  // hero: HeroI = {
  //   id : 1,
  //   name :"Windstorm"
  // }

  // toujours mettre le ? s'il n'est pas défini. (vide) valeur sur le click
  // selectedHero?: HeroI;

  heroes: HeroI[] = [];

  constructor(private HeroService: HeroService,
              private messageService : MessageService) { }

  // onSelect(hero:HeroI): void{
  //   this.selectedHero = hero;
  //   this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  // }
  delete(hero : HeroI) :void {
    this.heroes = this.heroes.filter(h => h ! == hero);
    this.HeroService.deleteHero(hero.id).subscribe();
  }

  add(name: string) : void{
     name = name.trim(); //suppression des espaces avant et après
     if(!name){
       return;
     }
     this.HeroService.addHero({name} as HeroI).subscribe((hero) => {this.heroes.push(hero)});
  }

  ngOnInit(): void {
    this.HeroService.getHeroes().subscribe((heroes) => { this.heroes = heroes });
  }


}
