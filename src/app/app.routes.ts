import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component')
  },
  {
    path: 'headquarters',
    loadComponent: () => import('./pages/menu/components/menu-layout/menu-layout.component'),
    children: [
      {
        path: 'hamburguer',
        loadComponent: () => import('./pages/menu/components/menu-hamburguer/menu-hamburguer.component'),
      },
      {
        path: 'drinks',
        loadComponent: () => import('./pages/menu/components/menu-drinks/menu-drinks.component'),
      },
      {
        path: 'snacks',
        loadComponent: () => import('./pages/menu/components/menu-snacks/menu-snacks.component'),
      },
      {
        path: 'dessert',
        loadComponent: () => import('./pages/menu/components/menu-dessert/menu-dessert.component'),
      },
      { path: '**', redirectTo: 'hamburguer' },
    ]
  },
  {
    path: 'suc-1',
    loadComponent: () => import('./pages/menu/components/menu-layout/menu-layout.component'),
    children: [
      {
        path: 'hamburguer',
        loadComponent: () => import('./pages/menu/components/menu-hamburguer/menu-hamburguer.component'),
      },
      {
        path: 'drinks',
        loadComponent: () => import('./pages/menu/components/menu-drinks/menu-drinks.component'),
      },
      {
        path: 'snacks',
        loadComponent: () => import('./pages/menu/components/menu-snacks/menu-snacks.component'),
      },
      {
        path: 'dessert',
        loadComponent: () => import('./pages/menu/components/menu-dessert/menu-dessert.component'),
      },
      { path: '**', redirectTo: 'hamburguer' },
    ]
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component')
  },
  { path: '**', redirectTo: '' },
];
