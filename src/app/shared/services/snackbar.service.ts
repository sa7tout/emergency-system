import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackbarQueue: { message: string; config: MatSnackBarConfig }[] = [];
  private isShowingSnackbar = false;

  constructor(
    private snackBar: MatSnackBar,
    private zone: NgZone
  ) {}

  showSnackbar(message: string, action: string = 'Close', config: MatSnackBarConfig = {}) {
    const finalConfig: MatSnackBarConfig = {
      ...config,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      duration: config.duration || 5000
    };

    this.snackbarQueue.push({ message, config: finalConfig });

    if (!this.isShowingSnackbar) {
      this.showNextSnackbar();
    }
  }

  private showNextSnackbar() {
    if (this.snackbarQueue.length === 0) {
      this.isShowingSnackbar = false;
      return;
    }

    this.isShowingSnackbar = true;
    const { message, config } = this.snackbarQueue.shift()!;

    this.zone.run(() => {
      const snackBarRef = this.snackBar.open(message, 'Close', {
        ...config,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });

      snackBarRef.afterDismissed().subscribe(() => {
        setTimeout(() => this.showNextSnackbar(), 300);
      });
    });
  }
}
