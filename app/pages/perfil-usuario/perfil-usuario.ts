import {Page, NavController, NavParams, PopoverController} from 'ionic-angular';
import {Storage, LocalStorage} from 'ionic-angular';
import {Component} from '@angular/core';

import {AmizadeService} from '../../services/AmizadeService';
import {PopoverPage} from './popover';

@Page({
  templateUrl: 'build/pages/perfil-usuario/perfil-usuario.html',
  providers: [AmizadeService]
})
export class PerfilUsuarioPage {

  static get parameters() {
    return [[NavController],[NavParams],[AmizadeService],[PopoverController]];
  }

  private service : AmizadeService;
  private nav : NavController;
  private idUsuario : any;
  private idUsuarioLogado : any;
  private usrRe : any;
  private amzRe : any;
  private username : String;
  public local: Storage = new Storage(LocalStorage);
  private popOver:PopoverController;
  private cancelarSolicitacao: boolean;

  constructor(nav, navParams, amizadeService, popoverController) {
    this.service = amizadeService;
    this.nav = nav;
    this.popOver = popoverController;
    this.idUsuario = navParams.get('idUsuario');
    this.idUsuarioLogado = navParams.get('idUsuarioLogado');

    this.service.pesquisaUsuarioPorId(this.idUsuario)
    .subscribe(
      data => this.usrRe = data,
      err => this.logError(err),
      () => this.loginComplete()
    );

  }

  loginComplete(){
    this.username = this.usrRe.username;
  }

  amizadeComplete(amizade){
    if(amizade != false){
      if(amizade.id.idUsuario == this.idUsuarioLogado && amizade.status=='P'){
        this.cancelarSolicitacao = true;
      }
    }
  }

  solicitaAmizade(){

    var amizade = {
      id:{
        idUsuario: this.idUsuarioLogado,
        idUsuarioSolicitato:this.idUsuario
      },
      status: 'P'
    };

    console.log(amizade);


    this.service.solicitaAmizade(amizade)
    .subscribe(
      data => this.usrRe = data,
      err => this.logError(err),
      () => this.AmizadeComplete()
    );
  }

  logError(err){
    console.log(err);
  }

  AmizadeComplete(){

  }

  presentPopover(myEvent) {
    let popover = this.popOver.create(PopoverPage,{
      usuario : this.usrRe,
      usuarioLogado: this.idUsuarioLogado,
      cancelarSolicitacao: this.cancelarSolicitacao
    });
    popover.present({
      ev: myEvent
    });
  }


  mostrarOpcoes(elemento) {
    var e = document.getElementById(elemento);
    if (e.style.display == 'block')
        e.style.display = 'none';
    else
        e.style.display = 'block';
  }
}
