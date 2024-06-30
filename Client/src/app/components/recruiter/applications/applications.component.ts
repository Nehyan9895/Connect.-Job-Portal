import { Component } from '@angular/core';
import { FooterComponent } from "../../candidate/shared/footer/footer.component";
import { RecruiterHeaderComponent } from "../shared/recruiter-header/recruiter-header.component";
import { RecruiterSidebarComponent } from "../shared/recruiter-sidebar/recruiter-sidebar.component";

@Component({
    selector: 'app-applications',
    standalone: true,
    templateUrl: './applications.component.html',
    styleUrl: './applications.component.scss',
    imports: [FooterComponent, RecruiterHeaderComponent, RecruiterSidebarComponent]
})
export class ApplicationsComponent {

}
