import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({providedIn: 'root'})

export class PostService {
  private posts : Post[] = []; //Primera matriz
  private postUpdate = new Subject<Post[]>();

constructor(private http: HttpClient, private router: Router) {

}

  getPosts(){
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api.posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        };
      });
    }))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts;
      this.postUpdate.next([...this.posts]);
    });
  }

  getPost(id: string){
    console.log('ENTRA EN GETPOST');
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>("http://localhost:3000/api.posts/" + id);
  }

  updatePost(id: string, title: string, content: string, image: File | string){

    let postData: Post | FormData;
    postData = new FormData();

    if (typeof(image) === 'object'){

      console.log('ENTRA AL IF')

      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);

    }else{

      console.log('ENTRA AL ELSE');

      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('imagePath', image);

    }


    this.http.put('http://localhost:3000/api.posts/' + id, postData)
    .subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      const post: Post = {
        id: id,
        title: title,
        content: content,
        imagePath: ''
      };
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postUpdate.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  getPostUpdateListener(){
    return this.postUpdate.asObservable();
  }


  addPost(title: string, content: string, image: File){
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{message: string, post: Post}>
    ('http://localhost:3000/api.posts', postData)
    .subscribe((responseData) => {
      const post: Post = {
        id: responseData.post.id,
        title: title,
        content: content,
        imagePath: responseData.post.imagePath
      };

      this.posts.push(post);
      this.postUpdate.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost(id: string){
    console.log('ENTRA A DELETE');
    this.http.delete('http://localhost:3000/api.posts/' + id)
    .subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== id);
      this.posts = updatedPosts;
      this.postUpdate.next([...this.posts]);
    });

    //window.location.reload();
  }
}
