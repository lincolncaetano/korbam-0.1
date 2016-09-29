import {Page, NavController, NavParams} from 'ionic-angular';

import {PerfilUsuarioPage} from '../perfil-usuario/perfil-usuario';

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

  constructor(nav,notificaoService,navParams) {
     this.nav = nav;
     this.service = notificaoService;
     this.idUsuarioLogado= navParams.data;

     this.service.buscaNotificacoes(this.idUsuarioLogado)
     .subscribe(
       data => this.retorno = data,
       err => this.logError(err),
       () => this.buscaNotifComplete()
     );
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

}
