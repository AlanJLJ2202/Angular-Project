import { Component } from "@angular/core";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})


export class PostListComponent{
 posts = [
   {title: 'Primer post', content: 'Este es el primer post'},
   {title: 'Segundo post', content: 'Este es el segundo post'},
   {title: 'Tercer post', content: 'Este es el tercer post'},
 ];
}
