import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShopsComponent } from './features/shops/shops.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,   // nécessaire pour <router-outlet>
    ShopsComponent, // nécessaire pour <app-shops>
  ],
})
export class AppComponent {
  title() {
    return 'Angular';
  }
}
