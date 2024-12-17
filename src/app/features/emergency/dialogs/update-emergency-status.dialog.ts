@Component({
  template: `
    <h2 mat-dialog-title>Update Emergency Status</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field class="w-full">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option *ngFor="let status of availableStatuses" [value]="status">
              {{status}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          Update
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class UpdateEmergencyStatusDialog {
  form: FormGroup;
  availableStatuses: EmergencyStatus[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateEmergencyStatusDialog>,
    private emergencyService: EmergencyService,
    @Inject(MAT_DIALOG_DATA) public data: EmergencyResponse
  ) {
    this.availableStatuses = this.getNextPossibleStatuses(data.status);
    this.form = this.fb.group({
      status: ['', Validators.required]
    });
  }

  getNextPossibleStatuses(currentStatus: EmergencyStatus): EmergencyStatus[] {
    const statusFlow = {
      [EmergencyStatus.PENDING]: [EmergencyStatus.ASSIGNED, EmergencyStatus.CANCELLED],
      [EmergencyStatus.ASSIGNED]: [EmergencyStatus.IN_PROGRESS, EmergencyStatus.CANCELLED],
      [EmergencyStatus.IN_PROGRESS]: [EmergencyStatus.COMPLETED, EmergencyStatus.CANCELLED],
      [EmergencyStatus.COMPLETED]: [],
      [EmergencyStatus.CANCELLED]: []
    };
    return statusFlow[currentStatus];
  }

  onSubmit() {
    if (this.form.valid) {
      this.emergencyService.updateEmergencyStatus(
        this.data.id,
        this.form.value.status
      ).subscribe(
        response => this.dialogRef.close(response),
        error => console.error('Error updating status:', error)
      );
    }
  }
}
