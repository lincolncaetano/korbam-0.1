import {Page, NavController} from 'ionic-angular';
import {Storage, LocalStorage} from 'ionic-angular';
import {Component} from '@angular/core';
import {UsuarioService} from '../../services/UsuarioService';

import {CadastroPage} from '../cadastro/cadastro';
import {EsqueceuSenhaPage} from '../esqueceu-senha/esqueceu-senha';
import {TabsPage} from '../tabs/tabs';

@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [UsuarioService]
})
export class HomePage {

  static get parameters() {
    return [[NavController],[UsuarioService]];
  }

  public name: String;
  public submitted : any;
  public login : any;
  public usrRe : any;
  public user : any;
  private service : UsuarioService;
  private nav : NavController;
  public local: Storage = new Storage(LocalStorage);

  constructor(nav,usuarioService) {

    this.nav = nav;
    this.service = usuarioService;
    this.name = "Nome";
    this.login = {};
    this.submitted = false;

    this.local.get('idUsuario').then(profile => {
      this.user = JSON.parse(profile);
      if(profile != null){

        this.nav.push(TabsPage, {idUsuarioLogado: profile});
      }
    }).catch(error => {
      console.log(error);
    });

  }

  onSubmit(form){

    //this.nav.push(TabsPage);

    if (form.valid) {

      var usuarioLog = {
        username: form.controls.username.value,
        password: form.controls.password.value
      };

      this.service.loginUsuario(usuarioLog)
      .subscribe(
        data => this.loginSucess(data),
        err => this.logError(err),
        () => this.loginComplete()
      );
    }

  }

  loginSucess(data){
      this.usrRe = data;
      this.local.set('idUsuario', data.id);
  }

  logError(err){

  }

  loginComplete(){

    if (this.usrRe != false && this.usrRe != null) {
      this.nav.push(TabsPage,{idUsuarioLogado: this.usrRe.id});
    }else {
      alert("USARIO OU SENHA INVALIDO");
    }

    console.log('Authentication Complete');

  }

  doSignup() {
    this.nav.push(CadastroPage);
  }

  forgotPwd() {
    this.nav.push(EsqueceuSenhaPage);
  }


}
