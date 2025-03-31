import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";
import MessageToast from "sap/m/MessageToast";
import { HttpService } from "../services/HttpService.service";
import { Generic } from "../model/entities/Generic.dto";

export default class Candidature extends BaseController {

	async onInit(): Promise<void> {
		this.getView().setModel(new JSONModel([]), "vacancies")
		await this.getRouter().getRoute("Candidature")
			.attachPatternMatched(async (oEvent: any) => {
				await this.onLoadVancies();
				await this.onCreateFilters();
				await this.onLoad();
			}, this);
	}

	view(oEvent: any): void {

		var oButton = oEvent.getSource();

		var oContext = oButton.getBindingContext("candidatures");

		if (!oContext) {
			oContext = oButton.getParent().getBindingContext("candidatures");
		}

		var sId = oContext.getProperty("id");

		console.log("ID selecionado:", sId);

		this.navTo('CandidatureView', {
			id: sId
		});
	}


	async onLoad(): Promise<void> {
		await HttpService.get<Generic[]>("/v1/skills")
			.then((response: Generic[]) => {
				this.getView().setModel(new JSONModel(response), "skills");
			}),

			await HttpService.get<Generic[]>("/v1/ocupations")
				.then((response: Generic[]) => {
					this.getView().setModel(new JSONModel(response), "ocupations");
				}),

			await HttpService.get<Generic[]>("/v1/status?slug=vacancy_status")
				.then((response: Generic[]) => {
					this.getView().setModel(new JSONModel(response), "status");
				})
	}

	onButtonPress(oEvent: any): void {
		var oButton = oEvent.getSource();
		(this.byId("actionSheet") as any).openBy(oButton);
	}

	async onLoadVancies(): Promise<void> {
		await HttpService.get<any>('/v1/candidatures?skip=0&take=20')
			.then((response) => {
				this.getView().setModel(new JSONModel(response), "candidatures")
			}).catch((error) => {
				MessageToast.show("Vagas carregadas!");
			})
	}

	onCreateFilters(): void {
		this.getView().setModel(new JSONModel({
			title: "Desenvolvedor de Software C#",
			ocupation: {
				id: "bef71141-4859-46cb-9880-7a83d1532d14"
			},
			status: {
				id: "bb0bc2c3-62c4-4159-a680-5a45226ab7b1"
			},
			dateInit: '28-03-2025',
			dateEnd: '01-04-2025',
			skills: ['4b867bb5-eb6b-41cc-87a6-5041927be496']
		}));
	}

}
