import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminHeaderComponent } from "../shared/admin-header/admin-header.component";
import { AdminSideBarComponent } from "../shared/admin-side-bar/admin-side-bar.component";
import { CommonModule } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AdminBackendService } from '../../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { IRecruiter } from '../../../models/recruiter.model';

@Component({
    selector: 'app-recruiter-list',
    standalone: true,
    templateUrl: './recruiter-list.component.html',
    styleUrl: './recruiter-list.component.scss',
    imports: [AdminHeaderComponent, AdminSideBarComponent, CommonModule, MatPaginator, FooterComponent]
})
export class RecruiterListComponent implements OnInit{
    recruiters: IRecruiter[] = [];
    displayedUsers: IRecruiter[] = [];
    isLoading: boolean = true;
    isModalVisible = false;
    selectedUser: IRecruiter|undefined; 

    length = 0;
    pageSize = 5;
    pageIndex = 0;
    pageSizeOptions = [5, 10, 15];

    @ViewChild(MatPaginator) paginator !: MatPaginator;

    constructor(private adminBackend:AdminBackendService,private toastr:ToastrService){}

    ngOnInit(): void {
      this.loadUsers();
    }

    loadUsers(): void {
        this.adminBackend.getRecruiters().subscribe(
          data => {
            console.log(data.data);
            this.recruiters = data.data;
            this.length = this.recruiters.length;
            this.updateDisplayedUsers();
            this.isLoading = false;
          },
          error => {
            console.error('Error fetching recruiters:', error);
            this.isLoading = false;
          }
        );
      }

      updateDisplayedUsers(): void {
        const start = this.pageIndex * this.pageSize;
        const end = start + this.pageSize;
        this.displayedUsers = this.recruiters.slice(start, end);
      }
    
      handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.updateDisplayedUsers();
      }


      toggleVerificationStatus(user: IRecruiter): void {
        console.log(user);
        
        if (!user) {
          console.error('User data is not available');
          return;
        }
    
        const newStatus = !user.is_verified;
        this.adminBackend.updateRecruiterVerificationStatus(user._id, newStatus).subscribe({
          next:(updatedUser) => {
            if (updatedUser) {
              console.log(updatedUser);
              user.is_verified = updatedUser.data.is_verified;
    
              const status = updatedUser.data.is_verified ? 'Unblocked' : 'Blocked';
    
              if (updatedUser.data.is_verified) {
                this.toastr.success(`User is now ${status}`, 'Success');
              } else {
                this.toastr.warning(`User is now ${status}`, 'Warning');
              }
    
            } else {
              console.error('Failed to update user status');
              this.toastr.error('Failed to update user status', 'Error');
            }
          },
          error:(error) => {
            console.error('Error updating user status:', error);
            this.toastr.error('Error updating user status', 'Error');
          }
      });
      }

      showModal(recruiter: IRecruiter): void {
        this.selectedUser = recruiter;
        this.isModalVisible = true;
      }
    
      hideModal(): void {
        this.isModalVisible = false;
      }
    
      confirmAction(): void {
        if(this.selectedUser){
        this.toggleVerificationStatus(this.selectedUser)
        this.hideModal();
        }
      }
}
