import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) { }

  submit() {
    this.error = '';
    const username = this.username?.trim();
    const password = this.password ?? '';
    if (!username || !password) {
      this.error = 'Username and password are required.';
      return;
    }

    this.auth.login(username, password).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.error = 'Invalid username or password.';
      }
    });
  }
}
