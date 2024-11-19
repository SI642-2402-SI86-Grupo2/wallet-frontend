import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {PortfoliosComponent} from "./components/portfolios/portfolios.component";
import {ReportsComponent} from "./components/reports/reports.component";
import {LoginComponent} from "./components/users/login/login.component";
import {SignupComponent} from "./components/users/signup/signup.component";
import {NotfoundComponent} from "./components/notfound/notfound.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {DocumentComponent} from "./components/portfolios/document/document.component";
import {PendingComponent} from "./components/pending/pending.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'portfolios', component: PortfoliosComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'pending', component: PendingComponent},
   {path : 'portfolios/:id/documents', component: DocumentComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirigir a 'home' por defecto
  { path: '**', component: NotfoundComponent } // Wildcard route for 404 page
];




@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules // Cambia a NoPreloading si no deseas precargar módulos
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
