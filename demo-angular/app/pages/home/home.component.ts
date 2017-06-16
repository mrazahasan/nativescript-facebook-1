import { Component, ChangeDetectorRef } from "@angular/core";
import * as Facebook from "nativescript-facebook";
import { NavigationService } from "../../services/navigation.service";
import { config } from "../../app.config";
let http = require("http");
let appSettings = require("application-settings");

@Component({
    selector: "home",
    moduleId: module.id,
    templateUrl: "home.component.html",
    styleUrls: ["home.component.css"]
})
export class HomeComponent {
    accessToken: string = appSettings.getString("access_token");
    userId: string;
    username: string;
    avatarUrl: string;

    constructor(private ref: ChangeDetectorRef, private navigationService: NavigationService) {
        // Get logged in user's info
        http.getJSON(config.FACEBOOK_GRAPH_API_URL + "/me?access_token=" + this.accessToken).then((res) => {
            this.username = res.name;
            this.userId = res.id;

            // Get logged in user's avatar
            // ref: https://github.com/NativeScript/NativeScript/issues/2176
            http.getJSON(config.FACEBOOK_GRAPH_API_URL + "/" + this.userId + "/picture?type=large&redirect=false&access_token=" + this.accessToken).then((res) => {
                this.avatarUrl = res.data.url;
                this.ref.detectChanges();
            }, function (err) {
                alert("Error getting user info: " + err);
            });
        }, function (err) {
            alert("Error getting user info: " + err);
        });
    }

    onLogout(eventData: Facebook.LoginEventData) {
        if (eventData.error) {
            alert("Error during login: " + eventData.error);
        } else {
            appSettings.clear();
            this.navigationService.go(['login'], "slideRight");
        }

    }

    logout() {
        Facebook.logout(() => {
            appSettings.clear();
            this.navigationService.go(['login'], "slideRight");
        });
    }
}