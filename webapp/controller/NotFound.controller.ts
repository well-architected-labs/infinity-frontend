import Component from "../Component";
import BaseController from "./BaseController";
import MessageToast from "sap/m/MessageToast";

export default class NotFound extends BaseController {
	onInit(): void {
		MessageToast.show("Página não encontrada!");
	}


	logout(): void{
		MessageToast.show("Logout successful!");
		this.onNavBack();
	}

}
