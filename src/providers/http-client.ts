/**
 * Created by zacharyrosenthal on 1/21/17.
 */
import {Injectable} from '@angular/core';
// import {RequestOptionsArgs} from '@angular/http';

import {Storage} from '@ionic/storage';

import * as fetch from 'isomorphic-fetch';

@Injectable()
export class HttpClient {

    private baseUrl: String;

    constructor(private storage: Storage) {
        this.baseUrl = 'http://35.20.108.4:8888';
    }

    /*createAuthorizationHeader(headers: Headers): Promise<any> {
     // return this.authDataProvider.getToken();
     }
     */
    /*post(url: string, data: Object, options?: RequestOptionsArgs): Promise<any> {

     // let h = new Headers();
     //return this.createAuthorizationHeader(h).then(token => {

     return fetch(this.baseUrl + url, {
     method: 'POST',
     body: data,
     headers: {
     "Content-type": "application/json",
     'Content-Length': 16384
     }
     }).then(
     (res: any) => res.json(),
     (error: any) => error
     ).then(
     (json: any) => json,
     (error: any) => error);
     //}, error => error);
     }


     console.log('getttt');

     let token: String = '';

     this.storage.get('auth_token').then(
     (value) => {
     console.log(value);
     token = value
     },
     () => {
     token = '';
     }
     );

     let options = {method: 'GET', headers: {'Authorization': token}};

     return fetch(this.baseUrl + url, options)
     .then(
     (res: any) => {

     console.log('**RES** ' + JSON.stringify(res));
     return res.json()
     },
     (error: any) => error
     );

     */

    get(url: string): Promise < any > {

        //let token: String = this.storage.get('auth_token');

        return fetch(this.baseUrl + url, {method: 'GET'})
            .then(
                (res: any) => {

                    console.log('**RES** ' + JSON.stringify(res));
                    return res.json()
                },
                (error: any) => error
            );
    }

    getAuth(url: string): Promise < any > {

        return this.storage.get('auth_token').then(
            (token) => {

                let options = {method: 'GET', headers: {'Authorization': token}};

                return fetch(this.baseUrl + url, options)
                    .then(
                        (res: any) => {

                            console.log('**RES** ' + JSON.stringify(res));
                            return res.json()
                        },
                        (error: any) => error
                    );
            },
            (err) => err
        )

    }
}