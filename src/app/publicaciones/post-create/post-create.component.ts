import { Component } from "@angular/core";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent{

  //materialangular.io
  //ng add @angular/material

 enteredValue = ''; //Cadena vacia

 newPost = ''; //Declaracion de variable vacía

 //onAddPost(postInput: HTMLTextAreaElement){
  //this.newPost = postInput.value;
 //}

onAddPost(){
  this.newPost = this.enteredValue;
 }

}
