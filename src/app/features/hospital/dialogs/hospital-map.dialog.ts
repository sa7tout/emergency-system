@Component({
  template: `
    <h2 mat-dialog-title>{{data.name}} Location</h2>
    <mat-dialog-content>
      <div class="h-96 w-full">
        <google-map [center]="center" [zoom]="15" width="100%" height="100%">
          <map-marker [position]="center" [options]="markerOptions">
            <map-info-window>
              <h3 class="font-bold">{{data.name}}</h3>
              <p>{{data.address}}</p>
              <p>Available Beds: {{data.availableBeds}}/{{data.totalBeds}}</p>
              <p>Emergency Load: {{data.currentEmergencyLoad}}/{{data.emergencyCapacity}}</p>
            </map-info-window>
          </map-marker>
        </google-map>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `
})
export class HospitalMapDialog implements OnInit {
  center: google.maps.LatLngLiteral;
  markerOptions: google.maps.MarkerOptions = {
    icon: {
      url: 'assets/icons/hospital-marker.png',
      scaledSize: new google.maps.Size(32, 32)
    }
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: HospitalResponse,
    private mapInfoWindow: MapInfoWindow
  ) {
    this.center = {
      lat: data.latitude,
      lng: data.longitude
    };
  }

  ngOnInit() {
    setTimeout(() => this.mapInfoWindow.open(), 1000);
  }
}
