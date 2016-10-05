import {NavController, NavParams} from 'ionic-angular';
import {Storage, LocalStorage} from 'ionic-angular';
import {Page, ViewController, Platform} from 'ionic-angular';
import {InicialPage} from '../inicial/inicial';
import {FeedPage} from '../feed/feed';
import {AgendaPage} from '../agenda/agenda';
import {PerfilPage} from '../perfil/perfil';
import {NotificacoesPage} from '../notificacoes/notificacoes';
import {ListaGruposPage} from '../lista-grupos/lista-grupos';

import {NotificaoService} from '../../services/NotificaoService';

@Page({
	template:
	'<ion-content>' +
	'</ion-content>',
})
class TabIconPage {
	isAndroid: boolean = false;
	idUsuarioLogado : any;
	service: NotificaoService;

	constructor(platform: Platform,notificaoService: NotificaoService) {
		this.isAndroid = platform.is('android');
		this.service = notificaoService;
	}

	onPageWillEnter() {
		document.getElementById('md-tabs-icon').style.display = "block";
		document.getElementById('md-only').style.display = "none";
	}
}

@Page({
	template:
	'<ion-tabs tabbarPlacement="bottom" class="tabs-icon" selectedIndex="2">' +
  //  '<ion-tab tabIcon="home" [root]="tabOne" [rootParams]="idUsuarioLogado"></ion-tab>' +
    '<ion-tab tabIcon="search" [root]="tabTwo" [rootParams]="idUsuarioLogado" ></ion-tab>' +
		'<ion-tab tabIcon="notifications" (ionSelect)="chat()" [tabBadge]="nNotif" tabBadgeStyle="danger" [root]="tabFive" [rootParams]="idUsuarioLogado"></ion-tab>' +
		'<ion-tab tabIcon="calendar" [root]="tabFour" [rootParams]="idUsuarioLogado"></ion-tab>' +
		'<ion-tab tabIcon="people" [root]="tabSix" [rootParams]="idUsuarioLogado"></ion-tab>' +
		'<ion-tab tabIcon="person" [root]="tabThree" [rootParams]="idUsuarioLogado"></ion-tab>' +
	'</ion-tabs>',
	providers: [NotificaoService]
})
export class TabsPage {
	tabOne = InicialPage;
	tabTwo = FeedPage;
	tabThree = PerfilPage;
	tabFour = AgendaPage;
	tabFive = NotificacoesPage;
	tabSix = ListaGruposPage;
	isAndroid: boolean = false;
	idUsuarioLogado : any;
	retorno : any;
	service : NotificaoService;

	public local: Storage = new Storage(LocalStorage);
	public nNotif = 0;

	constructor(platform: Platform, navParams :NavParams, notificaoService: NotificaoService) {

		this.isAndroid = platform.is('android');
		//this.idUsuarioLogado = navParams.get("idUsuarioLogado");
		this.service = notificaoService;

		this.local.get('idUsuario').then(profile => {
			this.idUsuarioLogado = JSON.parse(profile);
			this.service.buscaNotificacoes(this.idUsuarioLogado)
			.subscribe(
				data => this.retorno = data,
				err => this.logError(err),
				() => this.buscaNotifComplete()
			);
		}).catch(error => {
			console.log(error);
		});



	}

	logError(err){
    console.log(err);
  }

	buscaNotifComplete(){
		if(this.retorno != false){
			for(let notificacao of this.retorno){
				if(notificacao.status == "P"){
					this.nNotif = this.nNotif + 1;
				}
			}
		}
	}

	chat(){
		this.nNotif = 0;
	}

	onPageWillLeave() {
		document.getElementById('md-tabs-icon').style.display = "none";
		document.getElementById('md-only').style.display = "block";
	}
}
