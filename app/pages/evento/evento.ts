import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController , AlertController} from 'ionic-angular';
import {Storage, LocalStorage} from 'ionic-angular';
import * as moment from 'moment';
import {LocalNotifications} from 'ionic-native';

import {CadastrarEventoPage} from '../cadastrar-evento/cadastrar-evento';
import {PerfilUsuarioPage} from '../perfil-usuario/perfil-usuario';
import {UsuarioEventoPage} from '../usuario-evento/usuario-evento';
import {EventoService} from '../../services/EventoService';

@Component({
  templateUrl: 'build/pages/evento/evento.html',
  providers: [EventoService]
})
export class EventoPage {

  static get parameters() {
    return [[NavController],[NavParams],[EventoService],[ActionSheetController],[AlertController]];
  }

  public nav: NavController;
  public local: Storage = new Storage(LocalStorage);

  private service : EventoService;
  private segEvento : any;
  private usuarioEvento : any;

  private usuEvenResp : any;
  private listaUsuarios : any;
  private isAdmin : any;
  private idUsuarioLogado : any;
  private retonorSalvarUsuarioEvento : any;
  private actionSheetCtrl : ActionSheetController;
  private alertCtrl : AlertController;

  constructor(nav, navParams, eventoService, actionSheetCtrl, alertCtrl) {

    this.nav = nav;
    this.actionSheetCtrl = actionSheetCtrl;
    this.alertCtrl = alertCtrl;
    this.segEvento = "descricao";
    this.service = eventoService;

    this.local.get('idUsuario').then(profile => {
      this.idUsuarioLogado = JSON.parse(profile);
    }).catch(error => {
      console.log(error);
    });



    this.idUsuarioLogado = navParams.get("idUsuarioLogado");
    this.usuarioEvento = navParams.get("usuarioEvento");
    if(this.usuarioEvento!= null){

      if(this.usuarioEvento.evento.usuario.id == this.idUsuarioLogado){
        this.isAdmin = true;
      }

      this.service.buscaListaUsuarioPorEvento(this.usuarioEvento.evento.id)
      .subscribe(
        data => this.usuEvenResp = data,
        err => this.logError(err),
        () => this.buscaUsuarioEventoComplete()
      );
    }

    let selectedDate = moment(this.usuarioEvento.evento.dtInicio, 'YYYY-MM-DD');
    this.usuarioEvento.evento.dtInicioString = selectedDate.format('YYYY-MM-DD');


  }

  logError(err){
    console.log(err);
  }

  buscaUsuarioEventoComplete(){
    if(this.usuEvenResp != false){
      this.listaUsuarios = this.usuEvenResp;
      this.usuarioEvento.evento.listaUsuario = this.listaUsuarios;
    }
  }



  respostaConvite(resposta){

    this.usuarioEvento.id = {
      idUsuario : this.usuarioEvento.usuario.id,
      idEvento : this.usuarioEvento.evento.id
    }
    this.usuarioEvento.status = resposta;

    this.service.salvarUsuarioEvento(this.usuarioEvento)
    .subscribe(
      data => this.retonorSalvarUsuarioEvento = data,
      err => this.logError(err),
      () => this.salvarUsuarioEventoComplete()
    );

  }

  salvarUsuarioEventoComplete(){
    if(this.retonorSalvarUsuarioEvento != null && this.retonorSalvarUsuarioEvento != false){
      if(this.usuarioEvento.status == 'A'){
        this.salvarLembrete();
      }
    }
  }

