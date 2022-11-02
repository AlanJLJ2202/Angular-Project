import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({providedIn: 'root'})

export class PostService {
  private posts : Post[] = []; //Primera matriz
  private postUpdate = new Subject<Post[]>();

constructor(private http: HttpClient) {

}

  getPosts(){
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api.posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    }))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts;
      this.postUpdate.next([...this.posts]);
    });
  }

  getPost(id: string){
    return this.http.get<{_id: string, title: string, content: string}>("http://localhost:3000/api.posts/"+ id);
  }

  updatePost(id: string, title: string, content: string){
    const post: Post = {id: id, title: title, content: content};
    console.log('post = ' + post.title);

    this.http.put('http://localhost:3000/api.posts/' + id, post)
    .subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postUpdate.next([...this.posts]);
    });
  }

  getPostUpdateListener(){
    return this.postUpdate.asObservable();
  }


  addPost(title: string, content: string){
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string, _id: string}>('http://localhost:3000/api.posts', post)
    .subscribe((responseData) => {
      const id = responseData._id;
      post.id = id;
      this.posts.push(post);
      this.postUpdate.next([...this.posts]);
    });
  }

  deletePost(id: string){
    this.http.delete('http://localhost:3000/api.posts/' + id)
    .subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== id);
      this.posts = updatedPosts;
      this.postUpdate.next([...this.posts]);
    });

    //window.location.reload();
  }
}
