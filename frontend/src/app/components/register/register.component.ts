import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {

  username = '';
  password = '';
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) { }

  submit() {
    this.auth.register(this.username, this.password).subscribe({
      next: () => {
        this.success = 'Thy account is forged in the arcane fires! Step forth and enter the login gate.';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: () => {
        this.error = 'That name echoes with another’s essence. Choose a different one, brave traveler.';
      }
    });
  }
}
