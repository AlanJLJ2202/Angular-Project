import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Post } from "../post.model";
import { PostService } from "../post.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})


export class PostListComponent implements OnInit, OnDestroy {

 posts: Post[] = [];
 isLoading = false;
 private postsSub: Subscription;

 constructor(public postService: PostService) {}

 ngOnInit(){
   this.isLoading = true;
   this.postService.getPosts();
   this.postsSub = this.postService.getPostUpdateListener()
   .subscribe((posts: Post[]) => {
      this.posts = posts;
      this.isLoading = false;
   });
 }

 ngOnDestroy(){
    this.postsSub.unsubscribe();
 }

 onDelete(_id: string){
   this.postService.deletePost(_id);
 }

}


