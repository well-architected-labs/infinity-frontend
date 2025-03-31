import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";
import MessageToast from "sap/m/MessageToast";
import { HttpService } from "../services/HttpService.service";
import { Candidate } from "../model/entities/Candidate.dto";

export default class VacanciesDetail extends BaseController {


	async onInit(): Promise<void> {
		await this.onLoadPage();
	}

	async onLoadPage() {
		this.getRouter().getRoute("VacanciesDetail")
			.attachPatternMatched((oEvent: any) => {
				var oArguments = oEvent.getParameter("arguments");
				if (oArguments.id !== '0')
					this.onLoadById(oArguments.id)
				else
					this.onNavBack();
			}, this);
	}


	async candidate(): Promise<void> {
		const data = (this.getView().getModel() as any).getData();
		await this.update(data);
	}

	async update(data: any): Promise<void> {

		console.log(data);

		await HttpService.post<Candidate|any>("/v1/candidatures", {
			vacancy: {
				id: data.id
			}
		})
			.then(() => {
				MessageToast.show("Candidatura realizada com sucesso!");
			}).catch((error) => {
				console.log(error.message);
				MessageToast.show(error.message);
			})
	}
	async save(data: any): Promise<void> {
		console.log(data)
		await HttpService.post<Candidate|any>("/v1/vacancies", data).
			then(() => {
				MessageToast.show("Vaga salva com sucesso!");
			}).catch((error) => {
				console.log(error.message);
				MessageToast.show(error.message);
			})
	}

	async onLoadById(id: any): Promise<void> {
		await HttpService.get<any>(`/v1/vacancies/${id}`)
			.then((response: any) => {
				(this.byId("idButtonCandidate") as any).setVisible(response.person.type !== 1)
				console.log(response)
				this.getView().setModel(new JSONModel({
					...response
				}));
			});
	}


	logout(): void {

	}

}
