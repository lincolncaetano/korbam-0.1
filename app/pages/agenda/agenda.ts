import {Page, NavController, NavParams} from 'ionic-angular';

import {Component, ViewContainerRef, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {Storage, LocalStorage} from 'ionic-angular';

import * as moment from 'moment';

import {CadastrarEventoPage} from '../cadastrar-evento/cadastrar-evento';
import {EventoPage} from '../evento/evento';
import {UsuarioService} from '../../services/UsuarioService';

@Page({
  templateUrl: 'build/pages/agenda/agenda.html',
  providers: [UsuarioService]
})
export class AgendaPage {

  static get parameters() {
    return [[NavController],[UsuarioService],[NavParams]];
  }

  public local: Storage = new Storage(LocalStorage);
  public dateValue: String;
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
  private listaEventos: any;
  private meusEventos: any;
  private convitesEvento: any;
  private retorno: any;
  private idUsuario : number;
  private idUsuarioLogado : number;

  @Input('model-format') modelFormat: string;
  @Input('view-format') viewFormat: string;
  private firstWeekDaySunday: boolean;
  private calendario: any;
  private retornoPagina: any = false;


  constructor(nav,usuarioService,navParams) {
     this.nav = nav;
     this.service = usuarioService;
     this.navParams = navParams;

     this.local.get('idUsuario').then(profile => {
       this.idUsuario = JSON.parse(profile);
     }).catch(error => {
       console.log(error);
     });

     this.idUsuarioLogado= navParams.data;
     this.calendario = "agenda";

     this.init();
   }

  ionViewDidEnter() {
    if(this.nav.last().instance.namePage == "UsuarioEventoPage"){
      this.init();
    }
  }

  consultaEvento(data){
    console.log(data);
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

    this.service.buscaEventoUsuarioPorUsuarioData(this.idUsuario,dataEnv)
    .subscribe(
      data => this.buscaEventoSucess(data),
      err => this.logError(err),
      () => this.loginComplete()
    );

  }

  buscaEventoSucess(data){
    this.retorno = data;
    if(this.retorno != 'false'){
        for(let evento of data){
          let selectedDate = moment(evento.dtInicio, moment.ISO_8601);
          evento.momento = selectedDate;
        }
    }
  }

  logError(err){

  }

  loginComplete(){
    if(this.retorno != 'false'){
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
    this.viewValue = val.format(this.viewFormat || 'DD-MM-YYYY');
    //this.cd.viewToModelUpdate(val.format(this.modelFormat || 'YYYY-MM-DD'));
    this.cannonical = val.toDate().getTime();
    //console.log(val);

  }


  private init(): void {

    this.date = moment();
    this.firstWeekDaySunday = true;
    this.generateDayNames();
    this.generateCalendar(this.date);

    var dataEnv = moment().format(this.modelFormat || 'DD-MM-YYYY');

    this.service.buscaEventoUsuarioPorUsuarioData(this.idUsuarioLogado, dataEnv)
    .subscribe(
      data => this.buscaEventoSucess(data),
      err => this.logError(err),
      () => this.loginComplete()
    );

    this.service.pesquisaEventoPorUsuario(this.idUsuarioLogado)
    .subscribe(
      data => this.buscaEventoPorUsuarioSucess(data),
      err => this.logError(err),
      () => this.loginComplete()
    );

    this.service.buscaUsuarioEventoPendente(this.idUsuarioLogado)
    .subscribe(
      data => this.buscaEventosPendentesSucess(data),
      err => this.logError(err),
      () => this.loginComplete()
    );

  }

  cadastrarEvento() {
    this.nav.push(CadastrarEventoPage, {idUsuarioLogado: this.idUsuario});
  }

  buscaEventoPorUsuarioSucess(data){
    this.meusEventos = data;
    if(this.meusEventos != false){
        for(let evento of this.meusEventos){
          let selectedDate = moment(evento.dtInicio, moment.ISO_8601);
          evento.momento = selectedDate;
        }
    }
  }

  buscaEventosPendentesSucess(data){
    if(data != false){
    this.convitesEvento = data;
        for(let usrEvento of this.convitesEvento){
          let selectedDate = moment(usrEvento.evento.dtInicio, moment.ISO_8601);
          usrEvento.evento.momento = selectedDate;
        }
    }
  }

  abrirEvento(evento){
    this.nav.push(EventoPage, {idUsuarioLogado: this.idUsuario, eventoSel : evento});
  }

  doRefresh(refresher) {

    var dataEnv = moment().format(this.modelFormat || 'DD-MM-YYYY');

    this.service.buscaEventoUsuarioPorUsuarioData(this.idUsuarioLogado, dataEnv)
    .subscribe(
      data => this.buscaEventoSucess(data),
      err => this.logError(err),
      () => this.loginComplete()
    );

    this.service.pesquisaEventoPorUsuario(this.idUsuarioLogado)
    .subscribe(
      data => this.buscaEventoPorUsuarioSucess(data),
      err => this.logError(err),
      () => this.loginComplete()
    );

    this.service.buscaUsuarioEventoPendente(this.idUsuarioLogado)
    .subscribe(
      data => this.buscaEventosPendentesSucess(data),
      err => this.logError(err),
      () => this.loginComplete()
    );

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

}
