import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastrPopupService {
  constructor(private toastr: ToastrService) {}

  displaySuccessMessage(message: string, title: string = 'Sukces'): void {
    this.toastr.success(message, title, {
      easing: 'ease-in',
      timeOut: 5000,
      titleClass: 'text-center',
      progressBar: true,
      progressAnimation: 'increasing',
      tapToDismiss: true,
      positionClass: 'toast-top-center',
    });
  }

  displayErrorMessage(message: string, title: string = 'Error'): void {
    this.toastr.error(message, title, {
      easing: 'ease-in',
      timeOut: 5000,
      titleClass: 'text-center',
      progressBar: true,
      progressAnimation: 'increasing',
      tapToDismiss: true,
      positionClass: 'toast-top-center',
    });
  }
}
