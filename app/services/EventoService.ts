import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class EventoService {

  public http:Http;
  private headers: Headers;
  //private urlServer = "http://192.168.0.30:8080/korbam";
  //private urlServer = "http://localhost:8080/korbam";
  private urlServer = "http://risidevelop.com.br/korbam";


  constructor(http) {
    this.http = http;

    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  static get parameters(){
     return [[Http]];
  }

  buscaListaUsuarioPorEvento(idEvento){
    var url = this.urlServer+'/buscaListaUsuarioPorEvento/'+idEvento;
    return this.http.get(url).map(res => res.json());
  }

}
