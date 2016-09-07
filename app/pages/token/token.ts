import {Page, NavController} from 'ionic-angular';
import {Inject} from '@angular/core';

import {UsuarioService} from '../../services/UsuarioService';

@Page({
  templateUrl: 'build/pages/token/token.html',
  providers: [UsuarioService],
})
export class TokenPage {
  static get parameters() {
    return [[NavController],[UsuarioService]];
  }

  public name: String;
  public submitted : any;
  public login : any;
  public data1 : any;
  public usuario : any;
  private service : UsuarioService;
  private nav : NavController;

  constructor(nav,usuarioService) {
    this.nav = nav;
    this.service = usuarioService;
    this.usuario = {};
    this.submitted = false;
  }

  doSalvar(form){

    if(form.valid){

        var usuarioCad = {
          email: this.usuario.email,
          token: this.usuario.token,
          password: this.usuario.password
        };

        this.service.alteraSenha(usuarioCad)
        .subscribe(
          data => this.data1 = data,
          err => this.logError(err),
          () => console.log('Authentication Complete')
        );
    }
  }


  logError(err){
    console.log(err);
  }
}
