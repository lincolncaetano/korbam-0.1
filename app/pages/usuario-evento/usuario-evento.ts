import {Page, NavController, NavParams, LoadingController} from 'ionic-angular';
import {AmizadeService} from '../../services/AmizadeService';
import {TabsPage} from '../tabs/tabs';

@Page({
  templateUrl: 'build/pages/usuario-evento/usuario-evento.html',
  providers: [AmizadeService],
})
export class UsuarioEventoPage {
  static get parameters() {
    return [[NavController],[NavParams],[AmizadeService],[LoadingController]];
  }

  public nav: NavController;
  public searchQuery : string;
  public items : any;
  public listaResp : any;
  private service: AmizadeService;
  public eventoCad : any;
  public eventoResp : any;
  private loadingController: LoadingController;


  constructor(nav, navParams, amizadeService, loadingController) {
    this.nav = nav;
    this.service = amizadeService;
    this.loadingController = loadingController;
    this.searchQuery = '';


    this.eventoCad = navParams.get('evento');
    console.log(this.eventoCad);


    this.initializeItems();
  }

  loginComplete() {
    if(this.listaResp != false){
      for (var user of this.listaResp) {
        user.checked = false;
      }
      this.items = this.listaResp;
    }

    if(this.eventoCad.listaUsuario != null){
      for (var user of this.eventoCad.listaUsuario) {
        for (var userAux of this.listaResp) {
          if(user.id.idUsuario == userAux.id){
            userAux.checked = true;
          }
        }
      }
    }
  }

  logError(err){

  }

  initializeItems(){
    this.service.listaAmigos(this.eventoCad.usuario.id)
    .subscribe(
      data => this.listaResp = data,
      err => this.logError(err),
      () => this.loginComplete()
    );
  }


  getItems(searchbar) {
    // Reset items back to all of the items
    //this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.value;

    // if the value is an empty string don't filter the items
    if (q.trim() == '') {
      this.items = this.listaResp;
      return false;
    }

    this.items = this.listaResp.filter((v) => {

      if (v.username.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
  }

  change(usuario){

    for (var user of this.listaResp) {
        if(user.id == usuario.id){
          if(user.checked == true){
            user.checked = false;
          }else{
            user.checked = true
          }
        }
    }

    //for (var user of this.listaResp) {
    //  console.log(user);
    //}

  }

  salvarEvento(){



    var lista = [];
    var cont = 0;
    var adicionado = false;
    var eventoUsuario;


    for (var user of this.listaResp) {
      eventoUsuario = {};
      adicionado = false;

      if(user.checked){
        if(this.eventoCad.listaUsuario != null){
          for (var eventoUser of this.eventoCad.listaUsuario) {
            if(eventoUser.id.idUsuario == user.id){
              adicionado = true;
              eventoUsuario = eventoUser;
              break;
            }
          }
        }
        if(!adicionado){
          eventoUsuario = {
            usuario : user,
            status : 'P'
          };
          lista[cont] = eventoUsuario;
        }

        cont++;
      }
    }

    console.log(lista);
    this.eventoCad.listaUsuario = lista;

    this.service.salvarEvento(this.eventoCad)
    .subscribe(
      data => this.eventoResp = data,
      err => this.logEventoError(err),
      () => this.salvarEventoComplete()
    );
  }

  logEventoError(err){
    console.log(err);
  }

  salvarEventoComplete(){
    let loading = this.loadingController.create({
      spinner: 'dots'
    });

    loading.present();

    setTimeout(() => {
      this.nav.first()
    }, 500);

    setTimeout(() => {
      loading.dismiss();
    }, 1000);

  }

}
