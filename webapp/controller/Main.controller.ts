import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageToast from "sap/m/MessageToast";
import Component from "../Component";
import AuthService from '../services/AuthService.service'
import { User } from "../model/entities/User.entity";
export default class Main extends BaseController {

	async onInit(): Promise<void> {
		await this.onCreateForm()
	}

	async signUp(): Promise<void> {
		this.navTo('SignUp', {});
	}

	async checkType(oEvent: any): Promise<void> {
		const data = (this.getView().getModel('user') as JSONModel).getData()
		console.log(data)
		this.getView().setModel(new JSONModel({
			...data,
			person: {
				type: oEvent.getSource().getState() ? '0' : '1',
			}
		}), 'user');
	}

	async onCreateForm(): Promise<void> {

		this.getView().setModel(new JSONModel({
			email: '',
			password: '',
			person: {
				type: '1',
			}
		}), 'user');
	}

	async signIn(oEvent:any): Promise<void> {

		const button = oEvent.getSource();

		console.log(button.getBusy());


		const model = this.getView().getModel('user') as any;
		console.log(model);
		const data = model.getData();

		console.log(data)

		button.setBusy(true);
		
		await AuthService.signIn({
			...data
		}).then((response: User) => {



			setTimeout(async ()=> {
				button.setBusy(false);
			
				localStorage.setItem("tenant_id", response.id);
				localStorage.setItem("alias", JSON.stringify(response.role.alias));

			this.getOwnerComponent().setModel(new JSONModel({
				id: response.role.id,
				name: response.role.name,
				alias: response.role.alias,
				scopes: response.role.scopes,
				active: true
			}), 'session');

			const mainAppView = this.getOwnerComponent().getRootControl() as any;
			const sideNav = mainAppView.byId("sideNavigation") as any;
			sideNav.setVisible(!sideNav.getExpanded());

			(this.getOwnerComponent() as Component).getRouter().navTo("home");

			MessageToast.show("Logado com sucesso!");
			console.log('entrou aqui!');
		}, 1000)
		}).catch((error) => {
			setTimeout(async ()=> {
				console.log('Falha ao fazer login!');
				button.setBusy(false);
			}, 1000)
		})
	}

}
