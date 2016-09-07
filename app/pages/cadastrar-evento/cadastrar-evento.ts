import {Page, NavController, LoadingController, NavParams, ToastController} from 'ionic-angular';
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
  private service: UsuarioService;
  private submitted: Boolean;
  private idUsuarioLogado: number;
  private loadingController: LoadingController;
  private toastCtrl: ToastController;

  constructor(nav,usuarioService,navParams, loadingController,toastController ) {
    this.nav = nav;
    this.service = usuarioService;
    this.eventoCad = {};
    this.loadingController = loadingController;
    this.toastCtrl = toastController;

    this.submitted = false;
    this.idUsuarioLogado = navParams.get("idUsuarioLogado");
    this.eventoSel = navParams.get("eventoSel");

    if(this.eventoSel != null){
      this.eventoCad = this.eventoSel;

      let selectedDate = moment(this.eventoCad.dtInicio, 'YYYY-MM-DD');
      this.eventoCad.dtInicioString = selectedDate.format('YYYY-MM-DD');

    }

  }

  funcaoPraAceitarSubmeterForm(form){
    this.submitted = true;

    if (form.valid) {

      let loading = this.loadingController.create({
        spinner: 'dots'
      });

      loading.present();
      
      this.eventoCad.usuario = {id: this.idUsuarioLogado};

      setTimeout(() => {
        this.nav.push(UsuarioEventoPage, {evento: this.eventoCad});
      }, 500);

      setTimeout(() => {
        loading.dismiss();
      }, 1000);


    }else{

      console.log(form.titulo);

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
