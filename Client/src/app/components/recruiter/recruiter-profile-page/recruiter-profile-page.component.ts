import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { RecruiterSidebarComponent } from "../shared/recruiter-sidebar/recruiter-sidebar.component";
import { RecruiterHeaderComponent } from "../shared/recruiter-header/recruiter-header.component";
import { RecruiterService } from '../../../services/recruiter.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditRecruiterProfileModalComponent } from '../edit-recruiter-profile-modal/edit-recruiter-profile-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChip, MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { popularLocationsInIndia } from '../../../constants/locations.constant';
import { ToastrService } from 'ngx-toastr';
import {  RecruiterProfileFull } from '../../../models/recruiterResponseModel';

@Component({
  selector: 'app-recruiter-profile-page',
  standalone: true,
  changeDetection:ChangeDetectionStrategy.OnPush,
  imports: [FooterComponent, RecruiterSidebarComponent,FormsModule, RecruiterHeaderComponent,CommonModule,MatIcon,MatChip,MatInputModule,MatChipsModule,MatAutocompleteModule,],
  templateUrl: './recruiter-profile-page.component.html',
  styleUrl: './recruiter-profile-page.component.scss',
})
export class RecruiterProfilePageComponent {
  profile: RecruiterProfileFull|null  = null;
  newLocation: string = '';
  showLocationForm: boolean = false;
  filteredLocation:string[] = popularLocationsInIndia;
  id:string|undefined
  constructor(
    private recruiterService: RecruiterService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private toastr:ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.id = localStorage.getItem('recruiter_id') as string;
    if (this.id) {
      this.recruiterService.getProfile(this.id).subscribe(profile => {
        this.profile = profile.data;
        console.log(profile.data);
      });
    }
  }
  filterLocations(event: Event): void {
    const inputElement = event.target as HTMLInputElement; // Cast to HTMLInputElement to access value
    const query = inputElement.value.toLowerCase();
    this.filteredLocation = popularLocationsInIndia.filter(location =>
      location.toLowerCase().includes(query)
    );
  }
  


  editProfile(): void {
    const dialogRef = this.dialog.open(EditRecruiterProfileModalComponent, {
      data: { profileData: this.profile },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: RecruiterProfileFull) => {
      if (result) {
        this.profile = { ...this.profile, ...result };
        // Optionally, save changes to the backend here
        if(this.profile){
          this.recruiterService.updateRecruiterProfile(this.profile._id, result).subscribe(
            (updatedData) => {
              console.log(updatedData);
              this.cdr.detectChanges();
               this.toastr.success('Profile updated successfully','Success');
            },
            (error) => {
              this.toastr.error('Failed to update profile', 'Error');
            } 
          );
        }
        
      }
    });
  }

  openLocationForm(): void {
    this.showLocationForm = !this.showLocationForm;
  }

  addLocation(): void {
    if (this.newLocation.trim() !== '') {
      const locationToAdd = this.newLocation.trim();

      if (this.profile) {
        // Check if the location already exists
        if (this.profile.companyLocations.includes(locationToAdd)) {
          this.snackBar.open('Location already exists', 'Close', { duration: 3000 });
          this.newLocation = ''; // Clear input after showing the message
          return; // Exit the method without adding the location
        }

        // Add the location to profile.companyLocations
        this.profile.companyLocations.push(locationToAdd);

        // Update candidate locations via recruiterService
        this.recruiterService.updateCompanyLocations(this.profile.user_id, this.profile.companyLocations).subscribe(
          (response) => {
            this.snackBar.open('Location added successfully', 'Close', { duration: 3000 });
            this.newLocation = ''; // Clear input after adding location
            this.showLocationForm = false; // Close form after adding location
          },
          (error) => {
            this.snackBar.open('Failed to add location', 'Close', { duration: 3000 });
          }
        );
      }
    }
  }

  deleteLocation(location: string): void {
    if (this.profile) {
      const index = this.profile.companyLocations.indexOf(location);
      if (index !== -1) {
        this.profile.companyLocations.splice(index, 1);
        this.recruiterService.updateCompanyLocations(this.profile.user_id, this.profile.companyLocations).subscribe(
          (response) => {
            this.snackBar.open('Location deleted successfully', 'Close', { duration: 3000 });
            this.newLocation = ''; // Clear input after adding location
            this.showLocationForm = false; // Close form after adding location
          },
          (error) => {
            this.snackBar.open('Failed to add location', 'Close', { duration: 3000 });
          }
        );
      }
    }
  }
}

