import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Storage, LocalStorage} from 'ionic-angular';

import {CadastrarEventoPage} from '../cadastrar-evento/cadastrar-evento';
import {EventoService} from '../../services/EventoService';

@Component({
  templateUrl: 'build/pages/evento/evento.html',
  providers: [EventoService]
})
export class EventoPage {

  static get parameters() {
    return [[NavController],[NavParams],[EventoService]];
  }

  public nav: NavController;
  public local: Storage = new Storage(LocalStorage);

  private service : EventoService;
  private segEvento : any;
  private evento : any;

  private usuEvenResp : any;
  private listaUsuarios : any;
  private isAdmin : any;
  private idUsuarioLogado : any;

  constructor(nav, navParams, eventoService) {

    this.nav = nav;
    this.segEvento = "descricao";
    this.service = eventoService;

    this.local.get('idUsuario').then(profile => {
      this.idUsuarioLogado = JSON.parse(profile);
    }).catch(error => {
      console.log(error);
    });



    this.idUsuarioLogado = navParams.get("idUsuarioLogado");
    this.evento = navParams.get("eventoSel");
    if(this.evento!= null){
      console.log(this.evento);
    }

    if(this.evento.usuario.id == this.idUsuarioLogado){
      this.isAdmin = true;
    }

    this.service.buscaListaUsuarioPorEvento(this.evento.id)
    .subscribe(
      data => this.usuEvenResp = data,
      err => this.logError(err),
      () => this.buscaUsuarioEventoComplete()
    );
  }

  logError(err){
    console.log(err);
  }

  buscaUsuarioEventoComplete(){
    if(this.usuEvenResp != false){
      this.listaUsuarios = this.usuEvenResp;
    }
  }

  editarEvento() {
    this.nav.push(CadastrarEventoPage, {idUsuarioLogado: this.idUsuarioLogado, eventoSel : this.evento});
  }

}
