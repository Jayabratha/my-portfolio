import { Component, OnInit } from '@angular/core';
import { FlamelinkService } from '../shared/flamelink.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css', './../app.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Observable<any[]>;

  constructor(private flService: FlamelinkService) {
    this.projects = this.flService.getContent("projects");
  }

  ngOnInit() {
  }

}
