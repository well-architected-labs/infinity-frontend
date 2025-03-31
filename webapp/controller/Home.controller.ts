import BaseController from "./BaseController";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";
import { HttpService } from "../services/HttpService.service";
import { Generic } from "../model/entities/Generic.dto";


export default class Home extends BaseController {

	async onInit(): Promise<void> {
		await this.getRouter().getRoute("home")
			.attachPatternMatched(async (oEvent: any) => {
				this.getView().setModel(new JSONModel([]), "vacancies")
				await this.onLoadVancies();
				await this.onCreateFilters();
				await this.onLoad();
			}, this);
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

	onCreateFilters() {
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

	onExit(): void {

	}

	view(oEvent: any): void {

		var oButton = oEvent.getSource();

		var oContext = oButton.getBindingContext("vacancies");

		if (!oContext) {
			oContext = oButton.getParent().getBindingContext("vacancies");
		}

		var sId = oContext.getProperty("id");

		console.log("ID selecionado:", sId);

		this.navTo('VacanciesDetail', {
			id: sId
		});

	}


	preloader(status: boolean): void {
		var oTileContainer = this.byId("container") as any;
		oTileContainer.setBusy(status);
	}

	async onLoadVancies(): Promise<void> {
		await HttpService.get<any>('/v1/vacancies/tiles?skip=0&take=20')
			.then((response) => {
				this.getView().setModel(new JSONModel(response), "vacancies")
			}).catch((error) => {
				MessageToast.show("Vagas carregadas!");
			})
	}

}
