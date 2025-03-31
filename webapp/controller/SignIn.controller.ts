import { InputBase$ChangeEvent } from "sap/m/InputBase";
import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import * as Nominatim from "nominatim-client";
import MessageBox from "sap/m/MessageBox";
import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import Component from "../Component";
import AuthService from '../services/AuthService.service'
import { Role, User } from "../model/entities/User.entity";
export default class SignIn extends BaseController {

	async onInit(): Promise<void> {

		await this.getRouter().getRoute("SignIn")
			.attachPatternMatched(async (oEvent: any) => {
				this.onCreateForm()
			}, this);

	}

	async signUp(): Promise<void> {
		this.navTo('SignUp', {});
	}

	async checkType(oEvent: any): Promise<void> {
		console.log(oEvent.getSource().getState())
		const data = (this.getView().getModel('user') as JSONModel).getData()
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

	async signIn(oEvent: any): Promise<void> {

		const model = this.getView().getModel('user') as any;
		const data = model.getData();


		const button = oEvent.getSource();

		console.log(button.getBusy());


		console.log(data);


		button.setBusy(true);

		await AuthService.signIn({
			...data
		}).then((response: User) => {

			setTimeout(async () => {

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
				button.setBusy(false);

			}, 1000)
		}).catch((error) => {
			setTimeout(async () => {
				console.log('Falha ao fazer login!');
				button.setBusy(false);
			}, 1000)
		})
	}

}
