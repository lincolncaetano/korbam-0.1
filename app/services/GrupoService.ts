import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

import {ServerSettings} from './ServerSettings';

@Injectable()
export class GrupoService {

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

  buscaGruposIdUsuario(idUsuario){
    var url = ServerSettings.URL_SERVER+'/pesquisaGrupoPorUsuario/'+idUsuario;
    return this.http.get(url).map(res => res.json());
  }

  salvarGrupo(grupo) {
    var url = ServerSettings.URL_SERVER+'/salvarGrupo';
    return this.http.post(url, JSON.stringify({grupo : grupo}), {headers: this.headers}).map(res => res.json());
  }

  listaAmigos(id){
    //var url = 'http://localhost:8080/korbam/listaAmigos/'+id;
    var url = ServerSettings.URL_SERVER+'/listaAmigos/'+id;
    return this.http.get(url).map(res => res.json());
  }

  pesquisaGrupoPorId(idGrupo){
    var url = ServerSettings.URL_SERVER+'/pesquisaGrupoPorId/'+idGrupo;
    return this.http.get(url).map(res => res.json());
  }

  pesquisaUsuarioEvento(idUsuario,idEvento){
    var url = ServerSettings.URL_SERVER+'/pesquisaUsuarioEventoPorId/'+idUsuario+'/'+idEvento;
    return this.http.get(url).map(res => res.json());
  }

}
