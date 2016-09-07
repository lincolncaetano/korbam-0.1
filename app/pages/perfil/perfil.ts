import {Page, NavController, NavParams} from 'ionic-angular';
import {Storage, LocalStorage} from 'ionic-angular';
import {Component} from '@angular/core';

import {AmizadeService} from '../../services/AmizadeService';
import {EditarPerfilPage} from '../editar-perfil/editar-perfil';

@Page({
  templateUrl: 'build/pages/perfil/perfil.html',
  providers: [AmizadeService]
})
export class PerfilPage {

  static get parameters() {
    return [[NavController],[NavParams],[AmizadeService]];
  }

  private service : AmizadeService;
  private nav : NavController;
  public idUsuarioLogado : any;
  public idUsuario : number;
  private usrRe : UsuarioInt;
  private username : String;
  public local: Storage = new Storage(LocalStorage);

  constructor(nav, navParams, amizadeService) {
    this.service = amizadeService;
    this.nav = nav;
    this.idUsuarioLogado= navParams.data;

    this.service.pesquisaUsuarioPorId(this.idUsuarioLogado)
    .subscribe(
      data => this.usrRe = data,
      err => this.logError(err),
      () => this.loginComplete()
    );

    //console.log(this.service.pesquisaUsuarioPorId(this.idUsuarioLogado));
    //this.username = "äsasas";

  }

  sucess(data){
    this.usrRe = data;
  }

  logError(err){
    console.log(err);
  }

  loginComplete(){
    this.username = this.usrRe.username;
  }


  mostrarOpcoes(elemento) {
    var e = document.getElementById(elemento);
    if (e.style.display == 'block')
        e.style.display = 'none';
    else
        e.style.display = 'block';
  }

  logout(){
    this.local.clear();
    this.nav.pop();
  }


  editar(){
    this.nav.push(EditarPerfilPage, {idUsuarioLogado: this.idUsuarioLogado});
  }
}

interface UsuarioInt {
    username: string;
}
