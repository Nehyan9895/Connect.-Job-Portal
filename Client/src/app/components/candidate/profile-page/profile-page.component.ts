import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { FooterComponent } from "../shared/footer/footer.component";
import { userService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddEducationModalComponent } from '../add-education-modal/add-education-modal.component';
import { ExperienceModalComponent } from '../experience-modal/experience-modal.component';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatChip, MatChipsModule } from '@angular/material/chips';
import { MatInput, MatInputModule } from '@angular/material/input';
import { allSkills } from '../../../constants/skills.constant';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';
import { ChangeDetectorRef } from '@angular/core';
import { BasicCandidateData, CandidateData, CandidateDetail, Education, EducationData, ExperienceData } from '../../../models/candidateData.interface';
import { JobApplicationStatistics } from '../../../models/userResponseModel';


@Component({
  selector: 'app-profile-page',
  standalone: true,
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  imports: [HeaderComponent, FooterComponent, CommonModule, AddEducationModalComponent,MatDialogModule,FormsModule,MatIcon,MatChip,MatInputModule,MatChipsModule,MatAutocompleteModule,],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnInit {
  newSkill: string = '';
  showSkillForm: boolean = false;
  allSkills = allSkills
  filteredSkills: string[] = this.allSkills;
  experience: ExperienceData | undefined;
  education: Education | undefined;
  candidateData: CandidateData |null = null ;
  candidateEmail: string | undefined;
  isModalVisible = false;
  showEditProfileModal = false;
  
  statistics:JobApplicationStatistics = {
    jobsApplied: 0,
    reviewed: 0,
    resumeViewed: 0,
    accepted: 0,
    rejected: 0,
  };

  constructor(
    private userService: userService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const candidateId = localStorage.getItem('user_id');
    this.candidateEmail = localStorage.getItem('candidateEmail') as string;
    if (candidateId) {
      this.getUserDetails(candidateId);
      this.getApplicationStatistics(candidateId);
    }
  }

  getUserDetails(candidateId: string) {
    this.userService.getCandidateDetails(candidateId).subscribe((user) => {
      this.candidateData = user.data;
      
    });
  }

  getApplicationStatistics(candidateId: string) {
    this.userService.getJobApplicationStatistics(candidateId).subscribe(
      (data) => {
        this.statistics = data.data;
      },
      (error) => {
        this.toastr.error('Failed to load job statistics', 'Error');
      }
    );
  }

  //edit profile modal operations
  openEditProfileModal(): void {
    const dialogRef = this.dialog.open(EditProfileModalComponent, {
      data: { candidateData: this.candidateData }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateCandidateProfile(result);
      }
    });
  }

  updateCandidateProfile(profileData: BasicCandidateData): void {
    if(this.candidateData){
      const candidateId = this.candidateData._id;
      const userId = this.candidateData.user_id
    this.userService.updateCandidateProfile(candidateId, profileData).subscribe(
      (updatedData) => {
        console.log(updatedData);
        this.candidateData = { ...this.candidateData, ...updatedData.data };
        this.cdr.detectChanges();
        this.toastr.success('Profile updated successfully','Success');
      },
      (error) => {
        this.toastr.error('Failed to update profile', 'Error');
      } 
    );
  }
  }




  // Education Modal Operations
  openAddEducationModal() {
    const dialogRef = this.dialog.open(AddEducationModalComponent, {
      data: { education: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if(this.candidateData){
        this.candidateData.education.push(result);
        this.userService
          .updateCandidateEducation(this.candidateData.user_id, this.candidateData.education)
          .subscribe(
            (response) => {
              this.cdr.detectChanges();
              this.toastr.success('Education added successfully', 'Success');
            },
            (error) => {
              this.toastr.error('Failed to add education', 'Error');
            }
          );
      }
    }
    });
  
  }

  openEditEducationModal(education: Education) {
    const dialogRef = this.dialog.open(AddEducationModalComponent, {
      data: { education },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if(this.candidateData){
        const index = this.candidateData.education.findIndex(
          (edu: Education) => edu === education
        );
        this.candidateData.education[index] = result;
        this.userService
          .updateCandidateEducation(this.candidateData.user_id, this.candidateData.education)
          .subscribe(
            (response) => {
              this.cdr.detectChanges();
              this.toastr.success('Education updated successfully');
            },
            (error) => {
              this.toastr.error('Failed to update education', 'Error');
            }
          );
      }
    }
    });
  }

  deleteEducation(education: Education) {
    if(this.candidateData){
    const index = this.candidateData.education.findIndex((edu: Education) => edu === education);
    if (index !== -1) {
      this.candidateData.education.splice(index, 1);
      this.userService
        .updateCandidateEducation(this.candidateData.user_id, this.candidateData.education)
        .subscribe(
          (response) => {
            this.cdr.detectChanges();
            this.toastr.success('Education deleted successfully', 'Success');
          },
          (error) => {
            this.toastr.error('Failed to delete education', 'Error');
          }
        );
    }
  }
  }

  // Experience Modal Operations
  openAddExperienceModal() {
    if(this.candidateData){
    const dialogRef = this.dialog.open(ExperienceModalComponent, {
      
      data: { experience: null,existingExperiences:this.candidateData.experience.length },
    });
    

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if(this.candidateData){
        if(this.candidateData.experience[0].isFresher){
          this.candidateData.experience.shift()
        }
        this.candidateData.experience.push(result);
        this.userService
          .updateCandidateExperience(this.candidateData.user_id, this.candidateData.experience)
          .subscribe(
            (response) => {
              this.cdr.detectChanges();
              this.toastr.success('Experience added successfully', 'Success');
            },
            (error) => {
              this.toastr.error('Failed to add experience', 'Error');
            }
          );
      }
    }
    });
    }
  }

  openEditExperienceModal(experience: ExperienceData) {
    if(this.candidateData){
    const dialogRef = this.dialog.open(ExperienceModalComponent, {
      data: { experience,existingExperienceLength:this.candidateData.experience.length },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if(this.candidateData){
        const index = this.candidateData.experience.findIndex(
          (exp: ExperienceData) => exp === experience
        );
        this.candidateData.experience[index] = result;
        this.userService
          .updateCandidateExperience(this.candidateData.user_id, this.candidateData.experience)
          .subscribe(
            (response) => {
              this.cdr.detectChanges();
              this.toastr.success('Experience updated successfully');
            },
            (error) => {
              this.toastr.error('Failed to update experience', 'Error');
            }
          );
      }
    }
    });
  }
  }

  deleteExperience(experience: ExperienceData) {
    if(this.candidateData){
    const index = this.candidateData.experience.findIndex((exp: ExperienceData) => exp === experience);
    if (index !== -1) {
      this.candidateData.experience.splice(index, 1);
      
      this.userService
        .updateCandidateExperience(this.candidateData.user_id, this.candidateData.experience)
        .subscribe(
          (response) => {
            this.cdr.detectChanges();
            this.toastr.success('Experience deleted successfully', 'Success');
          },
          (error) => {
            this.toastr.error('Failed to delete experience', 'Error');
          }
        );
      }
    }
  }

  openSkillForm() {
    this.showSkillForm = !this.showSkillForm;
  }

  addSkill() {
    if (this.newSkill.trim() !== '') {
      const skillToAdd = this.newSkill.trim();
      
      if(this.candidateData){
      // Check if the skill already exists
      if (this.candidateData.skills.includes(skillToAdd)) {
        this.snackBar.open('Skill already exists', 'Close', { duration: 3000 });
        this.newSkill = ''; // Clear input after showing the message
        return; // Exit the method without adding the skill
      }
  
      // Add the skill to candidateData.skills
      this.candidateData.skills.push(skillToAdd);
  
      // Update candidate skills via userService
      this.userService.updateCandidateSkills(this.candidateData.user_id, this.candidateData.skills).subscribe(
        (response) => {
          this.snackBar.open('Skill added successfully', 'Close', { duration: 3000 });
          this.newSkill = ''; // Clear input after adding skill
          this.showSkillForm = false; // Close form after adding skill
        },
        (error) => {
          this.snackBar.open('Failed to add skill', 'Close', { duration: 3000 });
        }
      );
    }
  }
  }
  

  deleteSkill(skill: string) {
    if(this.candidateData){
    const index = this.candidateData.skills.indexOf(skill);
    if (index !== -1) {
      this.candidateData.skills.splice(index, 1);
      this.userService.updateCandidateSkills(this.candidateData.user_id, this.candidateData.skills).subscribe(
        (response) => {
          this.snackBar.open('Skill deleted successfully', 'Close', { duration: 3000 });
        },
        (error) => {
          this.snackBar.open('Failed to delete skill', 'Close', { duration: 3000 });
          // Re-add skill on error for a better UX, or handle error as per application logic
          // this.candidateData.skills.splice(index, 0, skill);
        }
      );
    }
  }
  }

  selected() {
  }

  
  isEducation(item: CandidateDetail | undefined): item is Education {
    return item !== undefined && 'qualification' in item && 'passoutYear' in item;
  }
  
  isExperienceData(item: CandidateDetail | undefined): item is ExperienceData {
    return item !== undefined && 'jobRole' in item && 'companyName' in item;
  }
  



  showModal(type: string, item: CandidateDetail | undefined): void {
    if (type === 'education' && this.isEducation(item)) {
      this.education = item;
      this.isModalVisible = true;
    } else if (type === 'experience' && this.isExperienceData(item)) {
      this.experience = item;
      this.isModalVisible = true;
    }
  }
  

  hideModal(): void {
    this.isModalVisible = false;
  }

  confirmAction(): void {
    if(this.education){
      this.deleteEducation(this.education)
    }else if(this.experience){
      this.deleteExperience(this.experience)
    }
    this.hideModal();
  }

}

