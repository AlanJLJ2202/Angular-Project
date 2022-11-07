import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
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
 form: FormGroup;
 private mode = 'create';
 private id: string;
 public post: Post;
 isLoading = false;

 constructor (public postService: PostService, public router: ActivatedRoute) {}

 ngOnInit(){

    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
    });

    this.router.paramMap.subscribe((paramMap) => {
      if (paramMap.has('id')){
        this.isLoading = true;
        this.mode = 'edit';
        this.id = paramMap.get('id');
        this.postService.getPost(this.id).subscribe(postData => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content}
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content
          });
        });

      }else{
        this.mode = 'create';
        this.id = null;
      }
    });
 }



 onSavePost(){

  if(this.form.invalid){
    return;
  }

  this.isLoading = true;

  if (this.mode === 'create'){
    this.postService.addPost(this.form.value.title, this.form.value.content);
  }else{
    console.log('Entra en editar');
    this.postService.updatePost(this.id, this.form.value.title, this.form.value.content);
  }

  //this.postService.addPost(form.value.title, form.value.content);

  this.form.reset();
 }

}
