import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import { EnterPageComponent } from './enter-page/enter-page.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {environment} from "../environments/environment";
import { BoardComponent } from './board/board.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { DragulaModule } from 'ng2-dragula';
import {BsModalModule} from "ng2-bs3-modal";
import {FormsModule} from "@angular/forms";


const routes: Routes = [
  {path: '' , component: EnterPageComponent},
  {path: 'dashboard' , component: DashboardComponent},
  {path: 'board/:id' , component: BoardComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    EnterPageComponent,
    BoardComponent,
    TopMenuComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    DragulaModule,
    BsModalModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


