import { Component, OnInit } from '@angular/core';
import { FlamelinkService } from '../../shared/flamelink.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'blog',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css', './../../app.component.css']
})
export class BlogListComponent implements OnInit {
  posts: Observable<any[]>;

  constructor(private flService: FlamelinkService) {
    this.posts = this.flService.getContent("blogs");
  }

  ngOnInit() {
  }

}
