import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import {ScheduleService} from "../../services/schedule.service";

@Component({
  selector: 'app-menu-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule],
  template: /*html*/
  `
    <!-- Closed Branch Alert -->
    <div *ngIf="isClosed()" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="text-center">
          <div class="mb-4">
            <svg class="mx-auto h-12 w-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Sucursal Cerrada
          </h3>
          <p class="text-gray-500">
            ¡Vuelva pronto! Estamos fuera del horario de atención.
          </p>
        </div>
      </div>
    </div>

  <nav class="flex justify-center items-center p-4 bg-white mt-5">
      <div class="flex gap-4">
        <a
          type="button"
          routerLink="hamburguer"
          (click)="setActiveButton(1)"
          [ngClass]="{'bg-yellow-400 shadow-lg': activeButton === 1, 'bg-gray-100': activeButton !== 1}"
          class="flex items-center justify-center w-16 h-16 rounded-2xl transition-all hover:opacity-75 focus:ring focus:ring-gray-50">
          <i class="text-lg">
            <img src="hamburguer.png" alt="Hamburger" class="w-8 h-8">
          </i>
        </a>

        <a
          type="button"
          routerLink="drinks"
          (click)="setActiveButton(2)"
          [ngClass]="{'bg-yellow-400 shadow-lg': activeButton === 2, 'bg-gray-100': activeButton !== 2}"
          class="flex items-center justify-center w-16 h-16 rounded-2xl transition-all hover:opacity-75 focus:ring focus:ring-gray-50">
          <i class="text-lg">
            <img src="drink.png" alt="Drink" class="w-8 h-8">
          </i>
        </a>

        <a
          type="button"
          routerLink="snacks"
          (click)="setActiveButton(3)"
          [ngClass]="{'bg-yellow-400 shadow-lg': activeButton === 3, 'bg-gray-100': activeButton !== 3}"
          class="flex items-center justify-center w-16 h-16 rounded-2xl transition-all hover:opacity-75 focus:ring focus:ring-gray-50">
          <i class="text-lg">
            <img src="snacks.png" alt="Snacks" class="w-8 h-8">
          </i>
        </a>

        <a
          type="button"
          routerLink="dessert"
          (click)="setActiveButton(4)"
          [ngClass]="{'bg-yellow-400 shadow-lg': activeButton === 4, 'bg-gray-100': activeButton !== 4}"
          class="flex items-center justify-center w-16 h-16 rounded-2xl transition-all hover:opacity-75 focus:ring focus:ring-gray-50">
          <i class="text-lg">
            <img src="dessert.png" alt="Dessert" class="w-8 h-8">
          </i>
        </a>
      </div>
  </nav>

  <div class="flex justify-center">
    <a type="button"
       class="bg-yellow-400 w-8 h-8 rounded-lg flex items-center justify-center"
       [routerLink]="['/']" >
      <span class="text-xl font-thin"><</span>
    </a>
  </div>

  <div>
    <router-outlet/>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MenuLayoutComponent implements OnInit{
  private scheduleService = inject(ScheduleService);
  public isClosed = signal<boolean>(false);
  activeButton: number = 1;

  ngOnInit() {
    this.checkScheduleStatus();
  }

  private checkScheduleStatus() {
    this.scheduleService.getStatus().subscribe(
      isOpen => this.isClosed.set(!isOpen)
    );
  }

  setActiveButton(buttonNumber: number) {
    if (this.isClosed()) return; // Prevent interaction when closed
    this.activeButton = buttonNumber;
  }
}
