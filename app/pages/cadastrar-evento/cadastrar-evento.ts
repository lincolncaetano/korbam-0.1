import {Page, NavController, LoadingController, NavParams, ToastController} from 'ionic-angular';
import {Storage, LocalStorage} from 'ionic-angular';
import {LocalNotifications} from 'ionic-native';
import {UsuarioService} from '../../services/UsuarioService';

import {UsuarioEventoPage} from '../usuario-evento/usuario-evento';

import * as moment from 'moment';

@Page({
  templateUrl: 'build/pages/cadastrar-evento/cadastrar-evento.html',
  providers: [UsuarioService],
})
export class CadastrarEventoPage {
  static get parameters() {
    return [[NavController],[UsuarioService],[NavParams],[LoadingController],[ToastController]];
  }

  public nav: NavController;
  public eventoCad :any;
  public eventoResp :any;
  public eventoSel :any;
  public gender :any;
  private service: UsuarioService;
  private submitted: Boolean;
  private idUsuarioLogado: number;
  private usuario: any;
  private retorno: any;
  private loadingController: LoadingController;
  private toastCtrl: ToastController;
  private isGrupoEvento : Boolean;
  private grupo: any;

  public local: Storage = new Storage(LocalStorage);

  constructor(nav,usuarioService,navParams, loadingController,toastController ) {
    this.nav = nav;
    this.service = usuarioService;
    this.eventoCad = {};
    this.usuario = {};
    this.loadingController = loadingController;
    this.toastCtrl = toastController;

    this.isGrupoEvento = false;
    this.submitted = false;
    this.idUsuarioLogado = navParams.get("idUsuarioLogado");
    this.eventoSel = navParams.get("eventoSel");
    this.grupo = navParams.get("grupo");


    this.init();

    if(this.eventoSel != null){
      this.eventoCad = this.eventoSel;

      let selectedDate = moment(this.eventoCad.dtInicio, 'YYYY-MM-DD');
      this.eventoCad.dtInicioString = selectedDate.format('YYYY-MM-DD');

    }else{
      this.eventoCad.lembrete1 = 1;
      this.eventoCad.lembrete2 = 7;
      this.eventoCad.dtInicioString = new Date().toISOString();
    }

    if(this.grupo != null){
      this.isGrupoEvento = true;
    }

  }

  init(){
    this.local.get('idUsuario').then(profile => {
      this.idUsuarioLogado = JSON.parse(profile);
      this.service.pesquisaUsuarioPorId(this.idUsuarioLogado)
      .subscribe(
        data => this.retorno = data,
        err => this.logError(err),
        () => this.pesquisaComplete()
      );

    }).catch(error => {
      console.log(error);
    });
  }

  pesquisaComplete(){
    if(this.retorno != false){
      this.usuario = this.retorno;
    }
  }

  funcaoPraAceitarSubmeterForm(form){
    this.submitted = true;

    if (form.valid) {

      let loading = this.loadingController.create({
        spinner: 'dots'
      });

      loading.present();

      this.eventoCad.usuario = this.usuario;

      setTimeout(() => {
        this.nav.push(UsuarioEventoPage, {evento: this.eventoCad});
      }, 500);

      setTimeout(() => {
        loading.dismiss();
      }, 1000);


    }else{

      let toast = this.toastCtrl.create({
        message: 'Mmmm, buttered toast',
        duration: 2000,
        position: 'top'
      });

      toast.present(toast);
    }

  }

  logError(err){

  }

  loginComplete(){

  }

  funcaoPraRedirecionarPraOutroLugar(){
    this.nav.pop();
  }

  cadastraEventoGrupo(form){

    this.submitted = true;

    if (form.valid) {
      this.eventoCad.usuario = this.usuario;

      var grupoEvento = {
        evento : this.eventoCad,
        grupo : this.grupo
      }

      this.service.cadastrarGrupoEvento(grupoEvento)
      .subscribe(
        data => this.eventoResp = data,
        err => this.logEventoError(err),
        () => this.salvarEventoComplete()
      );

    }
  }

  logEventoError(err){
    console.log(err);
  }

