import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders} from "@angular/common/http";
import {map} from 'rxjs/operators';
import {Observable} from "rxjs/Observable";
import {GLOBAL} from "./global";

@Injectable()
export class UserService {

    public url: string;

    constructor(private http: HttpClient) {
        this.url = GLOBAL.url;
    }

    signup(userLogin, gethash = null) {
        if(gethash != null){
            userLogin.gethash = gethash;
        }

        let json = JSON.stringify(userLogin);
        let params = json;
        console.log(userLogin,'parans service')
        let headers = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.post(this.url + 'login', params, {headers: headers})
            // .pipe(map(res => {
            //     let resp = (res as any);
            //     resp.json();
            // }))
    }
}
