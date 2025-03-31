import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";
import MessageToast from "sap/m/MessageToast";
import { HttpService } from "../services/HttpService.service";
import { Generic } from "../model/entities/Generic.dto";

export default class VacanciesView extends BaseController {

	async onInit(): Promise<void> {
		await this.onLoadPage();
		await this.onLoad();
	}

	async onLoadPage() {
		this.getRouter().getRoute("VacanciesView")
			.attachPatternMatched((oEvent: any) => {
				var oArguments = oEvent.getParameter("arguments");
				if (oArguments.id !== '0')
					this.onLoadById(oArguments.id)
				else
					this.onCreateNew();
			}, this);
	}
	async onCreateNew(): Promise<void> {
		this.getView().setModel(new JSONModel({
			title: "Desenvolvedor de Software C#",
			description: `Estamos em busca de um Desenvolvedor de Software C#`,
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

	async onSave(): Promise<void> {

		const data = (this.getView().getModel() as any).getData();

		console.log(data)

		if (data.id && data.id !== '0')
			await this.update(data);
		else
			await this.save(data)
	}
	async update(data: any): Promise<void> {

		console.log(data)
		await HttpService.put<any>("/v1/vacancies", data).
			then(() => {
				MessageToast.show("Vaga atualizada com sucesso!");
			}).catch((error) => {
				MessageToast.show("Ocorreu um erro!");
			})
	}
	async save(data: any): Promise<void> {
		console.log(data)
		await HttpService.post<any>("/v1/vacancies", data).
			then(() => {
				MessageToast.show("Vaga salva com sucesso!");
			}).catch((error) => {
				MessageToast.show("Ocorreu um erro!");
			})
	}

	async onLoadById(id: any): Promise<void> {
		await HttpService.get<any>(`/v1/vacancies/${id}`)
			.then((response: any) => {
				console.log(response)
				this.getView().setModel(new JSONModel({
					...response,
					skills: response.skills = response.skills.map((skill: Generic) => {
						return skill.id;
					})
				}));
				this.loadCandidates(id);
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

	view(oEvent: any): void {

		var oButton = oEvent.getSource();

		var oContext = oButton.getBindingContext("candidates");

		if (!oContext) {
			oContext = oButton.getParent().getBindingContext("candidates");
		}

		var sId = oContext.getProperty("id");

		console.log("ID selecionado:", sId);

		this.navTo('CandidatureView', {
			id: sId
		});
	}

	async loadCandidates(id: string): Promise<void> {
		await HttpService.get<any[]>(`/v1/candidatures/subscribed?id=${id}&skip=0&take=20`)
			.then((response: any) => {
				this.getView().setModel(new JSONModel(response), "candidates")
			})
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

}
