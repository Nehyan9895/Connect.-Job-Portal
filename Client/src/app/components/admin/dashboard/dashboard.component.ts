import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { AdminBackendService } from '../../../services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { AdminHeaderComponent } from "../shared/admin-header/admin-header.component";
import { AdminSideBarComponent } from "../shared/admin-side-bar/admin-side-bar.component";
import { FooterComponent } from '../../candidate/shared/footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { IRecruiter } from '../../../models/recruiter.model';
import { ICandidate } from '../../../models/candidate.model';

interface ChartDataPoint {
  label: string;
  y: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AdminHeaderComponent, AdminSideBarComponent, FooterComponent, RouterLink, CanvasJSAngularChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  recruiters: IRecruiter[] = [];
  users: ICandidate[] = [];
  chartOptions = {
    animationEnabled: true,
    title: {
      text: "Recruiters and Users Distribution"
    },
    data: [{
      type: "pie",
      startAngle: -90,
      indexLabel: "{label}: {y}",
      yValueFormatString: "#,###.##'%'",
      dataPoints: [] as ChartDataPoint[]
    }]
  };

  constructor(
    private adminBackend: AdminBackendService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchRecruiters();
    this.fetchUsers();
  }



  fetchRecruiters(): void {
    this.adminBackend.getRecruiters().subscribe(
      data => {
        this.recruiters = data.data;
        this.updateChartData();
      },
      error => {
        console.error('Error fetching recruiters:', error);
      }
    );
  }

  fetchUsers(): void {
    this.adminBackend.getUsers().subscribe(
      data => {
        this.users = data.data;
        this.updateChartData();
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

  updateChartData(): void {
    const recruiterCount = this.recruiters.length;
    const userCount = this.users.length;
    const adminCount = 1; // Assuming there's 1 admin
  
    // Calculate the total count
    const totalCount = recruiterCount + userCount + adminCount;
  
    // Calculate the percentage for each category
    const recruiterPercentage = (recruiterCount / totalCount) * 100;
    const userPercentage = (userCount / totalCount) * 100;
    const adminPercentage = (adminCount / totalCount) * 100;
  
    console.log('Recruiter Count:', recruiterCount);
    console.log('User Count:', userCount);
    console.log('Admin Count:', adminCount);
    console.log('Total Count:', totalCount);
  
    // Update the chart data
    this.chartOptions.data[0].dataPoints = [
      { label: "Recruiters", y: recruiterPercentage },
      { label: "Candidates", y: userPercentage },
      { label: "Admin", y: adminPercentage }
    ];

    // Trigger chart update
    this.cdr.detectChanges(); 
  }

  

  logout(): void {
    this.adminBackend.logout();
    this.toastr.success('Logout Successfully', 'Success');
  }
}
