import {Page, NavController, Platform} from 'ionic-angular';
import {Storage, LocalStorage} from 'ionic-angular';
import {Push} from 'ionic-native';
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
    return [[NavController],[UsuarioService], [Platform]];
  }

  public name: String;
  public submitted : any;
  public login : any;
  public usrRe : any;
  public user : any;
  private service : UsuarioService;
  private nav : NavController;
  public local: Storage = new Storage(LocalStorage);
  private platform : Platform;

  constructor(nav,usuarioService, platform) {

    this.nav = nav;
    this.service = usuarioService;
    this.platform = platform;
    this.name = "Nome";
    this.login = {};
    this.submitted = false;



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
    console.log(err);
  }

  loginComplete(){

    if (this.usrRe != false && this.usrRe != null) {

      let push = Push.init({
          android: {
              senderID: "325117634477",
              icon: "icon",
          },
          ios: {
              alert: "true",
              badge: true,
              sound: 'true'
          },
          windows: {}
      });

      push.on('registration', (data) => {

        var platf;
        if(this.platform.is('ios')){
          platf = "I";
        }else{
          platf = "A";
        }

        var usuarioDevice = {
          usuario:{
            id: this.usrRe.id
          },
          tokenDevice: data.registrationId,
          tipoDevice: platf
        };

        this.service.cadastrarTokenDevice(usuarioDevice)
        .subscribe(
          data => this.cadUserDevSucess(data),
          err => this.logError(err),
          () => this.cadUserDevComplete()
        );


      });

      push.on('notification', (data) => {
          console.log(data.message);
          console.log(data.title);
          console.log(data.count);
          console.log(data.sound);
          console.log(data.image);
          console.log(data.additionalData);
      });

      push.on('error', (e) => {
          console.log(e.message);
      });


      this.nav.push(TabsPage,{idUsuarioLogado: this.usrRe.id});


    }else {
      alert("USUARIO OU SENHA INVALIDO");
    }

    console.log('Authentication Complete');

  }

  cadUserDevSucess(data){
      this.local.set('tokenDevice', data.tokenDevice);
  }

  cadUserDevComplete(){

  }

  doSignup() {
    this.nav.push(CadastroPage);
  }

  forgotPwd() {
    this.nav.push(EsqueceuSenhaPage);
  }


}
