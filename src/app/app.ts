import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './composants/navbar/navbar.component';
import { ToastComponent } from './shared/toast/toast.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarComponent,
    ToastComponent,
    FooterComponent
  ],
})
export class AppComponent {
  title() {
    return 'MegaMall';
  }
}
