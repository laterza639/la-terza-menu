import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../menu/services/cart.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: /*html*/
  `
  <div class="p-4 max-w-md mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Carrito <span class="text-2xl font-bold text-yellow-400">Terza</span></h1>
      <a [routerLink]="['/headquarters/menu/hamburguer']"
          class="bg-yellow-400 w-8 h-8 rounded-lg flex items-center justify-center">
        <span class="text-xl font-thin">×</span>
      </a>
    </div>

    <!-- Cart Items -->
    <div class="space-y-4 mb-6">
      <div *ngFor="let item of cartService.cartItems()"
            class="bg-white p-4 rounded-xl shadow">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold">{{ item.name }} (+{{item.price}})</h3>
            <div *ngIf="item.extras?.length" class="text-sm text-gray-600 mt-1">
              <div *ngFor="let extra of item.extras">
                <span *ngIf="extra.quantity > 0">
                  {{ extra.quantity }}× {{ extra.name }} (+{{ extra.price }} Bs.)
                </span>
              </div>
            </div>
            <div *ngIf="item.notes">
              <span class="text-sm text-yellow-600 mt-1 italic">{{item.notes}}</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <button (click)="cartService.updateQuantity(item.id, item.quantity - 1)"
                      class="bg-yellow-400 w-8 h-8 rounded-lg flex items-center justify-center">
                -
              </button>
              <span>{{ item.quantity }}</span>
              <button (click)="cartService.updateQuantity(item.id, item.quantity + 1)"
                      class="bg-yellow-400 w-8 h-8 rounded-lg flex items-center justify-center">
                +
              </button>
            </div>
            <button (click)="cartService.removeFromCart(item.id)"
                    class="text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Total Section -->
    <div class="bg-white p-4 rounded-xl shadow mb-6">
      <div class="flex justify-between mb-2">
        <span>SUBTOTAL:</span>
        <span>{{ cartService.subtotal() }} Bs.</span>
      </div>
      <div class="flex justify-between text-green-600 mb-2">
        <span>Descuento pedido web 10% OFF</span>
        <span>-{{ cartService.discount().toFixed(2) }} Bs.</span>
      </div>
      <div class="flex justify-between font-bold">
        <span>TOTAL:</span>
        <span>{{ cartService.total() }} Bs.</span>
      </div>
    </div>

    <div class="bg-white p-4 rounded-xl shadow mb-6">
      <!-- Checkout Form -->

      <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="space-y-4">

        <div>
          <label class="block mb-1 font-semibold">* Pago</label>
          <div class="flex justify-between">
            <div>
              <input type="radio"
                      formControlName="payment"
                      value="cash"
                      id="cash">
              <label for="cash" class="ml-2">Efectivo</label>
            </div>
            <div>
              <input type="radio"
                      formControlName="payment"
                      value="qr"
                      id="qr">
              <label for="qr" class="ml-2">QR</label>
            </div>
          </div>

          <div class="mt-6 flex flex-col items-center" *ngIf="checkoutForm.get('payment')?.value === 'qr'">
            <img src="qrexample.png" alt="qr" class="mb-4">
            <a href="qrexample.png"
               download="qr-payment.png"
               class="bg-yellow-400 text-black px-4 py-2 rounded-full flex items-center gap-2 hover:bg-yellow-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg"
                   class="h-5 w-5"
                   fill="none"
                   viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Descargar QR</span>
            </a>
            <span class="text-sm text-gray-600 my-6 italic text-center">Porfavor, una vez enviado el pedido, adjunta el comprobante de la transferencia</span>
          </div>
        </div>

        <div class="mt-4">
          <label class="block mb-1 font-semibold mt-8">* Nombre Completo</label>
          <input type="text"
                  formControlName="fullName"
                  class="w-full p-2 border rounded-lg">
        </div>

        <div>
          <label class="block mb-1 font-semibold">* Teléfono</label>
          <input type="tel"
                  formControlName="phone"
                  class="w-full p-2 border rounded-lg">
        </div>

        <div>
          <label class="block mb-1 font-semibold">* Delivery</label>
          <div class="flex justify-between">
            <div>
              <input type="radio"
                      formControlName="deliveryType"
                      value="pickup"
                      id="pickup">
              <label for="pickup" class="ml-2">Recojo en el local</label>
            </div>
            <div>
              <input type="radio"
                      formControlName="deliveryType"
                      value="delivery"
                      id="delivery">
              <label for="delivery" class="ml-2">Delivery</label>
            </div>
          </div>

          <div class="mt-6" *ngIf="checkoutForm.get('deliveryType')?.value === 'delivery'">
            <label class="block mb-1 font-semibold">* Dirección</label>
            <input type="text"
                    formControlName="address"
                    class="w-full p-2 border rounded-lg">

            <label class="block mb-1 mt-4 font-semibold">Referencia de la vivienda (Opcional)</label>
            <input type="text"
                    formControlName="reference"
                    class="w-full p-2 border rounded-lg">
          </div>
        </div>

        <div *ngIf="checkoutForm.get('deliveryType')?.value === 'delivery'">
          <label class="block mb-1 mt-8 font-semibold">* Mapa</label>
          <div id="map" class="w-full h-[300px] min-h-[300px] rounded-lg overflow-hidden"></div>
          <div class="text-sm text-gray-600 my-6 italic text-center">
            Arrastra el marcador o haz clic en el mapa para seleccionar tu ubicación
          </div>
        </div>

        <button type="submit"
                [disabled]="!checkoutForm.valid || cartService.cartItems().length === 0"
                class="w-full bg-green-500 text-white font-bold py-3 rounded-full disabled:opacity-50">
          Confirmar pedido
        </button>
      </form>
    </div>
  </div>
  `
})
export default class CartComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private sourceSegment: string = '';
  private fb = inject(FormBuilder);
  private router = inject(Router);
  cartService = inject(CartService);

  private map!: L.Map;
  private marker!: L.Marker;

  // Default coordinates (Santa Cruz de la Sierra)
  private defaultPosition = {
    lat: -17.783336,
    lng: -63.182126
  };

  checkoutForm = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    deliveryType: ['pickup', Validators.required],
    payment: ['cash', Validators.required],
    address: [''],
    reference: [''],
    location: this.fb.group({
      lat: [this.defaultPosition.lat, Validators.required],
      lng: [this.defaultPosition.lng, Validators.required]
    })
  });

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.sourceSegment = params['source'] || '';
    });

    this.checkoutForm.get('deliveryType')?.valueChanges.subscribe(value => {
      const addressControl = this.checkoutForm.get('address');
      const locationGroup = this.checkoutForm.get('location');

      if (value === 'delivery') {
        addressControl?.setValidators(Validators.required);
        locationGroup?.enable();
        // Add a delay to ensure the container is visible before initializing
        setTimeout(() => {
          const mapDiv = document.getElementById('map');
          // Only initialize if the map container exists and map isn't already initialized
          if (mapDiv && !this.map) {
            this.initMap();
          }
        }, 100);
      } else {
        addressControl?.clearValidators();
        locationGroup?.disable();
        // Clean up map when switching to pickup
        if (this.map) {
          this.map.remove();
          this.map = null!;  // Reset the map reference
          this.marker = null!;  // Reset the marker reference
        }
      }
      addressControl?.updateValueAndValidity();
    });
}

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
      // Remove existing map if it exists
      if (this.map) {
        this.map.remove();
      }

      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
      });

      // Create map with default marker
      this.map = L.map('map', {
        center: [this.defaultPosition.lat, this.defaultPosition.lng],
        zoom: 13
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Add draggable marker with custom icon
      this.marker = L.marker([this.defaultPosition.lat, this.defaultPosition.lng], {
        draggable: true,
        icon: icon  // Using the custom icon here
      }).addTo(this.map);

      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.map.setView([pos.lat, pos.lng], 15);
          this.marker.setLatLng([pos.lat, pos.lng]);
          this.checkoutForm.get('location')?.patchValue(pos);
        });
      }

      // Force a map resize after initialization
      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);

      // Handle marker drag
      this.marker.on('dragend', (event: any) => {
        const position = event.target.getLatLng();
        this.checkoutForm.get('location')?.patchValue({
          lat: position.lat,
          lng: position.lng
        });
      });

      // Handle map click
      this.map.on('click', (e: any) => {
        const pos = e.latlng;
        this.marker.setLatLng(pos);
        this.checkoutForm.get('location')?.patchValue({
          lat: pos.lat,
          lng: pos.lng
        });
      });
  }

  onSubmit() {
    if (this.checkoutForm.valid && this.cartService.cartItems().length > 0) {
      const whatsappNumber = this.sourceSegment === 'headquarters' ? '62736621' : '65258797';

      // Format items details
      const itemsDetails = this.cartService.cartItems().map(item => {
        let itemText = `• ${item.quantity}× ${item.name} (${item.price} Bs.)`;

        // Add extras if they exist
        if (item.extras && item.extras.length > 0) {
          const extrasText = item.extras
            .filter(extra => extra.quantity > 0)
            .map(extra => `        >> ${extra.quantity}× ${extra.name} (+${extra.price} Bs.)`)
            .join('\n');
          if (extrasText) {
            itemText += '\n' + extrasText;
          }
        }

        // Add notes if they exist
        if (item.notes) {
          itemText += `\n       Nota: ${item.notes}`;
        }

        return itemText;
      }).join('\n');

      // Format location if delivery
      const isDelivery = this.checkoutForm.get('deliveryType')?.value === 'delivery';
      const locationGroup = this.checkoutForm.get('location');
      let mapLink = '';

      if (isDelivery && locationGroup) {
        const lat = locationGroup.get('lat')?.value;
        const lng = locationGroup.get('lng')?.value;
        if (lat && lng) {
          mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
        }
      }

      // Format payment method
      const paymentMethod = this.checkoutForm.get('payment')?.value === 'cash' ? 'Efectivo' : 'QR';

      // Construct the message
      const message =
      `
      *NUEVO PEDIDO*
      *Cliente:* ${this.checkoutForm.get('fullName')?.value}
      *Teléfono:* ${this.checkoutForm.get('phone')?.value}
      *Método de Pago:* ${paymentMethod}

      *PRODUCTOS (Precios Unitarios):*
      ${itemsDetails}

      *RESUMEN:*
      Subtotal: ${this.cartService.subtotal()} Bs.
      Descuento (10%): -${this.cartService.discount().toFixed(2)} Bs.
      *Total: ${this.cartService.total()} Bs.*

      *ENTREGA:*
      Tipo: ${isDelivery ? 'Delivery' : 'Recojo en Local'}${isDelivery ? `
      Dirección: ${this.checkoutForm.get('address')?.value}${this.checkoutForm.get('reference')?.value ? `
      Referencia: ${this.checkoutForm.get('reference')?.value}` : ''}
      Ubicación: ${mapLink}` : ''}
      `;

      // Encode the message for WhatsApp
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');

      // Clear cart and redirect
      this.cartService.clearCart();
      this.router.navigate(['/headquarters/menu/hamburguer']);
    }
  }
}