  salvarEventoComplete(){

    let dateAlarme0 = moment(this.eventoCad.dtInicioString+" "+this.eventoCad.hrInicial, 'YYYY-MM-DD HH:mm');
    let dateAlarme1 = this.configuraAlerta(this.eventoCad.lembrete1);
    let dateAlarme2 = this.configuraAlerta(this.eventoCad.lembrete2);

    let msgAlerta1 = this.configuraMsgAlerta(this.eventoCad.lembrete1);
    let msgAlerta2 = this.configuraMsgAlerta(this.eventoCad.lembrete2);

    var id0 = parseInt(this.eventoResp.id+"0");
    var id1 = parseInt(this.eventoResp.id+"1");
    var id2 = parseInt(this.eventoResp.id+"2");

    LocalNotifications.schedule({
       id: id0,
       text: "O evento" + this.eventoCad.titulo + ' acabou de começar',
       at: dateAlarme0.toDate(),
       led: 'FF0000',
       sound: 'file://beep.caf'
    });

    LocalNotifications.schedule({
       id: id1,
       text: msgAlerta1,
       at: dateAlarme1.toDate(),
       led: 'FF0000',
       sound: 'file://beep.caf'
    });

    LocalNotifications.schedule({
       id: id2,
       text: msgAlerta1,
       at: dateAlarme2.toDate(),
       led: 'FF0000',
       sound: 'file://beep.caf'
    });

    this.nav.pop();


  }

  configuraAlerta(codLembrete){

    if(codLembrete == 1){
      return moment(this.eventoCad.dtInicioString+" "+this.eventoCad.hrInicial, 'YYYY-MM-DD HH:mm').subtract(2, "minutes");
    }else if(codLembrete == 2){
      return moment(this.eventoCad.dtInicioString+" "+this.eventoCad.hrInicial, 'YYYY-MM-DD HH:mm').subtract(1, "hours");
    }else if(codLembrete == 3){
      return moment(this.eventoCad.dtInicioString+" "+this.eventoCad.hrInicial, 'YYYY-MM-DD HH:mm').subtract(2, "hours");
    }else if(codLembrete == 4){
      return moment(this.eventoCad.dtInicioString+" "+this.eventoCad.hrInicial, 'YYYY-MM-DD HH:mm').subtract(4, "hours");
    }else if(codLembrete == 5){
      return moment(this.eventoCad.dtInicioString+" "+this.eventoCad.hrInicial, 'YYYY-MM-DD HH:mm').subtract(8, "hours");
    }else if(codLembrete == 6){
      return moment(this.eventoCad.dtInicioString+" "+this.eventoCad.hrInicial, 'YYYY-MM-DD HH:mm').subtract(12, "hours");
    }else if(codLembrete == 7){
      return moment(this.eventoCad.dtInicioString+" "+this.eventoCad.hrInicial, 'YYYY-MM-DD HH:mm').subtract(1, "days");
    }else if(codLembrete == 8){
      return moment(this.eventoCad.dtInicioString+" "+this.eventoCad.hrInicial, 'YYYY-MM-DD HH:mm').subtract(2, "days");
    }

  }

  configuraMsgAlerta(codLembrete){

    if(codLembrete == 1){
      return "Faltam 30 minutos para o evento " + this.eventoCad.titulo;
    }else if(codLembrete == 2){
      return "Falta 1 hora para o evento " + this.eventoCad.titulo;
    }else if(codLembrete == 3){
      return "Faltam 2 horas para o evento " + this.eventoCad.titulo;
    }else if(codLembrete == 4){
      return "Faltam 4 horas para o evento " + this.eventoCad.titulo;
    }else if(codLembrete == 5){
      return "Faltam 8 horas para o evento " + this.eventoCad.titulo;
    }else if(codLembrete == 6){
      return "Faltam 12 horas para o evento " + this.eventoCad.titulo;
    }else if(codLembrete == 7){
      return "Falta 1 dia para o evento " + this.eventoCad.titulo;
    }else if(codLembrete == 8){
      return "Faltam 2 dias para o evento " + this.eventoCad.titulo;
    }

  }

}
