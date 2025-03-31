import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";
import MessageToast from "sap/m/MessageToast";
import { HttpService } from "../services/HttpService.service";
import { Generic } from "../model/entities/Generic.dto";

export default class Vacancies extends BaseController {

	async onInit(): Promise<void> {

		await this.getRouter().getRoute("vacancies")
			.attachPatternMatched(async (oEvent: any) => {
				this.getView().setModel(new JSONModel([]), "vacancies")
				await this.onCreateFilters();
				await this.onAfterLoadVacancies();
				await this.onLoad();

			}, this);
	}

	async filter(): Promise<void> {

		let filters = (this.getView().getModel() as JSONModel).getData();
		console.log(filters)
		await HttpService.get<any>(`/v1/vacancies?skip=0&take=20&title=${filters.title}&ocupation=${filters.ocupation.id}`)
			.then((response) => {
				console.log(response)
				this.getView().setModel(new JSONModel(response), "vacancies")
			}).catch((error) => {
				MessageToast.show("Vagas carregadas!");
			})
	}

	edit(oEvent: any): void {

		var oButton = oEvent.getSource();

		var oContext = oButton.getBindingContext("vacancies");

		if (!oContext) {
			oContext = oButton.getParent().getBindingContext("vacancies");
		}

		var sId = oContext.getProperty("id");

		console.log("ID selecionado:", sId);

		this.navTo('VacanciesEdit', {
			id: sId
		});
	}

	create() {
		this.navTo('VacanciesEdit', {
			id: '0'
		});
	}

	view(oEvent: any): void {

		var oButton = oEvent.getSource();

		var oContext = oButton.getBindingContext("vacancies");

		if (!oContext) {
			oContext = oButton.getParent().getBindingContext("vacancies");
		}

		var sId = oContext.getProperty("id");

		console.log("ID selecionado:", sId);

		this.navTo('VacanciesView', {
			id: sId
		});
	}

	delete(): void {

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

	async onAfterLoadVacancies(): Promise<void> {

		let url = '/v1/vacancies?skip=0&take=20' as string
		let data = (this.getView().getModel() as JSONModel).getData()

		console.log(data.skills)
		
		if (data.skills && data.skills)
			for (let id in data.skills)
				url += `&skills=${id}`

		if (data.dateInit && data.dateInit != undefined && data.dateInit != '' && data.dateEnd && data.dateEnd != undefined && data.dateEnd != '')
			url += `&dateInit=${data.dateInit}&dateEnd=${data.dateEnd}`

		if (data.status && data.status.id != undefined && data.status.id != '')
			url += `&status=${data.status.id}`


		if (data.ocupation && data.ocupation.id != undefined && data.ocupation.id != '')
			url += `&ocupation=${data.ocupation.id}`

		if (data.title && data.title != undefined && data.title != '')
			url += `&title=${data.title}`

		console.log(url)

		await this.onLoadVancies(url);
	}

	async search(): Promise<void> {
		await this.onAfterLoadVacancies()
	}

	async onLoadVancies(url: string): Promise<void> {
		await HttpService.get<any>(url)
			.then((response) => {
				this.getView().setModel(new JSONModel(response), "vacancies")
			}).catch((error) => {
				MessageToast.show("Vagas carregadas!");
			})
	}

	onCreateFilters(): void {
		this.getView().setModel(new JSONModel({
			title: '',
			ocupation: {
				id: ''
			},
			status: {
				id: ''
			},
			dateInit: '',
			dateEnd: '',
			skills: ['']
		}));
	}

}
