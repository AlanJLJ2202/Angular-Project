import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Post } from "../post.model";
import { PostService } from "../post.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {

 enteredTitle = '';
 enteredContent = '';
 private mode = 'create';
 private id: string;
 public post: Post;

 constructor (public postService: PostService, public router: ActivatedRoute) {}

 ngOnInit(){
    this.router.paramMap.subscribe((paramMap) => {
      if (paramMap.has('id')){
        this.mode = 'edit';
        this.id = paramMap.get('id');
        this.postService.getPost(this.id).subscribe(postData => {
          this.post = {id: postData._id, title: postData.title, content: postData.content}
        });

      }else{
        this.mode = 'create';
        this.id = null;
      }
    });
 }



 onSavePost(form: NgForm){

  if(form.invalid){
    return;
  }

  if (this.mode === 'create'){
    this.postService.addPost(form.value.title, form.value.content);
  }else{
    console.log('Entra en editar');
    this.postService.updatePost(this.id, form.value.title, form.value.content);
  }

  //this.postService.addPost(form.value.title, form.value.content);

  if(form.submitted){
    form.resetForm();
  }

 }

}
