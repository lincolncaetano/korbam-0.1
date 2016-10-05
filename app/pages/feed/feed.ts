import {Page, NavController, NavParams} from 'ionic-angular';
import {PesquisaUsuarioPage} from '../pesquisa-usuario/pesquisa-usuario';
import {UsuarioService} from '../../services/UsuarioService';
import {PerfilUsuarioPage} from '../perfil-usuario/perfil-usuario';


@Page({
  templateUrl: 'build/pages/feed/feed.html',
  providers: [UsuarioService],
})
export class FeedPage {

  static get parameters() {
    return [[NavController],[UsuarioService],[NavParams]];
  }

  private nav: NavController;
  private service: UsuarioService;
  public searchQuery: String;
  public items: any;
  public retorno: any;
  private idUsuarioLogado : any;

  constructor(nav,service,navParams) {
    this.nav = nav;
    this.service = service;
    this.searchQuery = '';

    this.idUsuarioLogado = navParams.data;
  }

  onKey(event){
    var q = event.target.value;
    if(q != ''){
      this.service.pesquisaUsuario(q)
      .subscribe(
        data => this.retorno = data,
        err => this.logError(err),
        () => this.pesquisaComplete()
      );
    }else{
      this.items = [];
    }

  }

  pesquisaComplete(){
    if(this.retorno != null){
      this.items = this.retorno;
    }else{
      this.items = [];
    }
  }

  logError(err){
    console.log(err)
  }

  goUsuario(idUsuario){
    this.nav.push(PerfilUsuarioPage, {idUsuario: idUsuario, idUsuarioLogado: this.idUsuarioLogado});
  }
}
