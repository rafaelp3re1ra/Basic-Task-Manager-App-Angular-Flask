import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent {

  username = '';
  password = '';
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) { }

  submit() {
    this.error = '';
    this.success = '';
    const username = this.username?.trim();
    const password = this.password ?? '';
    if (!username || !password) {
      this.error = 'Username and password are required.';
      return;
    }

    this.auth.register(username, password).subscribe({
      next: () => {
        this.success = 'Account created successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: () => {
        this.error = 'That username is already taken.';
      }
    });
  }
}
