import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-menu-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule],
  template: /*html*/
  `
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
export default class MenuLayoutComponent {
  activeButton: number = 1;

  setActiveButton(buttonNumber: number) {
    this.activeButton = buttonNumber;
  }
}
