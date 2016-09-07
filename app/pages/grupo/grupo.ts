import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Storage, LocalStorage} from 'ionic-angular';

import {CadastrarGrupoPage} from '../cadastrar-grupo/cadastrar-grupo';

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



}
