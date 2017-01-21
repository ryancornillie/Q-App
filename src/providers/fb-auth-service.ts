/**
 * Created by zacharyrosenthal on 1/21/17.
 */
'use strict';
// import  {AuthDataProvider } from './auth-data-provider';
import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
// import {Http, Headers, RequestOptions} from '@angular/http';
import {InAppBrowser} from 'ionic-native';

import { HttpClient } from '../providers/http-client';


/*
 Generated class for the AuthService provider.
 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class FBAuthService {

    static FB_CLIENT_ID = '1123588731087524';

    static FB_OAUTH_URL = `https://www.facebook.com/v2.8/dialog/oauth?client_id=${FBAuthService.FB_CLIENT_ID}`
        + '&redirect_uri=http://localhost/callback&response_type=token&scope=email';

    static AUTH_ROUTE = '/api/v1/login';

    constructor(public http: HttpClient,
                private platform: Platform) {
        console.log('Hello AuthService Provider');
    }

    login(): Promise<any> {


        return this.platform.ready()
            .then(
                () => this.facebookLogin(),
                error => error
            ).then(
                success => this.validateWithServer(success.access_token),
                error => error
            );
        /*.then(
         token => this.authData.setUser(token),
         error => error
         )*/


        /* return this.platform.ready().then(() => {
         return this.facebookLogin().then(
         success => this.validateWithServer(success.access_token),
         error => alert(error)
         );
         });*/
    }

    private validateWithServer(token: string): Promise<any> {


        console.log('validate server');

        return new Promise<any>((resolve, reject) => {
            this.http.get(FBAuthService.AUTH_ROUTE + '/' + token).then(
                    res => resolve(res),
                    error => reject(error)
                );
        });
    }

    private facebookLogin(): Promise<{access_token: string}> {
        return new Promise(function (resolve, reject) {
            // Open browser with FB login

            let browserRef: InAppBrowser = new InAppBrowser(
                FBAuthService.FB_OAUTH_URL,
                '_blank',
                'location=no,clearsessioncache=yes,clearcache=yes'
            );

            browserRef.on('loadstart').subscribe(
                (event) => {


                    if ((event.url).indexOf('http://localhost/callback') === 0) {

                        console.log(event.url);

                        browserRef.close();

                        let responseParameters: any = ((event.url).split('#')[1]).split('&');
                        let parsedResponse: any = {};

                        for (let i = 0; i < responseParameters.length; i++) {
                            parsedResponse[responseParameters[i].split('=')[0]] = responseParameters[i].split('=')[1];
                        }

                        if (parsedResponse['access_token'] !== undefined && parsedResponse['access_token'] !== null) {
                            resolve(parsedResponse);
                        } else {
                            reject('Problem authenticating with Facebook');
                        }
                    }
                },
                (error) => {
                    console.log('err: ', error);
                    reject(error);
                },
                () => {
                    console.log('done: ');
                    //resolve(true);
                },
            );

        });
    }
}