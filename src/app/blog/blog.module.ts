import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common"
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogArticleComponent } from './blog-article/blog-article.component';
import { BlogRoutingModule } from './blog-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        BlogListComponent,
        BlogArticleComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        BlogRoutingModule
    ]
})
export class BlogModule {}