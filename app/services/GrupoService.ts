import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GrupoService {

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

  buscaGruposIdUsuario(idUsuario){
    var url = this.urlServer+'/pesquisaGrupoPorUsuario/'+idUsuario;
    return this.http.get(url).map(res => res.json());
  }

  salvarGrupo(grupo) {
    var url = this.urlServer+'/salvarGrupo';
    return this.http.post(url, JSON.stringify({grupo : grupo}), {headers: this.headers}).map(res => res.json());
  }

  listaAmigos(id){
    //var url = 'http://localhost:8080/korbam/listaAmigos/'+id;
    var url = this.urlServer+'/listaAmigos/'+id;
    return this.http.get(url).map(res => res.json());
  }

  pesquisaGrupoPorId(idGrupo){
    var url = this.urlServer+'/pesquisaGrupoPorId/'+idGrupo;
    return this.http.get(url).map(res => res.json());
  }

}
