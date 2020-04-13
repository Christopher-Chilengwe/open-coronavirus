import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { LoginFormComponent } from '../shared/login-form/login-form.component';
import { UserService } from '../shared/services/user.service';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent {

    @ViewChild('loginFormComponent', { static: true }) protected loginFormComponent: LoginFormComponent;

    public loginForm: FormGroup;

    public error: string;
    public formTriedToSubmit = false;

    constructor(
        protected formBuilder: FormBuilder,
        protected userService: UserService,
        public loadingController: LoadingController,
        protected router: Router) {
        this.loginForm = this.formBuilder.group({});
    }

    public onSubmit() {
        this.formTriedToSubmit = true;
        this.loginFormComponent.validate();
        if (this.loginForm.valid && this.loginFormComponent.isValid) {
            this.login();
        }
    }

    async login() {
        // if (this.loginFormComponent.isValid) {
        //     const loading = await this.loadingController.create({
        //         message: 'Por favor, espere...'
        //     });
        //     await loading.present();

        //     this.userCredentials = this.loginFormComponent.user;
        //     this.userService.login(this.userCredentials).subscribe(res => {
        //         loading.dismiss();
        //         if (res != null && res !== false) {
        //             this.router.navigate(['/app/qr-reader']);
        //         } else {
        //             // go to error page
        //             this.error = 'Usuario no válido';
        //         }
        //     }, err => {
        //         // console.log("login: ", err);
        //         loading.dismiss();
        //         this.error = err.message;

        //     });
        // }


    }

    async presentLoading() {
        const loading = await this.loadingController.create({
            message: 'Por favor, espere...',
            duration: 2000
        });
        await loading.present();

        const { role, data } = await loading.onDidDismiss();
        console.log('Loading dismissed!');
    }

    loginDemo() {
        this.userService.user = { "id": "1", "uniqueId": "244124", "firstName": "Pedro", "lastName": "Garrido Jiménez", "hash": "asdfasdf", "documentNumber": "123456789B", "age": 25, "street": "San Juan nº 33", "city": "Alicante", "postalCode": "03640", "position": "Policía Nacional" };
        this.router.navigate(['/app/qr-reader']);
    }

}
