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
  }

  ngOnInit() {
    this.flService.getContent("projects").subscribe((projects) => {
      this.projects = projects.map((project) => {
        return Object.assign(project, {showTags: false});
      });
    });
  }

  toggleTagShow(project) {
    project.showTags = !project.showTags;
  }

}
