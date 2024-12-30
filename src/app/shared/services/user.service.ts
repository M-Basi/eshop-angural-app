import { inject, Injectable, signal, effect } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Credentials, User, LoggedInUser, AuthenticationResponse } from '../interfaces/java-backend';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';



const API_URL = `${environment.apiURL}/api`

@Injectable({
  providedIn: 'root'
})
export class UserService {
    http: HttpClient = inject(HttpClient)
    router = inject(Router);

    user = signal<LoggedInUser | null>(null)

    
    constructor(){
      const access_token = localStorage.getItem("access_token")
      
      if(access_token) {
        const decodedToken = jwtDecode(access_token) as any;
        const expirationTime = decodedToken.exp*1000;

        const timeLeft = expirationTime - Date.now(); // Χρόνος που απομένει

        if (timeLeft <= 0) {
          // Το token έχει λήξει
          this.logoutUser();
      }else {
        this.user.set({
          firstname: localStorage.getItem('firstname') || '',
          userUuid: localStorage.getItem('userUuid') || '',
          username: decodedToken.sub,
          role: decodedToken.role,
          });
          this.setAutoLogout(timeLeft); 
        }  
      }
      effect(() => {
        if(this.user()) {
          console.log("User logged in: ", this.user()?.firstname)
        } else {
          console.log('No user logged in')
        }
      })
    }

    setAutoLogout(timeLeft: number) {
 
    
      if (timeLeft > 0) {
        setTimeout(() => {
          console.log('Token has expired. Logging out...');
          this.logoutUser();
        }, timeLeft);
      } else {
        console.log('Token already expired. Logging out immediately.');
        this.logoutUser();
      }
    }

    registerUser(user: any): Observable<User> {
      return this.http.post<User>(`${API_URL}/users/register`, user);
    }


    loginUser(credentials: Credentials): Observable<AuthenticationResponse> {
      return this.http.post<AuthenticationResponse>(
        `${API_URL}/auth/authenticate`,
        credentials,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      );
    }

    logoutUser() {
      this.user.set(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('firstname');
      localStorage.removeItem('userUuid');
      localStorage.removeItem('customerUuid');
      localStorage.removeItem('productId');
      localStorage.removeItem('tokenExpiration');
      // localStorage.clear();
      this.router.navigate(['login'])
    }




    // refreshToken(credentials: Credentials): Observable<AuthenticationResponse> {
    //   return this.http.post<AuthenticationResponse>(
    //     `${API_URL}/auth/refreshToken`,
    //     credentials,
    //     {
    //       headers: new HttpHeaders({
    //         'Content-Type': 'application/json',
    //       }),
    //     }
    //   );
    // }

    // refreshValuesToken(token: string): void {
    //   const decodedToken = jwtDecode(token) as any;
    
    //   const expirationTime = decodedToken.exp;
    
    //   // Update local storage
    //   localStorage.setItem('access_token', token);
    //   localStorage.setItem('firstname', this.user()?.firstname || '');
    //   localStorage.setItem('userUuid', decodedToken.sub);
    //   localStorage.setItem('token_expiration', expirationTime.toString());
    

    //   const loggedInUser: LoggedInUser = {
    //     firstname: this.user()?.firstname || '',
    //     userUuid: decodedToken.sub,
    //     username: decodedToken.sub,
    //     role: decodedToken.role,
    //   };

    //   console.log('Logged in user:', loggedInUser);

    //   // Ενημέρωση του χρήστη στο service
    //   this.user.set(loggedInUser);
    
    //   console.log('Token and user information updated.');
    // }
    
    
    userUpdate(user: any): Observable<any> {
      return this.http.post<any>(`${API_URL}/users/user/update`,user);
    }

    getUserUuid(userUuid: any): Observable<User> {
        return this.http.post<User>(`${API_URL}/users/user/get`, userUuid);
        
      }

    

    
    
}
