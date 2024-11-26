import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HamburguerResponse } from '../../../interfaces/hamburguer.interface';
import { DessertResponse } from '../../../interfaces/dessert.interface';
import { DrinkResponse } from '../../../interfaces/drink.interface';
import { ExtraResponse } from '../../../interfaces/extra.interface';
import { SnackResponse } from '../../../interfaces/snack.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  getDessert(): Observable<DessertResponse> {
    return this.http.get<DessertResponse>('data/dessert.json');
  }

  getDrinks(): Observable<DrinkResponse> {
    return this.http.get<DrinkResponse>('data/drinks.json');
  }

  getExtras(): Observable<ExtraResponse> {
    return this.http.get<ExtraResponse>('data/extras.json');
  }

  getHamburguers(): Observable<HamburguerResponse> {
    return this.http.get<HamburguerResponse>('data/hamburguers.json');
  }

  getSnacks(): Observable<SnackResponse> {
    return this.http.get<SnackResponse>('data/snacks.json');
  }
}
