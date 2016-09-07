import {Page, NavController} from 'ionic-angular';

import {HomePage} from '../home/home';
import {UsuarioService} from '../../services/UsuarioService';

@Page({
  templateUrl: 'build/pages/cadastro/cadastro.html',
  providers: [UsuarioService],
})
export class CadastroPage {
  static get parameters() {
    return [[NavController],[UsuarioService]];
  }

  private nav : NavController;
  private service : UsuarioService;
  public signup : any;
  public signupForm : any;
  public submitted : any;
  public usuario : any;

  public showValUsername : Boolean;
  public showUsernameError : Boolean;
  public showUsernameOk : Boolean;

  public showValEmail : Boolean;
  public showEmailError : Boolean;
  public showEmailOk : Boolean;

  constructor(nav,usuarioService) {
    this.nav = nav;
    this.service = usuarioService;

    this.signup = {};
    this.submitted = false;
  }
  doSignup(form) {
      console.log(form);

      if(form.valid){

        this.service.cadastrarUsuario(this.signup)
        .subscribe(
          data => this.usuario = data,
          err => this.logError(err),
          () => console.log('Authentication Complete')
        );

      }
    }

    logError(err){
      console.log(err);
    }



    verificaEmail(){
      var email = this.signupForm.controls.email.value;
      if(email == ""){
        this.showValEmail = false
        this.showEmailError = false;
        this.showEmailOk = false;

      }else{

          this.showValEmail = true
          this.service.validaEmail(email)
          .subscribe(data => this.verificadoEmail(data));
      }
    }

    verificadoEmail(data){

      if(this.showValEmail && data){
        this.showEmailOk = false;
        this.showEmailError = true;
      }else if(this.showValEmail && !data){
        this.showEmailError = false;
        this.showEmailOk = true;
      }else{
        this.showEmailError = false;
        this.showEmailOk = false;
      }

    }

    verificaUsername(){
      var username = this.signupForm.controls.username.value;
      if(username == ""){

        this.showValUsername = false;
        this.showUsernameError = false;
        this.showUsernameOk = false;

      }else{

        this.showValUsername = true;

      /**  this.http.get('http://localhost:8080/korbam/validaUsername/'+username)
          .map(res => res.json())
          .subscribe(data => this.verificadoUsername(data));*/
        }
    }
    verificadoUsername(data){


      if(this.showValUsername && !data){
        this.showUsernameOk = true;
        this.showUsernameError = false;
      }else if(this.showValUsername && data){
        this.showUsernameError = true;
        this.showUsernameOk = false;
      }else{
        this.showUsernameError = false;
        this.showUsernameOk = false;
      }
    }


}
