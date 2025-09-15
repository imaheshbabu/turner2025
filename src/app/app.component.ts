import { Component } from '@angular/core';
import { MainLayoutComponent } from './shared/components/layout/main-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Playlist Display App';
}
