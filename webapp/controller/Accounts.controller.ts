import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";
import MessageToast from "sap/m/MessageToast";
import { HttpService } from "../services/HttpService.service";
import { Generic } from "../model/entities/Generic.dto";

export default class Accounts extends BaseController {

	async onInit(): Promise<void> {
		this.getView().setModel(new JSONModel([]), "users")
		this.getRouter().getRoute("Accounts")
			.attachPatternMatched(async (oEvent: any) => {
				await this.onCreateFilters();
				await this.onLoadAccounts(`/v1/users?skip=0&take=20`);
				await this.onLoadDependents();
			}, this);
	}

	async onLoadDependents(): Promise<void> {
		this.getView().setModel(new JSONModel([{
			name: 'Administrador',
			type: -1
		},
		{
			name: 'Empresa',
			type: 0
		},
		{
			name: 'Usuário',
			type: 1
		}]), "types");
	}

	async onCreateFilters(): Promise<void> {
		this.getView().setModel(new JSONModel({
			name: '',
			email: '',
			type: 1,
		}))
	}
	async onSearch(): Promise<void> {
		await this.onAfterLoadAccounts();
	}

	view(oEvent: any): void {

		var oButton = oEvent.getSource();

		var oContext = oButton.getBindingContext("users");

		if (!oContext) {
			oContext = oButton.getParent().getBindingContext("users");
		}

		var sId = oContext.getProperty("id");

		console.log("ID selecionado:", sId);

		this.navTo('AccountEdit', {
			id: sId
		});
	}


	onButtonPress(oEvent: any): void {
		var oButton = oEvent.getSource();
		(this.byId("actionSheet") as any).openBy(oButton);
	}

	async onAfterLoadAccounts(): Promise<void> {

		let url = '/v1/users?skip=0&take=20' as string
		let data = (this.getView().getModel() as JSONModel).getData()

		console.log(data)
		if (data.email && data.email != undefined && data.email != '')
			url += `&email=${data.email}`

		if (data.type && data.type != undefined && data.type != '')
			url += `&type=${data.type}`

		if (data.name && data.name != undefined && data.name != '')
			url += `&name=${data.name}`

		console.log(url)

		this.onLoadAccounts(url);
	}

	async onLoadAccounts(url: string): Promise<void> {
		await HttpService.get<any>(url)
			.then((response) => {
				this.getView().setModel(new JSONModel(response), "users")
			}).catch((error) => {
				MessageToast.show("Vagas carregadas!");
			})
	}
}
