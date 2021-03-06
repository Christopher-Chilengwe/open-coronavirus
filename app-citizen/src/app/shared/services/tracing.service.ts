import {Inject, Injectable} from "@angular/core";
import {ModalController, Platform} from "@ionic/angular";
import {KeyManagerService} from "./keys/key-manager.service";
import {ContactTrackerService} from "./contacts/contact-tracker.service";
import {ContactUploadRequestComponent} from "../../main/contact-upload-request/contact-upload-request.component";
import {ContactUploadThanksComponent} from "../../main/contact-upload-thanks/contact-upload-thanks.component";
import {PatientService} from "./patient.service";
import BackgroundFetch from "cordova-plugin-background-fetch";
import {InfectedKeyControllerService} from "../sdk";
import {InfectedKeysProcessorService} from "./keys/infected-keys-processor.service";


@Injectable()
export class TracingService {

    constructor(protected contactTrackerService: ContactTrackerService,
                protected platform: Platform,
                protected patientService: PatientService,
                protected infectedKeysProcessorService: InfectedKeysProcessorService,
                protected infectedKeyControllerService: InfectedKeyControllerService,
                protected keyManagerService: KeyManagerService,
                protected modalController: ModalController,
                @Inject('settings') protected settings) {
    }


    public trackInfectionToServer() {

        return new Promise((resolve, reject) => {

            if (this.settings.useDecentralizedProtocol) {
                this.keyManagerService.uploadKeyToServer();
                resolve();
            } else {
                this.uploadContactsAndShowThanksModal().then(() => {
                    resolve() ;
                })
            }
        });
    }

    public checkNewInfectedKeys() {
        return new Promise((resolve, reject) => {
            this.infectedKeyControllerService.infectedKeyControllerFind({}).subscribe(async infectedKeys => {
                try {
                    await this.infectedKeysProcessorService.matchInfectedKeys(infectedKeys);
                } catch (error) {
                    console.error("Error trying to match infected keys: " + JSON.stringify(error));
                }
                resolve();
            });
        });
    }

    async showUploadContactRequestModal() {
        const modalUploadContacts = await this.modalController.create(
            {
                component: ContactUploadRequestComponent,
                componentProps: {
                    autoShareActivated: this.autoShareActivated()
                }
            });

        modalUploadContacts.onDidDismiss()
            .then((response) => {
                if (response.data.accepts) {
                    this.uploadContactsAndShowThanksModal();

                }
            });

        return await modalUploadContacts.present();
    }

    async showUploadContactThanksModal() {
        const modalUploadContacts = await this.modalController.create(
            {
                component: ContactUploadThanksComponent
            });

        return await modalUploadContacts.present();
    }

    async uploadContactsAndShowThanksModal() {
        this.trackInfectionToServer().then( () => {
            this.showUploadContactThanksModal();
        });
    }

    async activateAutoShare() {
        this.patientService.patient.autoshare = true;
        const patient = this.patientService.patient;

        this.patientService.update(patient).subscribe(success => {

        });
    }

    autoShareActivated(): boolean {
        return (this.settings.autoshare || this.patientService.patient.autoshare);
    }


}
