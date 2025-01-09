import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Hamburguer } from '../../../../interfaces/hamburguer.interface';
import { combineLatest, Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Extra } from '../../../../interfaces/extra.interface';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-hamburguer',
  standalone: true,
  imports: [CommonModule, AsyncPipe, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: /*html*/
    `
  <div class="p-4 max-w-md mx-auto pb-24">
    <!-- Loading State -->
    <div *ngIf="(loading$ | async)" class="flex justify-center items-center min-h-[50vh]">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div>
    </div>

    <!-- Product List -->
    <div *ngIf="!(loading$ | async)">
        <div
      *ngFor="let product of products$ | async"
      (click)="openProductDetail(product)"
      class="rounded-3xl bg-white p-6 shadow-md hover:shadow-xl transition-shadow cursor-pointer mb-4"
    >
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-sm font-semibold">
            {{ product.name }} (Bs. {{ product.price }})
          </h3>
          <p class="text-gray-600 mt-1 font-light text-xs">
            {{ product.ingredients }}
          </p>
        </div>
        <div class="text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
    </div>
    <!-- Product Detail Modal -->
    <div
      *ngIf="selectedProduct"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl w-full max-w-md relative max-h-[90vh] flex flex-col">
        <!-- Close button -->
        <button
          (click)="closeProductDetail()"
          class="absolute right-6 top-6 text-gray-500 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Product Image (Fixed) -->
        <div class="flex-none">
          <img
            [src]="selectedProduct.img"
            [alt]="selectedProduct.name"
            class="w-full h-auto object-cover rounded-t-xl"
          />
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-6">
            <h2 class="text-xl font-bold">
              {{ selectedProduct.name }} ({{ selectedProduct.price }} Bs.)
            </h2>
            <p class="text-gray-600 mt-2">{{ selectedProduct.ingredients }}</p>

            <!-- Quantity Controls -->
            <div class="flex items-center justify-between mt-6">
              <button
                (click)="decrementQuantity()"
                class="bg-yellow-400 w-10 h-10 rounded-lg flex items-center justify-center"
              >
                <span class="text-2xl">-</span>
              </button>
              <span class="text-xl font-bold">{{ quantity }}</span>
              <button
                (click)="incrementQuantity()"
                class="bg-yellow-400 w-10 h-10 rounded-lg flex items-center justify-center"
              >
                <span class="text-2xl">+</span>
              </button>
            </div>

            <!-- Extras Section -->
            <div class="mt-6">
              <h3 class="text-lg font-bold mb-4">Extras</h3>
              <div class="space-y-4">
                <div
                  *ngFor="let extra of extras$ | async"
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center">
                    <span class="text-sm">{{ extra.name }} (+{{ extra.price }} Bs.)</span>
                  </div>
                  <div class="flex items-center gap-2">
                      <button
                        (click)="decrementExtra(extra)"
                        class="bg-yellow-400 w-8 h-8 rounded-lg flex items-center justify-center"
                      >
                        -
                      </button>
                      <div class="w-8 text-center"> <!-- Added fixed width and center alignment -->
                        <span>{{ getExtraQuantity(extra) }}</span>
                      </div>
                      <button
                        (click)="incrementExtra(extra)"
                        class="bg-yellow-400 w-8 h-8 rounded-lg flex items-center justify-center"
                      >
                        +
                      </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Details/Notes -->
            <div class="mt-6">
              <h3 class="text-lg font-bold mb-2">Detalles</h3>
              <textarea
                class="w-full p-3 border rounded-lg"
                rows="3"
                placeholder="Instrucciones especiales..."
                [(ngModel)]="notes"
              ></textarea>
            </div>

            <!-- Add to Cart Button -->
            <button
              (click)="addToCart()"
              class="w-full bg-yellow-400 text-black font-bold py-3 rounded-full mt-6 mb-4 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cart Button -->
    <div class="fixed bottom-6 left-1/2 transform -translate-x-1/2">
      <button
        (click)="navigateToCart()"
        class="bg-yellow-400 text-black px-8 py-3 rounded-full shadow-lg flex items-center space-x-2 w-60 justify-around">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span class="font-bold">Ver carrito ({{ cartService.cartItems().length }})</span>
      </button>
    </div>
  </div>
  `,
})
export default class MenuHamburguerComponent {
  private router = inject(Router);
  private productService = inject(ProductService);
  public cartService = inject(CartService);

  loading$ = combineLatest([
    this.productService.getHamburguers(),
    this.productService.getExtras()
  ]).pipe(
    map(() => false),
    startWith(true)
  );

  products$: Observable<Hamburguer[]> = this.productService
    .getHamburguers()
    .pipe(map((response) => response.hamburguers));

  extras$: Observable<Extra[]> = this.productService
    .getExtras()
    .pipe(map((response) => response.extras));

  selectedProduct: Hamburguer | null = null;
  quantity: number = 1;
  selectedExtras: Map<string, number> = new Map();
  notes: string = '';

  navigateToCart() {
    const urlSegments = this.router.url.split('/');
    // Get the first segment after the initial slash
    const firstSegment = urlSegments[1] || '';
    this.router.navigate(['/cart'], {
      queryParams: { source: firstSegment }
    });
  }

  openProductDetail(product: Hamburguer) {
    this.selectedProduct = product;
    this.quantity = 1;
    this.selectedExtras.clear();
    this.notes = '';
  }

  closeProductDetail() {
    this.selectedProduct = null;
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) this.quantity--;
  }

  incrementExtra(extra: Extra) {
    const current = this.selectedExtras.get(extra.name) || 0;
    this.selectedExtras.set(extra.name, current + 1);
  }

  decrementExtra(extra: Extra) {
    const current = this.selectedExtras.get(extra.name) || 0;
    if (current > 0) {
      this.selectedExtras.set(extra.name, current - 1);
    }
  }

  getExtraQuantity(extra: Extra): number {
    return this.selectedExtras.get(extra.name) || 0;
  }

  addToCart() {
    if (!this.selectedProduct) return;

    combineLatest([this.extras$])
      .pipe(
        map(([extras]) => {
          return Array.from(this.selectedExtras.entries())
            .filter(([_, quantity]) => quantity > 0)
            .map(([name, quantity]) => {
              const extra = extras.find((e: Extra) => e.name === name);
              return {
                name,
                price: extra?.price ?? 0,
                quantity
              };
            });
        })
      )
      .subscribe(extras => {
        this.cartService.addToCart({
          id: '',
          name: this.selectedProduct!.name,
          price: this.selectedProduct!.price,
          quantity: this.quantity,
          notes: this.notes,
          extras: extras.length > 0 ? extras : undefined,
          type: 'hamburguer'
        });

        this.closeProductDetail();
      });
  }
}
