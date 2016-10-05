import {Page, NavController, NavParams} from 'ionic-angular';
import {Storage, LocalStorage} from 'ionic-angular';
import {Component} from '@angular/core';
import * as moment from 'moment';

import {UsuarioService} from '../../services/UsuarioService';
import {EditarPerfilPage} from '../editar-perfil/editar-perfil';

@Page({
  templateUrl: 'build/pages/perfil/perfil.html',
  providers: [UsuarioService]
})
export class PerfilPage {

  static get parameters() {
    return [[NavController],[NavParams],[UsuarioService]];
  }

  private service : UsuarioService;
  private nav : NavController;
  public idUsuarioLogado : any;
  public idUsuario : number;
  private usuario : any;
  private retorno: any;
  private username : String;
  public local: Storage = new Storage(LocalStorage);

  constructor(nav, navParams, usuarioService) {
    this.service = usuarioService;
    this.nav = nav;
    this.usuario = {};
    this.init();
  }

  init(){
    this.local.get('idUsuario').then(profile => {
      this.idUsuarioLogado = JSON.parse(profile);

      this.service.pesquisaUsuarioPorId(this.idUsuarioLogado)
      .subscribe(
        data => this.retorno = data,
        err => this.logError(err),
        () => this.pesquisaComplete()
      );

    }).catch(error => {
      console.log(error);
    });
  }

  ionViewDidEnter() {
    if(this.nav.last().instance.atualizarPerfil){
      this.usuario = {};
      this.init();
    }
  }

  logError(err){
    console.log(err);
  }

  pesquisaComplete(){
    if(this.retorno != false){
      this.usuario = this.retorno;
      if(this.usuario.dataNascimento != null){
        let selectedDate = moment(this.usuario.dataNascimento, 'YYYY-MM-DD');
        this.usuario.dataNascimentoString = selectedDate.format('YYYY-MM-DD');
        this.usuario.idade = moment().diff(selectedDate, 'years');
      }
    }
  }


  logout(){
    this.local.clear();
    this.nav.pop();
  }


  editar(){
    this.nav.push(EditarPerfilPage, {idUsuarioLogado: this.idUsuarioLogado});
  }
}
