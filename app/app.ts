import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar, Push} from 'ionic-native';
import {Storage, LocalStorage} from 'ionic-angular';

import {HomePage} from './pages/home/home';
import {TabsPage} from './pages/tabs/tabs';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  rootPage: any;
  public local: Storage = new Storage(LocalStorage);

  constructor(platform: Platform) {

    this.local.get('idUsuario').then(profile => {
      if(profile != null){
        this.rootPage = TabsPage;
      }else{
        this.rootPage = HomePage;
      }
    }).catch(error => {
      console.log(error);
    });



    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      StatusBar.overlaysWebView(true);

    });
  }
}

ionicBootstrap(MyApp);
