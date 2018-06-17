import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class ElasticsearchService {

  constructor(private http: Http) {};

  isAvailable() {
    return this.http.get('https://us-central1-jayabratha-e7e73.cloudfunctions.net/isSearchAvailable');
  }

  search(keyWord) {
    return this.http.get('https://us-central1-jayabratha-e7e73.cloudfunctions.net/search?keyword=' + keyWord);
  }

}
