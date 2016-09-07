import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar, Push, LocalNotifications} from 'ionic-native';
import {HomePage} from './pages/home/home';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      StatusBar.overlaysWebView(true);

      let push = Push.init({
          android: {
              senderID: "42908905109"
          },
          ios: {
              alert: "true",
              badge: true,
              sound: 'true'
          },
          windows: {}
      });

      push.on('registration', (data) => {
          console.log("token"+data.registrationId);
      });

      push.on('notification', (data) => {
          console.log(data.message);
          console.log(data.title);
          console.log(data.count);
          console.log(data.sound);
          console.log(data.image);
          console.log(data.additionalData);
      });

      push.on('error', (e) => {
          console.log(e.message);
      });

      LocalNotifications.schedule({
         text: 'Delayed Notification',
         at: new Date(new Date().getTime() + 60000),
         led: 'FF0000',
         sound: 'file://beep.caf'
      });



    });
  }
}

ionicBootstrap(MyApp);
