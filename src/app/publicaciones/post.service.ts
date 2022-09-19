import { Post } from './post.model';

export class PostService {
  private posts : Post[] = []; //Primera matriz

  getPosts(){
    return [...this.posts]; //Devuelve una copia de la matriz
  }


}
