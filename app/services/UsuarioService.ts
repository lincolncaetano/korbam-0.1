import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class UsuarioService {

  public http:Http;
  private headers: Headers;
  private urlServer = "http://risidevelop.com.br/korbam";
  //private urlServer = "http://localhost:8080/korbam";
  //private urlServer = "http://192.168.0.102:8080/korbam";

  constructor(http) {
    this.http = http;

    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  static get parameters(){
     return [[Http]];
  }

  loginUsuario(usuarioLog) {

        var url = this.urlServer+'/login';
        return this.http.post(url, JSON.stringify({usr : usuarioLog}), {headers: this.headers}).map(res => res.json());

    }

    cadastrarUsuario(usuarioCad) {

        //var url = 'http://localhost:8080/korbam/cadastrarUsuario';
        var url = this.urlServer+'/cadastrarUsuario';
        return this.http.post(url, JSON.stringify({usr : usuarioCad}), {headers: this.headers}).map(res => res.json());
    }

    editarUsuario(usuarioCad) {
        var url = this.urlServer+'/editarUsuario';
        return this.http.post(url, JSON.stringify({usr : usuarioCad}), {headers: this.headers}).map(res => res.json());
    }

    validaEmail(email){
      //var url = 'http://localhost:8080/korbam/validaEmail/'+email;
      var url = this.urlServer+'/validaEmail'+email;
      return this.http.get(url).map(res => res.json());
    }

    enviarToken(usuario){
      //var url = 'http://localhost:8080/korbam/enviarToken';
      var url = this.urlServer+'/enviarToken';
      return this.http.post(url, JSON.stringify({usr : usuario}), {headers: this.headers}).map(res => res.json());
    }

    alteraSenha(usuarioCad){

      //var url = 'http://localhost:8080/korbam/alteraSenha';
      var url = this.urlServer+'/alteraSenha';
      return this.http.post(url, JSON.stringify({usr : usuarioCad}), {headers: this.headers}).map(res => res.json());
    }

    pesquisaUsuario(username){
      //var url = 'http://localhost:8080/korbam/pesquisaUsuario/'+username;
      var url = this.urlServer+'/pesquisaUsuario/'+username;
      return this.http.get(url).map(res => res.json());
    }

    pesquisaUsuarioPorId(id){
      //var url = 'http://localhost:8080/korbam/pesquisaUsuarioPorId/'+id;
      var url = this.urlServer+'/pesquisaUsuarioPorId/'+id;
      return this.http.get(url).map(res => res.json());
    }

    salvarEvento(evento) {

        var url = this.urlServer+'/salvarEvento';
        return this.http.post(url, JSON.stringify({evento : evento}), {headers: this.headers}).map(res => res.json());
    }

    pesquisaEventoPorUsuario(id){
      var url = this.urlServer+'/pesquisaEventoPorUsuario/'+id;
      return this.http.get(url).map(res => res.json());
    }

    buscaEventoUsuarioPorUsuarioData(id, data){
      var url = this.urlServer+'/buscaEventoUsuarioPorUsuarioData/'+id+"/"+data;
      return this.http.get(url).map(res => res.json());
    }

    buscaUsuarioEventoPendente(id){
      var url = this.urlServer+'/buscaUsuarioEventoPendente/'+id;
      return this.http.get(url).map(res => res.json());
    }

    cadastrarTokenDevice(usuarioDevice) {
      var url = this.urlServer+'/cadastrarTokenDevice';
      return this.http.post(url, JSON.stringify({userDevice : usuarioDevice}), {headers: this.headers}).map(res => res.json());
    }

    buscaTodosUsuarioEventoPorIdUsuario(id){
      var url = this.urlServer+'/buscaTodosUsuarioEventoPorIdUsuario/'+id;
      return this.http.get(url).map(res => res.json());
    }

}
