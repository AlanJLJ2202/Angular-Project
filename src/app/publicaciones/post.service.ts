import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({providedIn: 'root'})

export class PostService {
  private posts : Post[] = []; //Primera matriz
  private postsUpdated = new Subject<Post[]>();

  /*getPosts(){
    return this.posts //Devuelve una copia de la matriz
  }*/


  getPosts(){
    return [...this.posts] //Devuelve una copia de la matriz
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }


  addPost(title: string, content: string){
    const post: Post = {title: title, content: content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }


}
