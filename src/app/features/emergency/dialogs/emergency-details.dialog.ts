@Component({
  template: `
    <h2 mat-dialog-title>Emergency Case Details</h2>
    <mat-dialog-content>
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <google-map [center]="center" [zoom]="15" width="100%" height="300px">
            <map-marker [position]="center"></map-marker>
          </google-map>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-2">Patient Information</h3>
          <p><strong>Name:</strong> {{data.patientName}}</p>
          <p><strong>Contact:</strong> {{data.contactNumber || 'N/A'}}</p>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-2">Emergency Status</h3>
          <mat-chip [color]="getStatusColor(data.status)" selected>{{data.status}}</mat-chip>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-2">Assignment Details</h3>
          <p><strong>Ambulance:</strong> {{data.assignedAmbulanceId || 'Not assigned'}}</p>
          <p><strong>Hospital:</strong> {{data.assignedHospitalId || 'Not assigned'}}</p>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-2">Timestamps</h3>
          <p><strong>Created:</strong> {{data.createdAt | date:'medium'}}</p>
          <p><strong>Last Updated:</strong> {{data.updatedAt | date:'medium'}}</p>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `
})
export class EmergencyDetailsDialog {
  center: google.maps.LatLngLiteral;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EmergencyResponse) {
    this.center = {
      lat: data.pickupLatitude,
      lng: data.pickupLongitude
    };
  }

  getStatusColor(status: EmergencyStatus): string {
    const colors = {
      [EmergencyStatus.PENDING]: 'warn',
      [EmergencyStatus.ASSIGNED]: 'accent',
      [EmergencyStatus.IN_PROGRESS]: 'primary',
      [EmergencyStatus.COMPLETED]: 'success',
      [EmergencyStatus.CANCELLED]: 'default'
    };
    return colors[status];
  }
}
