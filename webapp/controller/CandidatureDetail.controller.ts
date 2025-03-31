import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";
import MessageToast from "sap/m/MessageToast";
import { HttpService } from "../services/HttpService.service";
import { Generic } from "../model/entities/Generic.dto";
import formatter from "../model/formatter";

export default class CandidatureView extends BaseController {


	async onInit(): Promise<void> {
		await this.onLoadPage();
	}


	async onLoadPage() {
		this.getRouter().getRoute("CandidatureDetail")
			.attachPatternMatched((oEvent: any) => {
				var oArguments = oEvent.getParameter("arguments");
				if (oArguments.id !== '0')
					this.onLoadById(oArguments.id)
				else
					this.onNavBack();
			}, this);
	}

	async onLoadById(id: any): Promise<void> {
		await HttpService.get<any>(`/v1/candidatures/${id}`)
			.then((response: any) => {
				console.log(response)
				this.getView().setModel(new JSONModel({
					...response,
				}));
			});
	}

}
