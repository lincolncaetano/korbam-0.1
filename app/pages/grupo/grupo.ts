import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Storage, LocalStorage} from 'ionic-angular';

import * as moment from 'moment';

import {CadastrarGrupoPage} from '../cadastrar-grupo/cadastrar-grupo';
import {CadastrarEventoPage} from '../cadastrar-evento/cadastrar-evento';
import {EventoPage} from '../evento/evento';

import {GrupoService} from '../../services/GrupoService';


@Component({
  templateUrl: 'build/pages/grupo/grupo.html',
  providers: [GrupoService]
})
export class GrupoPage {

  static get parameters() {
    return [[NavController],[NavParams],[GrupoService]];
  }

  public local: Storage = new Storage(LocalStorage);
  public nav: NavController;
  private service: GrupoService;

  private grupoRe: any;
  private nome: any;
  private segGrupo: any;

  private idUsuarioLogado: any;
  private idGrupo: any;
  private adminGrupo: any;

  private listaUsuarios: any;
  private isAdmin: any;
  private eventosGrupo: any;

  private usuarioEventoRe: any;

  constructor(nav, navParams, grupoService) {

    this.nav = nav;
    this.service = grupoService;

    this.segGrupo = "eventos";
    this.isAdmin = false;

    this.local.get('idUsuario').then(profile => {
      this.idUsuarioLogado = JSON.parse(profile);
    }).catch(error => {
      console.log(error);
    });

    this.idGrupo = navParams.data.idGrupo;

    this.service.pesquisaGrupoPorId(this.idGrupo)
    .subscribe(
      data => this.grupoRe = data,
      err => this.logError(err),
      () => this.buscaGrupoComplete()
    );

  }

  buscaGrupoComplete(){
    if(this.grupoRe != false){

      this.nome = this.grupoRe.nome;
      this.listaUsuarios = this.grupoRe.listaUsuario;
      this.adminGrupo = this.grupoRe.usuario;
      if(this.grupoRe.listaEvento != null){
        this.eventosGrupo = this.grupoRe.listaEvento;
        for(let evento of this.eventosGrupo){
          let selectedDate = moment(evento.dtInicio, moment.ISO_8601);
          evento.momento = selectedDate;
        }
      }else{
        this.eventosGrupo = {};
      }

      if(this.adminGrupo.id == this.idUsuarioLogado){
        this.isAdmin = true;
      }
    }
  }

  logError(err){
    console.log(err);
  }

  editarGrupo(){
    this.nav.push(CadastrarGrupoPage, {idUsuarioLogado: this.idUsuarioLogado, grupoEdit : this.grupoRe});
  }

  cadastrarEvento() {
    this.nav.push(CadastrarEventoPage, {idUsuarioLogado: this.idUsuarioLogado, grupo : this.grupoRe});
  }

  abrirEvento(item){

    this.service.pesquisaUsuarioEvento(this.idUsuarioLogado, item.id)
    .subscribe(
      data => this.usuarioEventoRe = data,
      err => this.logError(err),
      () => this.buscaUsuarioEventoComplete()
    );
  }

  buscaUsuarioEventoComplete(){
    if(this.usuarioEventoRe != false && this.usuarioEventoRe != true){
      this.nav.push(EventoPage, {idUsuarioLogado: this.idUsuarioLogado, usuarioEvento : this.usuarioEventoRe});
    }else if(this.usuarioEventoRe == true){
      var user ={

      }
    }
  }


}
