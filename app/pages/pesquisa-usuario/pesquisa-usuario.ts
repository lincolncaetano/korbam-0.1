import {Page, NavController} from 'ionic-angular';
import {Inject} from '@angular/core';

import {UsuarioService} from '../../services/UsuarioService';
import {PerfilPage} from '../perfil/perfil';


@Page({
  templateUrl: 'build/pages/pesquisa-usuario/pesquisa-usuario.html',
  providers: [UsuarioService],
})
export class PesquisaUsuarioPage {
  static get parameters() {
    return [[NavController],[UsuarioService]];
  }

  private nav: NavController;
  private service: UsuarioService;
  public searchQuery: String;
  public items: any;

  constructor(nav,service) {
    this.nav = nav;
    this.service = service;
    this.searchQuery = '';
  }

  onKey(){
    var q = this.searchQuery;
    if(q.trim() == '') { return this.items }

    this.service.pesquisaUsuario(q)
    .subscribe(data => this.items = data);
  }

  goUsuario(idUsuario){
    this.nav.push(PerfilPage, {idUsuario: idUsuario});
  }
}
