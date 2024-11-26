import { Injectable, signal } from '@angular/core';
import { computed } from '@angular/core';
import { CartItem } from '../../../interfaces/cart.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart = signal<CartItem[]>([]);
  
  cartItems = this.cart.asReadonly();
  
  subtotal = computed(() => {
    return this.cart().reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const extrasTotal = item.extras?.reduce((sum, extra) => 
        sum + (extra.price * extra.quantity), 0) ?? 0;
      return total + itemTotal + extrasTotal;
    }, 0);
  });
  
  discount = computed(() => this.subtotal() * 0.1);
  total = computed(() => this.subtotal() - this.discount());

  addToCart(item: CartItem) {
    this.cart.update(items => [...items, {...item, id: crypto.randomUUID()}]);
  }

  removeFromCart(id: string) {
    this.cart.update(items => items.filter(item => item.id !== id));
  }

  updateQuantity(id: string, quantity: number) {
    if (quantity < 1) return;
    this.cart.update(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }

  updateExtraQuantity(itemId: string, extraName: string, quantity: number) {
    if (quantity < 0) return;
    this.cart.update(items =>
      items.map(item => {
        if (item.id === itemId && item.extras) {
          return {
            ...item,
            extras: item.extras.map(extra =>
              extra.name === extraName ? { ...extra, quantity } : extra
            )
          };
        }
        return item;
      })
    );
  }

  clearCart() {
    this.cart.set([]);
  }
}
