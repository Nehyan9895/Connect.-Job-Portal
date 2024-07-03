import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recruiter-header',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './recruiter-header.component.html',
  styleUrl: './recruiter-header.component.scss'
})
export class RecruiterHeaderComponent {
  
  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('-translate-x-full');
    }
  }


}
