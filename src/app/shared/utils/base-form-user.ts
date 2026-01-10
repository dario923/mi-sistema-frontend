import { FormBuilder, Validators, FormGroup } from '@angular/forms'; // Añadimos FormGroup
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BaseFormUser {
  private isValidEmail = /\S+@\S+\.\S+/;
  errorMessage: string | null = null;

  // 1. Solo declaramos la variable
  public baseForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // 2. Creamos el grupo dentro del constructor, donde 'fb' ya existe
    this.baseForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.pattern(this.isValidEmail)],
      ],
      password: ['', [Validators.required, Validators.minLength(5)]],
      role: ['', [Validators.required]],
    });
  }

  isValidField(field: string): boolean {
    const control = this.baseForm.get(field);
    if (!control) return false; // Seguridad por si el campo no existe

    return (control.touched || control.dirty) && !control.valid;
  }

  private getErrorMessage(field: string): void {
    const control = this.baseForm.get(field);
    const errors = control?.errors;

    if (errors) {
      const minlength = errors?.minlength?.requiredLength;
      const messages: any = {
        required: 'You must enter a value.',
        pattern: 'Not a valid email.',
        minlength: `This field must be longer than ${minlength} characters`,
      };

      const errorKey = Object.keys(errors)[0];
      this.errorMessage = messages[errorKey];
    }
  }
}
