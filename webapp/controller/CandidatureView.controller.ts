import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";
import MessageToast from "sap/m/MessageToast";
import { HttpService } from "../services/HttpService.service";
import { Generic } from "../model/entities/Generic.dto";
import formatter from "../model/formatter";

export default class CandidatureView extends BaseController {


	async onInit(): Promise<void> {
		await this.onLoadPage();
		await this.onLoad();
	}

	async onLoad() {
		await HttpService.get<Generic[]>("/v1/status?slug=candidature_status")
			.then((response: Generic[]) => {
				this.getView().setModel(new JSONModel(response), "status");
			})
	}

	async onLoadPage() {
		this.getRouter().getRoute("CandidatureView")
			.attachPatternMatched((oEvent: any) => {
				var oArguments = oEvent.getParameter("arguments");
				if (oArguments.id !== '0')
					this.onLoadById(oArguments.id)
				else
					this.onNavBack();
			}, this);
	}

	async onSave(): Promise<void> {
		const data = (this.getView().getModel() as any).getData();
		console.log(data);
		await this.update(data);
	}

	async update(data: any): Promise<void> {

		console.log(data)
		await HttpService.put<any>("/v1/candidatures", data).
			then(() => {
				MessageToast.show("Candidatura atualizada com sucesso!");
			}).catch((error) => {
				MessageToast.show("Ocorreu um erro!");
			})
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


	create(): void {
		console.log("here!")
		this.navTo('VacanciesEdit', {
			id: '0'
		});
	}

	edit(): void {
		console.log("here!")
		const data = (this.getView().getModel() as any).getData()
		this.navTo('VacanciesEdit', {
			id: data.id
		});
	}
}
