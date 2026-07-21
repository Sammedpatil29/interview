import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token');

  if (token) {
    return true; // User is authenticated, allow access
  } else {
    router.navigate(['/home']); // User is not authenticated, redirect to home
    return false;
  }
};
