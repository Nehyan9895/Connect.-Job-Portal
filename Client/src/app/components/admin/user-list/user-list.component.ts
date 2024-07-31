import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminHeaderComponent } from "../shared/admin-header/admin-header.component";
import { AdminSideBarComponent } from "../shared/admin-side-bar/admin-side-bar.component";
import { AdminBackendService } from '../../../services/admin.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { ICandidate } from '../../../models/candidate.model';

@Component({
    selector: 'app-user-list',
    standalone: true,
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss',
    imports: [AdminHeaderComponent, AdminSideBarComponent, CommonModule, MatPaginator, FooterComponent]
})
export class UserListComponent implements OnInit {
  users: ICandidate[] = [];
  displayedUsers: ICandidate[] = [];
  isLoading: boolean = true;
  isModalVisible = false;
  selectedUser: ICandidate|undefined; 

  length = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 15];

  @ViewChild(MatPaginator) paginator !: MatPaginator;

  constructor(private adminBackend: AdminBackendService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminBackend.getUsers().subscribe(
      data => {
        this.users = data.data;
        console.log(data.data);
        
        this.length = this.users.length;
        this.updateDisplayedUsers();
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching users:', error);
        this.isLoading = false;
      }
    );
  }

  updateDisplayedUsers(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.displayedUsers = this.users.slice(start, end);
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedUsers();
  }

  toggleVerificationStatus(user: ICandidate): void {
    if (!user) {
      console.error('User data is not available');
      return;
    }

    

    const newStatus = !user.is_verified;
    this.adminBackend.updateUserVerificationStatus(user._id, newStatus).subscribe({
      next: (updatedUser) => {
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
      error: (error) => {
        console.error('Error updating user status:', error);
        this.toastr.error('Error updating user status', 'Error');
      }
    });
  }

  showModal(user: ICandidate): void {
    this.selectedUser = user;
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