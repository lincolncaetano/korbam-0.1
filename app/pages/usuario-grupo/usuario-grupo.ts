import {Page, NavController, NavParams, LoadingController} from 'ionic-angular';
import {GrupoService} from '../../services/GrupoService';
import {TabsPage} from '../tabs/tabs';

@Page({
  templateUrl: 'build/pages/usuario-grupo/usuario-grupo.html',
  providers: [GrupoService],
})
export class UsuarioGrupoPage {
  static get parameters() {
    return [[NavController],[NavParams],[GrupoService],[LoadingController]];
  }

  public nav: NavController;
  public searchQuery : string;
  public items : any;
  public listaResp : any;
  private service: GrupoService;
  public grupoCad : any;
  public grupoResp : any;
  private loadingController: LoadingController;


  constructor(nav, navParams, grupoService, loadingController) {
    this.nav = nav;
    this.service = grupoService;
    this.loadingController = loadingController;
    this.searchQuery = '';


    this.grupoCad = navParams.get('grupo');
    console.log(this.grupoCad);


    this.initializeItems();
  }

  loginComplete() {
    if(this.listaResp != false){
      for (var user of this.listaResp) {
        user.checked = false;
      }
      this.items = this.listaResp;
    }

    if(this.grupoCad.listaUsuario != null){
      for (var user of this.grupoCad.listaUsuario) {
        for (var userAux of this.listaResp) {
          if(user.id == userAux.id){
            userAux.checked = true;
          }
        }
      }
    }
  }

  logError(err){

  }

  initializeItems(){
    this.service.listaAmigos(this.grupoCad.usuario.id)
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

  salvargrupo(){

    var lista = [];
    var cont = 0;
    for (var user of this.listaResp) {
      if(user.checked){
        lista[cont] = user;
        cont++;
      }
    }
    this.grupoCad.listaUsuario = lista;

    console.log(this.grupoCad);

    this.service.salvarGrupo(this.grupoCad)
    .subscribe(
      data => this.grupoResp = data,
      err => this.logGrupoError(err),
      () => this.salvarGrupoComplete()
    );
  }

  logGrupoError(err){
    console.log(err);
  }

  salvarGrupoComplete(){
    //if(this.eventoResp != null){

      let loading = this.loadingController.create({
        spinner: 'dots'
      });

      loading.present();
      this.grupoCad.usuario = {id: 5};

      setTimeout(() => {
        this.nav.popToRoot();
      }, 500);

      setTimeout(() => {
        loading.dismiss();
      }, 1000);

  //  }
  }

}
