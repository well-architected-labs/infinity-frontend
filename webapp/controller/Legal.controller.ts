import JSONModel from "sap/ui/model/json/JSONModel";
import Component from "../Component";
import BaseController from "./BaseController";
import MessageToast from "sap/m/MessageToast";
import { HttpService } from "../services/HttpService.service";

export default class Legal extends BaseController {

	async onInit(): Promise<void> {
		await this.onCheckLegalTerm();
		await this.onCaptureIP();
	}
	async onCaptureIP(): Promise<void> {
		await HttpService.custom<any>('https://api.ipify.org/?format=json', )
			.then((response) => {
				localStorage.setItem('user_ip', response.ip)
			});
	}

	async onCheckLegalTerm(): Promise<void> {
		localStorage.setItem('user_agent', navigator.userAgent)
	}
}


