import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AmizadeService {

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

  pesquisaUsuarioPorId(id){
      //var url = 'http://localhost:8080/korbam/pesquisaUsuarioPorId/'+id;
      var url = this.urlServer+'/pesquisaUsuarioPorId/'+id;
      return this.http.get(url).map(res => res.json());
    }

    solicitaAmizade(amizade) {

        //var url = 'http://localhost:8080/korbam/solicitaAmizade';
        var url = this.urlServer+'/solicitaAmizade';
        return this.http.post(url, JSON.stringify({amz : amizade}), {headers: this.headers}).map(res => res.json());
    }

    listaAmigos(id){
      //var url = 'http://localhost:8080/korbam/listaAmigos/'+id;
      var url = this.urlServer+'/listaAmigos/'+id;
      return this.http.get(url).map(res => res.json());
    }

    salvarEvento(evento) {

        //var url = 'http://localhost:8080/korbam/salvarEvento';
        var url = this.urlServer+'/salvarEvento';
        return this.http.post(url, JSON.stringify({evento : evento}), {headers: this.headers}).map(res => res.json());
    }

  buscaAmizadeId(idUsuario,idUsuarioSolicitado){
    var url = this.urlServer+'/buscaAmizadeId/'+idUsuario+'/'+idUsuarioSolicitado;
    return this.http.get(url).map(res => res.json());
  }

  cancelarAmizade(amizade) {
      var url = this.urlServer+'/cancelarAmizade'+'/'+amizade.id.idUsuario+'/'+amizade.id.idUsuarioSolicitato;
      return this.http.delete(url,{headers: this.headers}).map(res => res.json());
  }

}
