import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importa FormsModule aquí

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { PortfoliosComponent } from './components/portfolios/portfolios.component';
import { ReportsComponent } from './components/reports/reports.component';
import { LoginComponent } from './components/users/login/login.component';
import { SignupComponent } from './components/users/signup/signup.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DocumentComponent } from './components/portfolios/document/document.component';
import { provideHttpClient} from "@angular/common/http";
import { PendingComponent } from './components/pending/pending.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    PortfoliosComponent,
    ReportsComponent,
    LoginComponent,
    SignupComponent,
    NotfoundComponent,
    ProfileComponent,
    DocumentComponent,
    PendingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule

  ],
  providers: [    provideHttpClient() // Use the recommended alternative
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // Añadir este esquema

})
export class AppModule { }
