import {Page, NavController} from 'ionic-angular';

/*
  Generated class for the InicialPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/inicial/inicial.html',
})
export class InicialPage {
  constructor(public nav: NavController) {
    this.nav = nav;
  }
}
