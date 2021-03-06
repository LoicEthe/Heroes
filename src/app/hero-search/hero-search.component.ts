import { Component, OnInit } from '@angular/core';
import { Observable,Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap  } from 'rxjs/operators';
import { HeroI } from '../hero-i';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {

  heroes$!: Observable<HeroI[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService : HeroService) { }

  // search : ajoute le terme recherche dans le flux de l'observateur
  search(term : string): void {
    this.searchTerms.next(term)
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term :  string) => this.heroService.searchHero(term))
    )
  }

}
