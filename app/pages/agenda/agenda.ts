import {Page, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import {Component, ViewContainerRef, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {Storage, LocalStorage} from 'ionic-angular';

import * as moment from 'moment';

import {CadastrarEventoPage} from '../cadastrar-evento/cadastrar-evento';
import {EventoPage} from '../evento/evento';
import {UsuarioService} from '../../services/UsuarioService';
import {ModalPage} from './modal';

@Component ({
  templateUrl: 'build/pages/agenda/agenda.html',
  providers: [UsuarioService]
})
export class AgendaPage {

  static get parameters() {
    return [[NavController],[UsuarioService],[NavParams], [ModalController]];
  }

  public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }

  private modalCtrl: ModalController;
  public local: Storage = new Storage(LocalStorage);
  public dateValue: String;
  public anoAtual: String;
  public viewValue: String;
  public days: Array<Object>;
  public weeks: Array<Array<Object>>;
  public dayNames: Array<string>;
  private el: any;
  private date: any;
  private viewContainer: ViewContainerRef;
  private onChange: Function;
  private onTouched: Function;
  private cd: any;
  private cannonical: number;

  private nav : NavController;
  private navParams : NavParams;
  public dataSelect: string;
  private service: UsuarioService;
  private listaEventos: Object[] = [];
  private meusEventos: Object[] = [];
  private convitesEvento: Object[] = [];
  private listaTodosEventos: any[] = [];
  private retorno: any;
  private idUsuario : number;
  private idUsuarioLogado : number;

  @Input('model-format') modelFormat: string;
  @Input('view-format') viewFormat: string;
  private firstWeekDaySunday: boolean;
  private calendario: any;
  private retornoPagina: any = false;


  constructor(nav,usuarioService,navParams, modalController) {
     this.nav = nav;
     this.service = usuarioService;
     this.navParams = navParams;
     this.modalCtrl = modalController;

     this.local.get('idUsuario').then(profile => {
       this.idUsuario = JSON.parse(profile);
     }).catch(error => {
       console.log(error);
     });

     this.idUsuarioLogado= navParams.data;
     this.calendario = "agenda";

     this.init();
   }

   openModal(lmt){
     document.getElementById(lmt).classList.remove("is-hidden");
   }

   closeModal(lmt){
   	document.getElementById(lmt).classList.add("is-hidden");
   }

  ionViewDidEnter() {
    if(this.nav.last().instance.namePage == "UsuarioEventoPage"){
      this.init();
    }
    if(this.nav.last().instance.atualizarAgenda){
      this.init();
    }
  }

  consultaEvento(data){
    //console.log(data);
  }

  mudaTamanhoInput(n,w) {
    document.getElementById(n).style.width = w+"%";
  }

  mudaDisplayDiv(s) {
    document.getElementById(s).style.display = "block";
  }

  public prevYear(): void {
    this.date.subtract(1, 'Y');
    this.generateCalendar(this.date);
  }

  public prevMonth(): void {
    this.date.subtract(1, 'M');
    this.generateCalendar(this.date);
  }

  public nextYear(): void {
    this.date.add(1, 'Y');
    this.generateCalendar(this.date);
  }

  public nextMonth(): void {
    this.date.add(1, 'M');
    this.generateCalendar(this.date);
  }

  public selectDate(e, date): void {
    e.preventDefault();
    if (this.isSelected(date)) return;

    var dataEnv = date.day + '-' + date.month + '-' + date.year;
    let selectedDate = moment(date.year + '-' + date.month + '-' + date.day, 'YYYY-MM-DD');
    this.setValue(selectedDate);


    if(this.listaTodosEventos != []){
      this.listaEventos = [];
      for(let usuarioEvento of this.listaTodosEventos){

        let dataEvento = moment(usuarioEvento.evento.dtInicio, moment.ISO_8601);

        if(usuarioEvento.status == "A" && moment(selectedDate.format(this.modelFormat || 'YYYY-MM-DD')).isSame(dataEvento.format(this.modelFormat || 'YYYY-MM-DD'))){
          this.listaEventos.push(usuarioEvento);
        }
      }
    }


  }

  logError(err){

  }

  loginComplete(){
    if(this.retorno != false){
      this.listaEventos = this.retorno;
    }else{
      this.listaEventos = [];
    }
  }

  private generateCalendar(date): void {

    let lastDayOfMonth = date.endOf('month').date();
    let month = date.month();
    let year = date.year();
    let n = 1;
    let firstWeekDay = null;

    this.dateValue = date.format('MMMM YYYY');
    this.anoAtual = date.format('MMMM');
    this.days = [];
    this.weeks = [];

    if (this.firstWeekDaySunday == true) {
      firstWeekDay = date.set('date', 2).day();
    } else {
      firstWeekDay = date.set('date', 1).day();
    }

    if (firstWeekDay !== 1) {
      n -= firstWeekDay - 1;
    }

    if(firstWeekDay === 0){
      n = -5;
    }


    for (let i = n; i <= lastDayOfMonth; i += 1) {

      if(i <= 0){
        this.days.push({ day: null, month: null, year: null, enabled: false });
      }

      if (i > 0) {
        this.days.push({ day: i, month: month + 1, year: year, enabled: true });
      }

    }

    let week = [];
    for (let i = 0; i <= this.days.length; i += 1) {
      if (i%7==0 && i!=0){
        this.weeks.push(week);
        week = [];
      }
      if(i == this.days.length){
          this.weeks.push(week);
      }else{
        week.push(this.days[i]);
      }
    }
  }

  isSelected(date) {
    let selectedDate = moment(date.day + '.' + date.month + '.' + date.year, 'DD.MM.YYYY');
    return selectedDate.toDate().getTime() === this.cannonical;
  }

  isOcupado(date) {
    for(let usuarioEvento of this.listaTodosEventos){

      let selectedDate = moment(usuarioEvento.evento.dtInicio, 'YYYY-MM-DD');
      let selectedDate2 = moment(date.year+'-'+date.month+'-'+date.day, 'YYYY-MM-DD');
      let marcar = moment(selectedDate).isSame(selectedDate2);

      if(usuarioEvento.status == "A" && marcar){
        if(!this.isSelected(date)){
          return true;
        }
      }
    }
  }

  private generateDayNames(): void {
    this.dayNames = [];
    let date = this.firstWeekDaySunday === true ? moment('2015-06-07') : moment('2015-06-01');
    for (let i = 0; i < 7; i += 1) {
      this.dayNames.push(date.format('dd'));
      date.add('1', 'd');
    }

  }


  private setValue(value: any): void {
    let val = moment(value, this.modelFormat || 'YYYY-MM-DD');
    this.viewValue = val.format(this.viewFormat || 'YYYY-MM-DD');
    this.cannonical = val.toDate().getTime();

  }


  private init(): void {

    this.listaEventos =[];
    this.meusEventos =[];
    this.convitesEvento =[];



    this.viewValue = moment().format(this.modelFormat || 'YYYY-MM-DD');
    this.setValue(this.viewValue);

    this.service.buscaTodosUsuarioEventoPorIdUsuario(this.idUsuarioLogado)
    .subscribe(
      data => this.buscaTodosUsuarioEventoSucess(data),
      err => this.logError(err),
      () => this.buscaComplete()
    );

    this.date = moment();
    this.firstWeekDaySunday = true;
    this.generateDayNames();
    this.generateCalendar(this.date);

  }

  buscaComplete(){

  }

  buscaTodosUsuarioEventoSucess(data){

    if(data != false){
      this.listaTodosEventos = data;
      for(let usuarioEvento of data){
        let selectedDate = moment(usuarioEvento.evento.dtInicio, moment.ISO_8601);
        usuarioEvento.evento.momento = selectedDate;

        if(usuarioEvento.status == "A" && moment(selectedDate.format(this.modelFormat || 'YYYY-MM-DD')).isSame(this.viewValue+"")){
          this.listaEventos.push(usuarioEvento);
        }
        if(usuarioEvento.evento.usuario.id == this.idUsuario){
          this.meusEventos.push(usuarioEvento);
        }
        if(usuarioEvento.status == "P"){
          this.convitesEvento.push(usuarioEvento);
        }
      }
    }else{
      this.listaEventos =[];
      this.meusEventos =[];
      this.convitesEvento =[];
    }
  }

  cadastrarEvento() {
    this.nav.push(CadastrarEventoPage, {idUsuarioLogado: this.idUsuario});
  }

  abrirEvento(item){
    this.nav.push(EventoPage, {idUsuarioLogado: this.idUsuario, usuarioEvento : item});
  }

  doRefresh(refresher) {

    var dataEnv = moment().format(this.modelFormat || 'DD-MM-YYYY');

    this.init();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  presentModal(myEvent, pagina) {

    if (pagina == 1) {
      let modal = this.modalCtrl.create(AgendarConteudoPage);
      modal.present({ev: myEvent});
    } else if (pagina == 2) {
      let modal = this.modalCtrl.create(NotasConteudoPage);
      modal.present({ev: myEvent});
    } else {
      let modal = this.modalCtrl.create(AddPessoasConteudoPage);
      modal.present({ev: myEvent});
    }

  }

}


// modal do alarme

@Component({
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title class="tituloModal">
      HORÁRIO
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <ion-icon class="botaoFechaModal" name="md-close"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>
  <ion-list>
    <ion-item>
      <ion-datetime class="horarioModal" displayFormat="h:mm A" pickerFormat="h mm A" [(ngModel)]="event.timeStarts"></ion-datetime>
    </ion-item>
  </ion-list>
</ion-content>
`
})
export class AgendarConteudoPage {

    public event = {
      month: '1990-02-19',
      timeStarts: '07:43',
      timeEnds: '1990-02-20'
    }

  constructor(public viewCtrl: ViewController) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}

// modal das notas

@Component({
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>
      CHECKLIST
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <ion-icon class="botaoFechaModal" name="md-close"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>

  <ion-list>

    <input type="text" class="pesquisaInputChecklist" name="pesquisaInputChecklist" id="pesquisaInputChecklist">

    <ion-item>
      <img src="img/close.png" class="botaoChecklistDeletar" alt="Deletar" />
      <h3>ABACAXI</h3>
    </ion-item>
      <ion-checkbox class="checkboxChecklist" item-right checked="true"></ion-checkbox>

    <ion-item>
      <img src="img/close.png" class="botaoChecklistDeletar" alt="Deletar" />
      <h3>DOCE DE LEITE</h3>
    </ion-item>
      <ion-checkbox class="checkboxChecklist" item-right></ion-checkbox>

    <ion-item>
      <img src="img/close.png" class="botaoChecklistDeletar" alt="Deletar" />
      <h3>PÃO FATIADO</h3>
    </ion-item>
      <ion-checkbox class="checkboxChecklist" item-right></ion-checkbox>

    <ion-item>
      <img src="img/close.png" class="botaoChecklistDeletar" alt="Deletar" />
      <h3>ARROZ</h3>
    </ion-item>
      <ion-checkbox class="checkboxChecklist" item-right></ion-checkbox>

  </ion-list>

<a href="#">
    <ion-icon light name="md-add" class="botaoChecklistAdd"></ion-icon>
</a>

</ion-content>
`
})
export class NotasConteudoPage {

  constructor(public viewCtrl: ViewController) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}


// modal de adicionar pessoas no grupo

@Component({
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>
      ADICIONAR PESSOAS
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <ion-icon class="botaoFechaModal" name="md-close"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>

  <ion-list>

    <input type="text" class="pesquisaInputAddPessoas" name="pesquisaInputAddPessoas" id="pesquisaInputAddPessoas">
    <ion-icon light name="search" class="botaoPesquisaModal"></ion-icon>

    <ion-item>
      <ion-avatar item-left><img src="../img/bradley.jpg"></ion-avatar>
      <h3 class="nomePesquisaModal">John Doe</h3>
      <img src="img/close.png" class="botaoPesquisaDeletar" alt="Deletar" />
    </ion-item>

    <ion-item>
      <ion-avatar item-left><img src="../img/bradley.jpg"></ion-avatar>
      <h3 class="nomePesquisaModal">Jane Doe</h3>
      <img src="img/close.png" class="botaoPesquisaDeletar" alt="Deletar" />
    </ion-item>

    <ion-item>
      <ion-avatar item-left><img src="../img/bradley.jpg"></ion-avatar>
      <h3 class="nomePesquisaModal">John Doe</h3>
      <img src="img/close.png" class="botaoPesquisaDeletar" alt="Deletar" />
    </ion-item>

    <ion-item>
      <ion-avatar item-left><img src="../img/bradley.jpg"></ion-avatar>
      <h3 class="nomePesquisaModal">Jane Doe</h3>
      <img src="img/close.png" class="botaoPesquisaDeletar" alt="Deletar" />
    </ion-item>

  </ion-list>

<a href="#">
    <ion-icon light name="md-add" class="botaoChecklistAdd"></ion-icon>
</a>

</ion-content>
`
})
export class AddPessoasConteudoPage {

  constructor(public viewCtrl: ViewController) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
