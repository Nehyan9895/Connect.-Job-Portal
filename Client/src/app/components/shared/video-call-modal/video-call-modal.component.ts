import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-call-modal',
  standalone: true,
  imports: [MatButtonModule,MatDialogModule],
  templateUrl: './video-call-modal.component.html',
  styleUrl: './video-call-modal.component.scss'
})
export class VideoCallModalComponent {
  constructor(
    public dialogRef: MatDialogRef<VideoCallModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, link: string },
    private router:Router
  ) {}

  onAccept(): void {
  try {
    // Parse the URL and extract query parameters
    const url = new URL(this.data.link);
    const roomID = url.searchParams.get('roomID');

    if (roomID) {
      // Navigate to '/video-call' with the roomID as a query parameter
      this.router.navigate(['/video-call'], { queryParams: { roomID } }).then(() => {
        this.dialogRef.close();
      }).catch(error => {
        console.error('Navigation error:', error);
      });
    } else {
      console.error('roomID not found in URL');
      this.dialogRef.close();
    }
  } catch (error) {
    console.error('Invalid URL:', error);
    this.dialogRef.close();
  }
}


  
  

  onReject(): void {
    this.dialogRef.close();
  }

}
