import {Page, NavController, NavParams} from 'ionic-angular';

import {CadastrarGrupoPage} from '../cadastrar-grupo/cadastrar-grupo';
import {GrupoPage} from '../grupo/grupo';

import {GrupoService} from '../../services/GrupoService';

@Page({
  templateUrl: 'build/pages/lista-grupos/lista-grupos.html',
  providers: [GrupoService]
})
export class ListaGruposPage {
  static get parameters() {
    return [[NavController],[NavParams],[GrupoService]];
  }

  private nav : NavController;
  private idUsuarioLogado : any;
  private service : any;
  private retorno : any;
  private meusGrupos : any;


  constructor(nav, navParams, grupoService) {
    this.nav = nav;
    this.idUsuarioLogado = navParams.data;
    this.service = grupoService;

    this.init();
  }

  ionViewDidEnter() {
    if(this.nav.last().instance.namePage == "UsuarioGrupoPage"){
      this.init();
    }
  }

  init(){
    this.service.buscaGruposIdUsuario(this.idUsuarioLogado)
    .subscribe(
      data => this.retorno = data,
      err => this.logError(err),
      () => this.buscaGrupoComplete()
    );
  }


  criarGrupo(){
    this.nav.push(CadastrarGrupoPage, {idUsuarioLogado: this.idUsuarioLogado});
  }

  abreGrupo(item){
    this.nav.push(GrupoPage, {idGrupo: item.id});
  }

  logError(err){
    console.log(err);
  }
  buscaGrupoComplete(){
    if(this.retorno != false){
      this.meusGrupos = this.retorno;
    }else{
      this.meusGrupos = [];
    }
  }

  doRefresh(refresher) {

    this.service.buscaGruposIdUsuario(this.idUsuarioLogado)
    .subscribe(
      data => this.retorno = data,
      err => this.logError(err),
      () => this.buscaGrupoComplete()
    );

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

}
