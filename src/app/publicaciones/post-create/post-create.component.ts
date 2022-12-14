import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {

 enteredTitle = '';
 enteredContent = '';
 form: FormGroup;
 imagePreview: string;
 private mode = 'create';
 private id: string;
 public post: Post;
 isLoading = false;

 constructor (public postService: PostService, public router: ActivatedRoute) {}

 ngOnInit(){

    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, {
        validators: [Validators.required]}),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]})

    });

    this.router.paramMap.subscribe((paramMap) => {
      if (paramMap.has('id')){

        console.log('ENTRA EN EDITAR');

        this.isLoading = true;
        this.mode = 'edit';
        this.id = paramMap.get('id');

        console.log('id = ' + this.id);

        this.postService.getPost(this.id).subscribe(postData => {
          this.isLoading = false;

          console.log('postData = ' + postData._id);

          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath};

          this.imagePreview = this.post.imagePath;

          console.log('POSSSST, ', this.post);
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content,
            'image': this.post.imagePath
          });
        });

      }else{
        this.mode = 'create';
        this.id = null;
      }
    });
 }


 onImagePicked(event: Event){
    const reader = new FileReader();
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    console.log('WOW =', file);
    console.log(this.form);
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


 onSavePost(){
  console.log('se ejecuta onSavePost');
  this.isLoading = true;

  if (this.mode === 'create'){
    this.postService.addPost(
      this.form.value.title,
      this.form.value.content,
      this.form.value.image
      );
  }else{
    console.log('Entra en editar');

    console.log('this.form.value.image = ' + this.form.value.image);
    if (this.form.value.image == this.imagePreview){
      this.form.value.image = this.imagePreview;
    }

    this.postService.updatePost(
      this.id,
      this.form.value.title,
      this.form.value.content,
      this.form.value.image
      );
  }

  //this.postService.addPost(form.value.title, form.value.content);

  this.form.reset();
 }

}
