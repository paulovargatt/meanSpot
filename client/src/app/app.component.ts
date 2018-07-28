import {Component, OnInit} from '@angular/core';
import {User} from "../models/user";
import {UserService} from "../services/user.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [
        UserService
    ]
})
export class AppComponent implements OnInit{
    title = 'app';

    public user: User;
    public identity = false;
    public token;
    public errorMessage;
    constructor(private userService: UserService) {
        this.user = new User('', '', '', '', '', 'ROLE_USER', '')
    }

    ngOnInit(){

    }

    public onSubmit() {
        this.userService.signup(this.user).subscribe((resp) => {
            console.log(resp,'resp onsub 11')
            let identity = (resp as any);
            this.identity = identity.user;
            console.log(identity,'identitti')
            if(!identity.user._id){
                alert('Usuario nao identificado')
            }else{
                    //TOKEN USER
                    this.userService.signup(this.user, 'true').subscribe((resp) => {
                        let token = (resp as any);
                        this.token = token.token;
                        if(token.token.length <= 0){
                            alert('Token nao identificado')
                        }else{
                            console.log(token)
                            console.log(identity)
                                localStorage.setItem('token', this.token)
                        }

                    },error => {
                        console.log(error.error)
                        this.errorMessage = error.error.message;
                    })
            }

        },error => {
            console.log(error.error)
            this.errorMessage = error.error.message;

        })

    }
}
