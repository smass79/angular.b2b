import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/shop/home/home.component';
import { DemoComponent } from './components/demo/demo.component';


const appRoutes: Routes = [
  /*
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'blog',
        loadChildren: () => import('./components/blog/blog.module').then(m => m.BlogModule)
      },
    ]
  },
  */
  {
    path: 'pages',
    component: MainComponent,
    loadChildren: () => import('./components/pages/pages.module').then(m => m.PagesModule)

  },
  {
    path: 'home',
    component: MainComponent,
    loadChildren: () => import('./components/shop/shop.module').then(m => m.ShopModule)
  },
  
  {
     path: '', redirectTo: '/home', pathMatch: 'full' ,

  },
  
  {
    path: '**',
    redirectTo: 'home/'
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: false, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
