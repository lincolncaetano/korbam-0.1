import {Page, NavController, NavParams} from 'ionic-angular';

import {PerfilUsuarioPage} from '../perfil-usuario/perfil-usuario';
import {EventoPage} from '../evento/evento';

import {NotificaoService} from '../../services/NotificaoService';

import * as moment from 'moment';
/*
  Generated class for the NotificacoesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/notificacoes/notificacoes.html',
  providers: [NotificaoService]
})

export class NotificacoesPage {

  static get parameters() {
    return [[NavController],[NotificaoService],[NavParams]];
  }

  private nav : NavController;
  private service: NotificaoService;
  private idUsuarioLogado : number;
  private retorno: any;
  private notificacoes: any;
  private notificacoesAtualizar: Object[] = [];

  private usuarioEventoRe: any;

  constructor(nav,notificaoService,navParams) {
     this.nav = nav;
     this.service = notificaoService;
     this.idUsuarioLogado= navParams.data;
     this.notificacoes = [];

     this.service.buscaNotificacoes(this.idUsuarioLogado)
     .subscribe(
       data => this.retorno = data,
       err => this.logError(err),
       () => this.buscaNotifComplete()
     );
  }

  ionViewWillLeave(){
    for(let notificacao of this.notificacoes){
      if(notificacao.status == "P"){
        this.notificacoesAtualizar.push(notificacao);
      }
    }

    if(this.notificacoesAtualizar.length > 0){
      this.service.atualizaNotificacao(this.notificacoesAtualizar)
      .subscribe(
        data => this.retorno = data,
        err => this.logError(err),
        () => this.atualizacaoComplete()
      );
    }
  }

  atualizacaoComplete(){

  }

  buscaNotifComplete(){
    if(this.retorno != false){
      this.notificacoes = this.retorno;

      for(let notif of this.retorno){
        if(notif.evento != null){
          let selectedDate = moment(notif.evento.dtInicio, moment.ISO_8601);
          notif.evento.momento = selectedDate;
        }
      }
    }
  }

  logError(err){
    console.log(err);
  }

  goUsuario(idUsuario){
    this.nav.push(PerfilUsuarioPage, {idUsuario: idUsuario, idUsuarioLogado: this.idUsuarioLogado});
  }

  doRefresh(refresher) {
    this.service.buscaNotificacoes(this.idUsuarioLogado)
    .subscribe(
      data => this.retorno = data,
      err => this.logError(err),
      () => this.buscaNotifComplete()
    );

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }


  abrirEvento(item){

    this.service.pesquisaUsuarioEvento(this.idUsuarioLogado, item.evento.id)
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
