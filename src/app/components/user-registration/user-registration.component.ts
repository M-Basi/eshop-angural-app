import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component'; // Ορίζεται το dialog component
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/interfaces/java-backend';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule
  ],
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css'],
})
export class UserRegistrationComponent {
  userService = inject(UserService);
  dialog = inject(MatDialog);
  router = inject(Router);

  form = new FormGroup(
    {
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), // Ελάχιστο μήκος 8 χαρακτήρες
        Validators.pattern('^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[@#$%!^&*]).{8,}$')]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    this.passwordConfirmPasswordValidator
  );

  passwordConfirmPasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const form = control as FormGroup;
    const password = form.get('password')?.value.trim();
    const confirmPassword = form.get('confirmPassword')?.value.trim();
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    const user: User = {
      username: this.form.get('username')?.value?.trim() || '',
      password: this.form.get('password')?.value?.trim() || '',
      
    };

    this.userService.registerUser(user).subscribe({
      next: (response) => {
        this.showSuccessDialog(response.username);
      },
      error: () => {
        this.form.get('username')?.setErrors({ duplicateEmail: true });
      },
    });
    this.router.navigate(['./welcome']);
  }

  showSuccessDialog(role: string): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: { message: `User registered successfully with role: ${role}` },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/dashboard']); // Κάνετε redirect μετά το κλείσιμο του παραθύρου
    });
  }
}




// import { Component, inject } from '@angular/core';
// import { FormGroup, FormControl, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatButtonModule } from '@angular/material/button';
// import { UserService } from '../../shared/services/user.service';
// import { User } from '../../shared/interfaces/java-backend';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-user-registration',
//   standalone: true,
//   imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, CommonModule],
//   templateUrl: './user-registration.component.html',
//   styleUrls: ['./user-registration.component.css'],
// })
// export class UserRegistrationComponent {
//   userService = inject(UserService);

//   registrationStatus: { success: boolean; message: string } = {
//     success: false,
//     message: '', // Κενό για να μην εμφανίζεται κανένα μήνυμα κατά την αρχική φόρτωση
//   };

//   form = new FormGroup(
//     {
//       username: new FormControl('', [Validators.required, Validators.email]),
//       password: new FormControl('', [Validators.required, Validators.minLength(4)]),
//       confirmPassword: new FormControl('', [Validators.required]),
//     },
//     this.passwordConfirmPasswordValidator
//   );

//   passwordConfirmPasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
//     const form = control as FormGroup;
//     const password = form.get('password')?.value;
//     const confirmPassword = form.get('confirmPassword')?.value;
//     if (password && confirmPassword && password !== confirmPassword) {
//       return { passwordMismatch: true };
//     }
//     return null;
//   }

//   onSubmit(value: any) {
//     const user: User = {
//       username: this.form.get('username')?.value || '',
//       password: this.form.get('password')?.value || '',
//     };

//     this.userService.registerUser(user).subscribe({
//       next: (response) => {
//         this.registrationStatus = { success: true, message: `User registered successfully with role: ${response.role}` };
//         this.form.reset();
//       },
//       error: (error) => {
//         this.registrationStatus = { success: false, message: 'Email already exists or registration failed.' };
//         this.form.get('username')?.setErrors({ duplicateEmail: true });
//       },
//     });
//   }

//   registerAnother() {
//     this.form.reset();
//     this.registrationStatus = { success: false, message: '' };
//   }
// }
