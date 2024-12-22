import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: /*html*/
  `
    <div class="bg-black min-h-screen flex flex-col">
      <!-- Logo Section -->
      <div class="flex-1 flex items-center justify-center max-h-[40vh]">
        <div class="w-48 sm:w-60">
          <img src="logo.png" alt="logo-img" class="w-full h-auto">
        </div>
      </div>

      <!-- Buttons Section -->
      <div class="flex-1 flex flex-col justify-start items-center px-4 sm:px-8 md:px-24 gap-4 pb-8">
        <a
          class="w-full max-w-xs align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none py-3 px-4 bg-yellow-400 text-black shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none rounded-lg"
          type="button"
          routerLink="headquarters">
          <span class="text-base sm:text-lg font-sans">CASA MATRIZ</span>
          <br>
          <span class="text-xs font-thin">📍 D.L. Ramirez #103</span>
        </a>
        <a
          class="w-full max-w-xs align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none py-3 px-4 bg-yellow-400 text-black shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none rounded-lg"
          type="button"
          routerLink="suc-1">
          <span class="text-base sm:text-lg">SUCURSAL 1</span>
          <br>
          <span class="text-xs font-thin">📍 Padilla esq. Calvo</span>
        </a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent { }
