import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
})
export class ErrorComponent {
  @Input() message = '';
  @Output() retry = new EventEmitter<void>();
  errorId = Math.random().toString(36).substring(2, 11);
  onRetry(): void {
    this.retry.emit();
  }
}
