import {Page, NavController, ActionSheetController} from 'ionic-angular';
import { App } from 'ionic-angular';
import {Storage, LocalStorage} from 'ionic-angular';
import {Camera} from 'ionic-native';
import * as moment from 'moment';

import {HomePage} from '../home/home';
import {UsuarioService} from '../../services/UsuarioService';

@Page({
  templateUrl: 'build/pages/editar-perfil/editar-perfil.html',
  providers: [UsuarioService]
})
export class EditarPerfilPage {

  private usuarioCad: any;
  private idUsuarioLogado: any;
  private token: any;
  private retorno: any;
  private usuario: any;
  public local: Storage = new Storage(LocalStorage);
  public namePage : any = "EditarPerfilPage";
  public atualizarPerfil = false;
  public fotoAux :any;


  constructor(public nav: NavController, public actionSheetCtrl: ActionSheetController, public usuarioService: UsuarioService, private app: App) {
    this.nav = nav;
    this.actionSheetCtrl = actionSheetCtrl;
    this.usuarioCad = {};

    this.local.get('idUsuario').then(profile => {
      this.idUsuarioLogado = JSON.parse(profile);
      this.usuarioService.pesquisaUsuarioPorId(this.idUsuarioLogado)
      .subscribe(
        data => this.retorno = data,
        err => this.logError(err),
        () => this.pesquisaComplete()
      );

    }).catch(error => {
      console.log(error);
    });

    this.local.get('tokenDevice').then(token => {
      this.token = token;
    }).catch(error => {
      console.log(error);
    });

  }

  logError(err){
    console.log(err);
  }

  pesquisaComplete(){
    if(this.retorno != false){
      this.usuarioCad = this.retorno;
      if(this.usuarioCad.dataNascimento != null){
        let selectedDate = moment(this.usuarioCad.dataNascimento, 'YYYY-MM-DD');
        this.usuarioCad.dataNascimentoString = selectedDate.format('YYYY-MM-DD');
      }
    }
  }

  salvarUsuario(){
    this.usuarioService.editarUsuario(this.usuarioCad)
    .subscribe(
      data => this.usuario = data,
      err => this.logError(err),
      () => this.completeCad()
    );
  }

  completeCad(){
    this.atualizarPerfil = true;
    this.nav.pop();
  }


  presentActionSheet() {
   let actionSheet = this.actionSheetCtrl.create({
     buttons: [
       {
         text: 'Tirar Foto',
         handler: () => {
           this.openCamera();
         }
       },
       {
         text: 'Escolher Foto',
         handler: () => {
           this.selectFromGallery();
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

 selectFromGallery() {
    var options = {
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.PNG,
      allowEdit: true,
      targetWidth: 560,
      targetHeight: 560,
      correctOrientation: false
    };
    Camera.getPicture(options).then((imageData) => {
      //this.usuarioCad.fotoProfileBase64 = 'data:image/jpeg;base64,' + imageData;
      this.usuarioCad.fotoProfileBase64 = imageData;
      //this.photoSelected = true;
      //this.photoTaken = false;
    }, (err) => {
      // Handle error
    });
  }

  openCamera() {
    var options = {
      sourceType: Camera.PictureSourceType.CAMERA,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.PNG,
      allowEdit: true,
      targetWidth: 560,
      targetHeight: 560,
      correctOrientation: false
    };
    Camera.getPicture(options).then((imageData) => {
      //this.usuarioCad.fotoProfileBase64 = 'data:image/jpeg;base64,' + imageData;
      this.usuarioCad.fotoProfileBase64 = imageData;
      //this.photoTaken = true;
      //this.photoSelected = false;
    }, (err) => {
      // Handle error
    });
  }

  logout(){
    this.usuarioService.detelaPorToken(this.token)
    .subscribe(
      data => this.retorno = data,
      err => this.logError(err),
      () => this.logoutComplete()
    );

  }

  logoutComplete(){
    if(this.retorno == true){
      this.local.clear();
      const root = this.app.getRootNav();
      root.popToRoot();
    }
  }

}
