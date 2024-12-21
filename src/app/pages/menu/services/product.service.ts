import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {EMPTY, map, Observable, switchMap} from 'rxjs';
import { Router } from '@angular/router';
import { environments } from '../../../../environments/environments';
import { ApiDessert, ApiDrink, ApiExtra, ApiHamburguer, ApiSnack, Dessert, DessertResponse, Drink, DrinkResponse, Extra, ExtraResponse, Hamburguer, HamburguerResponse, Snack, SnackResponse } from '../../../interfaces';
import {ScheduleService} from "./schedule.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private scheduleService = inject(ScheduleService);
  private readonly baseUrl = environments.testBaseUrl;

  private getCurrentBranch(): string {
    const url = this.router.url;
    return url.includes('headquarters') ? '1' : '2';
  }

  private filterByBranch<T extends { branch: string }>(items: T[]): T[] {
    const currentBranch = this.getCurrentBranch();
    return items.filter(item => item.branch === currentBranch);
  }

  private checkScheduleAndFilter<T>(observable: Observable<T>): Observable<T> {
    return this.scheduleService.getStatus().pipe(
      switchMap(isOpen => {
        if (!isOpen) {
          return EMPTY; // Or return empty array/object depending on your needs
        }
        return observable;
      })
    );
  }

  getDessert(): Observable<DessertResponse> {
    return this.http.get<ApiDessert[]>(`${this.baseUrl}/desserts`).pipe(
      map(apiDesserts => this.filterByBranch(apiDesserts)),
      map(apiDesserts => ({
        desserts: apiDesserts.map(apiDesserts => this.transformApiDessert(apiDesserts))
      }))
    );
  }

  getDrinks(): Observable<DrinkResponse> {
    return this.http.get<ApiDrink[]>(`${this.baseUrl}/drinks`).pipe(
      map(apiDrinks => this.filterByBranch(apiDrinks)),
      map(apiDrinks => ({
        drinks: apiDrinks.map(apiDrinks => this.transformApiDrink(apiDrinks))
      }))
    );
  }

  getExtras(): Observable<ExtraResponse> {
    return this.http.get<ApiExtra[]>(`${this.baseUrl}/extras`).pipe(
      map(apiExtras => this.filterByBranch(apiExtras)),
      map(apiExtras => ({
        extras: apiExtras.map(apiExtras => this.transformApiExtra(apiExtras))
      }))
    );
  }

  getHamburguers(): Observable<HamburguerResponse> {
    return this.http.get<ApiHamburguer[]>(`${this.baseUrl}/hamburguers`).pipe(
      map(apiHamburguers => this.filterByBranch(apiHamburguers)),
      map(apiHamburguers => ({
        hamburguers: apiHamburguers.map(apiHamburguer => this.transformApiHamburguer(apiHamburguer))
      }))
    );
  }

  getSnacks(): Observable<SnackResponse> {
    return this.http.get<ApiSnack[]>(`${this.baseUrl}/snacks`).pipe(
      map(apiSnacks => this.filterByBranch(apiSnacks)),
      map(apiSnacks => ({
        snacks: apiSnacks.map(apiSnacks => this.transformApiSnack(apiSnacks))
      }))
    );
  }

  private transformApiHamburguer(apiHamburguer: ApiHamburguer): Hamburguer {
    const imageFileName = apiHamburguer.img.split('/').pop();
    return {
      name: apiHamburguer.name,
      price: parseFloat(apiHamburguer.price),
      ingredients: apiHamburguer.ingredients,
      img: `${this.baseUrl}/hamburguers/file/${imageFileName}`
    };
  }

  private transformApiDessert(apiDessert: ApiDessert): Dessert {
    const imageFileName = apiDessert.img.split('/').pop();
    return {
      name: apiDessert.name,
      price: parseFloat(apiDessert.price),
      img: `${this.baseUrl}/desserts/file/${imageFileName}`
    };
  }

  private transformApiDrink(apiDrink: ApiDrink): Drink {
    const imageFileName = apiDrink.img.split('/').pop();
    return {
      name: apiDrink.name,
      price: parseFloat(apiDrink.price),
      size: apiDrink.size,
      img: `${this.baseUrl}/drinks/file/${imageFileName}`
    };
  }

  private transformApiSnack(apiSnack: ApiSnack): Snack {
    const imageFileName = apiSnack.img.split('/').pop();
    return {
      name: apiSnack.name,
      price: parseFloat(apiSnack.price),
      img: `${this.baseUrl}/snacks/file/${imageFileName}`
    };
  }

  private transformApiExtra(apiExtra: ApiExtra): Extra {
    return {
      name: apiExtra.name,
      price: parseFloat(apiExtra.price),
    };
  }
}
