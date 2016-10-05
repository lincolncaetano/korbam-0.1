import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

import {ServerSettings} from './ServerSettings';

@Injectable()
export class EventoService {

  public http:Http;
  private headers: Headers;
  //private urlServer = "http://192.168.0.21:8080/korbam";
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
    var url = ServerSettings.URL_SERVER+'/buscaListaUsuarioPorEvento/'+idEvento;
    return this.http.get(url).map(res => res.json());
  }

  salvarUsuarioEvento(usuarioEvento) {
      var url = ServerSettings.URL_SERVER+'/salvarUsuarioEvento';
      return this.http.post(url, JSON.stringify({usuarioEvento : usuarioEvento}), {headers: this.headers}).map(res => res.json());
  }

  deteleUsuarioEvento(idUsuario, idEvento) {
      var url = ServerSettings.URL_SERVER+'/deteleUsuarioEvento'+'/'+idUsuario+'/'+idEvento;
      return this.http.delete(url,{headers: this.headers}).map(res => res.json());
  }

  detelaEventoEvento(idEvento) {
      var url = ServerSettings.URL_SERVER+'/detelaEvento'+'/'+idEvento;
      return this.http.delete(url,{headers: this.headers}).map(res => res.json());
  }

}
