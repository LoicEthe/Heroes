import { Component, Input, OnInit } from '@angular/core';
import { HeroI } from '../hero-i';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})
export class HeroDetailComponent implements OnInit {

  // @Input() hero?: HeroI;
  hero: HeroI | undefined;

  constructor(private route: ActivatedRoute,
              private heroService: HeroService,
              private location: Location) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void{
    // récupération du paramètre id dans la route
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id).subscribe((hero) => {
      this.hero = hero
    })
  }

  goBack() : void{
    // retour en arrière dans l'historique
    this.location.back();

  }

  save() : void{
    if(this.hero){
      this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
    }
  }

}
