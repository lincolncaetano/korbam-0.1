import {Page, NavController, LoadingController, NavParams, ToastController} from 'ionic-angular';
import {Storage, LocalStorage} from 'ionic-angular';
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

  public local: Storage = new Storage(LocalStorage);

  constructor(nav,usuarioService,navParams, loadingController,toastController ) {
    this.nav = nav;
    this.service = usuarioService;
    this.eventoCad = {};
    this.usuario = {};
    this.loadingController = loadingController;
    this.toastCtrl = toastController;

    this.submitted = false;
    this.idUsuarioLogado = navParams.get("idUsuarioLogado");
    this.eventoSel = navParams.get("eventoSel");

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

}
