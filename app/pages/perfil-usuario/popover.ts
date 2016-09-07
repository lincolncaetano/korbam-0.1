import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

import {AmizadeService} from '../../services/AmizadeService';

@Component({
    templateUrl: 'build/pages/perfil-usuario/popover.html',
    providers: [AmizadeService]
})
export class PopoverPage {


  private view : ViewController;
  private navPar : NavParams;
  private usuario: any;
  private usuarioLogado: any;
  private usrRe : any;
  private amzRe : any;
  private service : AmizadeService;
  private cancelarSolicitacao: boolean;
  private aceitarSolicitacao: boolean;
  private cancelarAmizade: boolean;

  constructor(private viewCtrl: ViewController, private navParams: NavParams, private amizadeService: AmizadeService) {
    this.view = viewCtrl;
    this.navPar = navParams;
    this.service = amizadeService;
  }

  buscaAmizadeComplete(amizade){

    if(amizade != false){
      if(amizade.id.idUsuario == this.usuarioLogado && amizade.status=='P'){
        this.cancelarSolicitacao = true;
      }else if(amizade.id.idUsuarioSolicitato == this.usuarioLogado && amizade.status=='P'){
        this.cancelarSolicitacao = true;
        this.aceitarSolicitacao = true;
      }else if(amizade.status=='A'){
        this.cancelarAmizade = true;
      }
    }
  }

  ngOnInit() {
    if (this.navPar.data) {
      this.usuario = this.navPar.data.usuario;
      this.usuarioLogado = this.navPar.data.usuarioLogado;
      this.cancelarSolicitacao = this.navPar.data.cancelarSolicitacao;
    }

    this.service.buscaAmizadeId(this.usuarioLogado, this.usuario.id)
    .subscribe(
      data => this.amzRe = data,
      err => this.logError(err),
      () => this.buscaAmizadeComplete(this.amzRe)
    );
  }

  close() {
    this.view.dismiss();
  }

  amizade(){

    var amizade = {
      id:{
        idUsuario: this.usuarioLogado,
        idUsuarioSolicitato: this.usuario.id
      },
      status: 'P'
    };

    this.service.solicitaAmizade(amizade)
    .subscribe(
      data => this.usrRe = data,
      err => this.logError(err),
      () => this.amizadeComplete()
    );

  }

  cancelarsolicitaAmizade(){

    var amizade
    if(this.amzRe != false && this.amzRe.id.idUsuarioSolicitato == this.usuarioLogado){
      amizade = {
        id:{
          idUsuario: this.usuario.id,
          idUsuarioSolicitato: this.usuarioLogado
        }
      };
    }else{
      amizade = {
        id:{
          idUsuario: this.usuarioLogado,
          idUsuarioSolicitato:this.usuario.id
        }
      };
    }

    this.service.cancelarAmizade(amizade)
    .subscribe(
      data => this.usrRe = data,
      err => this.logError(err),
      () => this.amizadeComplete()
    );

  }

  aceitaSolicitaAmizade(){

    var amizade = {
      id:{
        idUsuario: this.usuario.id,
        idUsuarioSolicitato: this.usuarioLogado
      },
      status: 'A'
    };

    this.service.solicitaAmizade(amizade)
    .subscribe(
      data => this.usrRe = data,
      err => this.logError(err),
      () => this.amizadeComplete()
    );

  }

  cancelarsolicitaAmizadeComplete(){
    //this.cancelarSolicitacao = false;
    this.view.dismiss();
  }

  logError(err){
    console.log(err);
  }

  amizadeComplete(){
    //this.cancelarSolicitacao = true;
    this.view.dismiss();
  }
}
