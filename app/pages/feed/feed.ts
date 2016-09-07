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
  private idUsuarioLogado : any;

  constructor(nav,service,navParams) {
    this.nav = nav;
    this.service = service;
    this.searchQuery = '';

    this.idUsuarioLogado = navParams.data;
  }

  onKey(){
    var q = this.searchQuery;
    if(q.trim() == '') {
      this.items = [];
      return this.items;
    }

    this.service.pesquisaUsuario(q)
    .subscribe(data => this.items = data);
  }

  goUsuario(idUsuario){
    this.nav.push(PerfilUsuarioPage, {idUsuario: idUsuario, idUsuarioLogado: this.idUsuarioLogado});
  }
}
