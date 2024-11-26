import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: /*html*/
  `
  <div class="bg-black h-screen grid grid-cols-1 grid-rows-2">
    <div class="mx-auto w-60 mt-28">
      <img src="logo.png" alt="logo-img">
    </div>

    <div class="flex flex-col px-24 gap-5 pt-20">
      <a
        class="align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 bg-yellow-400 text-black shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none rounded-lg"
        type="button"
        routerLink="headquarters">
        <span class="text-lg font-sans">CASA MATRIZ</span>
        <br>
        <span class="text-xs font-thin">📍 D.L. Ramirez #103</span>
      </a>
      <a
        class="align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 bg-yellow-400 text-black shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none rounded-lg"
        type="button"
        routerLink="suc-1">
        <span class="text-lg">SUCURSAL 1</span>
        <br>
        <span class="text-xs font-thin">📍 Padilla esq. Calvo</span>
      </a>
    </div>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent { }
