import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { OptionsComponent } from 'src/app/components/options/options.component';
import { MeetingComponent } from 'src/app/components/meeting/meeting.component';


const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'options', component: OptionsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
