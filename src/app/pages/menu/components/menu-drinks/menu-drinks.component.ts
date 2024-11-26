import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { map, Observable } from 'rxjs';
import { Drink } from '../../../../interfaces/drink.interface';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-drinks',
  standalone: true,
  imports: [CommonModule, AsyncPipe, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: /*html*/
  `
  <div class="p-4 max-w-md mx-auto pb-24">
    <!-- Product List -->
    <div
      *ngFor="let product of products$ | async"
      (click)="openProductDetail(product)"
      class="rounded-3xl bg-white p-6 shadow-md hover:shadow-xl transition-shadow cursor-pointer mb-4"
    >
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-sm font-semibold">
            {{ product.name }} ({{ product.price }} Bs.)
          </h3>
          <p class="text-gray-600 mt-1 font-light text-xs">
            {{ product.size }}
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
            <p class="text-gray-600 mt-2">{{ selectedProduct.size }}</p>

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
export default class MenuDrinksComponent {
  private productService = inject(ProductService);
  public cartService = inject(CartService);
  private router = inject(Router);

  products$: Observable<Drink[]> = this.productService.getDrinks()
  .pipe(
    map(response => response.drinks)
  );

  selectedProduct: Drink | null = null;
  quantity: number = 1;

  navigateToCart() {
    const urlSegments = this.router.url.split('/');
    // Get the first segment after the initial slash
    const firstSegment = urlSegments[1] || '';
    this.router.navigate(['/cart'], { 
      queryParams: { source: firstSegment }
    });
  }

  openProductDetail(product: Drink) {
    this.selectedProduct = product;
    this.quantity = 1;
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

  addToCart() {
    if (!this.selectedProduct) return;
  
    this.cartService.addToCart({
      id: '', // Will be set by service
      name: this.selectedProduct.name,
      price: this.selectedProduct.price,
      quantity: this.quantity,
      type: 'drink' // or 'snack' or 'dessert'
    });
  
    this.closeProductDetail();
  }
}
