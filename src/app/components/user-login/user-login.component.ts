import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Credentials } from '../../shared/interfaces/java-backend';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { LoggedInUser } from '../../shared/interfaces/java-backend';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
  cdr = inject(ChangeDetectorRef)
  userService = inject(UserService)
  router = inject(Router)
  invalidLogin = false;
  isLoading = true;

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  onSubmit() {
    const credentials = this.form.value as Credentials;
  
    this.userService.loginUser(credentials).subscribe({
      next: (response) => {
        const token = response.token;
        
        console.log('Token:', token);
        
        const decodedToken = jwtDecode(token) as any;
        const expirationTime = decodedToken.exp * 1000;
        // Αποθήκευση στο Local Storage
        localStorage.setItem('access_token', token);
        localStorage.setItem('firstname', response.firstname);
        localStorage.setItem('userUuid', response.userUuid);
        localStorage.setItem('token_expiration', expirationTime.toString());
  
        // Αποκωδικοποίηση του JWT για πληροφορίες
        
        
        console.log('Decoded Token:', decodedToken);
        const loggedInUser: LoggedInUser = {
          firstname: response.firstname,
          userUuid: response.userUuid,
          username: decodedToken.sub, // Το username αποθηκεύεται στο `sub`
          role: decodedToken.role,    // Ο ρόλος αποθηκεύεται στα claims
          
        };
        this.cdr.detectChanges();
        console.log('Logged in user:', loggedInUser);
  
        // Ενημέρωση του χρήστη στο service
        this.userService.user.set(loggedInUser);
        this.cdr.detectChanges();
        // Πλοήγηση στη σελίδα καλωσορίσματος
        alert("Succesfull login")
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigate(['./welcome']);
        }, 500); // Καθυστέρηση 500ms
        
      },
      error: (error) => {
        console.error('Login Error:', error);
        this.invalidLogin = true;
      },
    });
  }
}