  salvarLembrete(){

    let dateAlarme0 = moment(this.usuarioEvento.evento.dtInicioString+" "+this.usuarioEvento.evento.hrInicial, 'YYYY-MM-DD HH:mm');
    let dateAlarme1 = this.configuraAlerta(this.usuarioEvento.evento.lembrete1);
    let dateAlarme2 = this.configuraAlerta(this.usuarioEvento.evento.lembrete2);

    var id0 = parseInt(this.usuarioEvento.evento.id+"0");
    var id1 = parseInt(this.usuarioEvento.evento.id+"1");
    var id2 = parseInt(this.usuarioEvento.evento.id+"2");

    LocalNotifications.schedule({
       id: id0,
       text: 'Delayed Notification',
       at: dateAlarme0.toDate(),
       led: 'FF0000',
       sound: 'file://beep.caf'
    });

    LocalNotifications.schedule({
       id: id1,
       text: 'Delayed Notification',
       at: dateAlarme1.toDate(),
       led: 'FF0000',
       sound: 'file://beep.caf'
    });

    LocalNotifications.schedule({
       id: id2,
       text: 'Delayed Notification',
       at: dateAlarme2.toDate(),
       led: 'FF0000',
       sound: 'file://beep.caf'
    });

    this.nav.popToRoot();


  }

  configuraAlerta(codLembrete){

    if(codLembrete == 1){
      return moment(this.usuarioEvento.evento.dtInicioString+" "+this.usuarioEvento.evento.hrInicial, 'YYYY-MM-DD HH:mm').subtract(2, "minutes");
    }else if(codLembrete == 2){
      return moment(this.usuarioEvento.evento.dtInicioString+" "+this.usuarioEvento.evento.hrInicial, 'YYYY-MM-DD HH:mm').subtract(1, "hours");
    }else if(codLembrete == 3){
      return moment(this.usuarioEvento.evento.dtInicioString+" "+this.usuarioEvento.evento.hrInicial, 'YYYY-MM-DD HH:mm').subtract(2, "hours");
    }else if(codLembrete == 4){
      return moment(this.usuarioEvento.evento.dtInicioString+" "+this.usuarioEvento.evento.hrInicial, 'YYYY-MM-DD HH:mm').subtract(4, "hours");
    }else if(codLembrete == 5){
      return moment(this.usuarioEvento.evento.dtInicioString+" "+this.usuarioEvento.evento.hrInicial, 'YYYY-MM-DD HH:mm').subtract(8, "hours");
    }else if(codLembrete == 6){
      return moment(this.usuarioEvento.evento.dtInicioString+" "+this.usuarioEvento.evento.hrInicial, 'YYYY-MM-DD HH:mm').subtract(12, "hours");
    }else if(codLembrete == 7){
      return moment(this.usuarioEvento.evento.dtInicioString+" "+this.usuarioEvento.evento.hrInicial, 'YYYY-MM-DD HH:mm').subtract(1, "days");
    }else if(codLembrete == 8){
      return moment(this.usuarioEvento.evento.dtInicioString+" "+this.usuarioEvento.evento.hrInicial, 'YYYY-MM-DD HH:mm').subtract(2, "days");
    }

  }

  presentActionSheet(item) {
    if(item.id == this.usuarioEvento.usuario.id){
      return;
    }
    if(this.isAdmin){
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: 'Dados',
            handler: () => {
              this.nav.push(PerfilUsuarioPage, {idUsuario: item.id, idUsuarioLogado: this.idUsuarioLogado});
            }
          },
          {
            text: 'Remover '+item.username,
            role: 'destructive',
            handler: () => {

            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }else{
       let actionSheet = this.actionSheetCtrl.create({
         buttons: [
           {
             text: 'Dados',
             handler: () => {
               this.nav.push(PerfilUsuarioPage, {idUsuario: item.id, idUsuarioLogado: this.idUsuarioLogado});
             }
           },
           {
             text: 'Cancel',
             role: 'cancel',
             handler: () => {
               console.log('Cancel clicked');
             }
           }
         ]
       });
       actionSheet.present();
     }
   }

   adicionarUsuario(){
     this.nav.push(UsuarioEventoPage, {evento: this.usuarioEvento.evento});
   }

   configurarEvento() {
     this.nav.push(CadastrarEventoPage, {idUsuarioLogado: this.idUsuarioLogado, eventoSel : this.usuarioEvento.evento});
   }

   confirmaExclusao() {
    let alert = this.alertCtrl.create({
      message: 'Deseja realmente excluir o evento?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Excluir',
          handler: () => {
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }
}
