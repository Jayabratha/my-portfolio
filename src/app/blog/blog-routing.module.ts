import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogArticleComponent } from './blog-article/blog-article.component';
import { RouterModule } from '@angular/router';

const blogRoutes = [
  { path: '', component: BlogListComponent},
  { path: ':title', component: BlogArticleComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(blogRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class BlogRoutingModule { }
