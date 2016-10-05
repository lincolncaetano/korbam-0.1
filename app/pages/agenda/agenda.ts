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
    if(this.nav.last().instance.atualizarAgenda){
      this.init();
    }
  }

  consultaEvento(data){
    //console.log(data);
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

}
