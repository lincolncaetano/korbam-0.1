import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

@Component({})
export class ModalPage {

  private view : ViewController;
  private navPar : NavParams;

  constructor(private viewCtrl: ViewController, private navParams: NavParams) {
    this.view = viewCtrl;
    this.navPar = navParams;
  }

  dismiss() {
    this.view.dismiss();
  }

}
