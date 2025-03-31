import BaseController from "./BaseController";
import { PopinLayout } from "sap/m/library";
import MessageToast from "sap/m/MessageToast";
import Device from "sap/ui/Device";
import JSONModel from "sap/ui/model/json/JSONModel";
import { Role, User } from "../model/entities/User.entity";
import AuthService from "../services/AuthService.service";
import ThemeManager from "sap/ui/core/Theming";

export default class App extends BaseController {

	public async onInit(): Promise<void> {


		const theme = localStorage.getItem('theme') as string;

		if (theme)
			this.setTheme('sap_horizon')
		else
			this.setTheme(theme);

		this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		Device.media.attachHandler(this._handleMediaChange, this);
		this._handleMediaChange();

		await this.getRouter().attachRouteMatched(async (oEvent: any) => {
			await AuthService.current()
				.then(async (response) => {
					this.getView().setModel(new JSONModel({
						user: response,
						active: true
					}), 'session');

					await this.menu(response);

				}).catch(async (error) => {
					this.getView().setModel(new JSONModel({
						user: null,
						active: false
					}), 'session');
				})
		}, this);

		const model = this.getView().getModel("session") as any;

		if (model) {
			const data = model?.getData() as Role;
			console.log(data)
			if (data && data.alias.includes('administrator:system:*')) {
				console.log(data)
				console.log(data.name.includes('administrator:system:*'))
				const mainAppView = this.getOwnerComponent().getRootControl() as any;
				const sideNav = mainAppView.byId("sideNavigation") as any;
				sideNav.setVisible(true);
			}
		}

	}

	async changeTheme(oEvent: any): Promise<void> {
		if (!oEvent.getSource().getState()) {
			localStorage.setItem("theme", 'sap_horizon');
			this.setTheme('sap_horizon');
		}
		else {
			localStorage.setItem("theme", 'sap_horizon_dark');
			this.setTheme('sap_horizon_dark');
		}

	}

	private setTheme(theme: string) {
		ThemeManager.setTheme(theme);
	}

	async menu(response: User): Promise<void> {

		if (response.role.alias.includes('administrator:system:*'))
			this.getView().setModel(new JSONModel({
				menu: [
					{
						text: "Home",
						icon: "sap-icon://home",
						selectable: false,
						items: [
							{ text: "Home", target: "home" },
						]
					},
					{
						text: "Vagas",
						icon: "sap-icon://suitcase",
						selectable: false,
						items: [
							{ text: "Vagas", "target": "vacancies" },
						]
					},
					{
						text: "Configurações",
						icon: "sap-icon://action-settings",
						selectable: false,
						items: [
							{ text: "Minha conta", "target": "account" },
						]
					},
					{
						text: "Gestão",
						icon: "sap-icon://settings",
						selectable: false,
						items: [
							{ text: "Contas", "target": "accounts" },
						]
					}
				]
			}))

		if (response.role.alias.includes('administrator:company:system:*'))
			this.getView().setModel(new JSONModel({
				menu: [
					{
						text: "Home",
						icon: "sap-icon://home",
						selectable: false,
						items: [
							{ text: "Home", target: "home" },
						]
					},
					{
						text: "Vagas",
						icon: "sap-icon://suitcase",
						selectable: false,
						items: [
							{ text: "Vagas", target: "vacancies" },
							{ text: "Candidaturas", target: "vacancies" },
						]
					},
					{
						text: "Configurações",
						icon: "sap-icon://action-settings",
						selectable: false,
						items: [
							{ text: "Minha conta", "target": "account" },
						]
					}
				]
			}))

		if (response.role.alias.includes('administrator:person:system:*'))
			this.getView().setModel(new JSONModel({
				menu: [
					{
						text: "Home",
						icon: "sap-icon://home",
						selectable: false,
						items: [
							{ text: "Home", "target": "home" },
						]
					},
					{
						text: "Vagas",
						icon: "sap-icon://suitcase",
						selectable: false,
						items: [
							{ text: "Vagas", target: "home" },
							{ text: "Candidaturas", target: "candidated" },
						]
					},
					{
						text: "Configurações",
						icon: "sap-icon://action-settings",
						selectable: false,
						items: [
							{ text: "Minha conta", "target": "account" },
						]
					}
				]
			}))
	}


	onPopinLayoutChanged() {
		var oTable = this.byId("idProductsTable") as any;
		var oComboBox = this.byId("idPopinLayout") as any;
		var sPopinLayout = oComboBox.getSelectedKey();
		switch (sPopinLayout) {
			case "Block":
				oTable.setPopinLayout(PopinLayout.Block);
				break;
			case "GridLarge":
				oTable.setPopinLayout(PopinLayout.GridLarge);
				break;
			case "GridSmall":
				oTable.setPopinLayout(PopinLayout.GridSmall);
				break;
			default:
				oTable.setPopinLayout(PopinLayout.Block);
				break;
		}
	}

	onSelect(oEvent: any) {
		var bSelected = oEvent.getParameter("selected"),
			sText = oEvent.getSource().getText(),
			oTable = this.byId("idProductsTable") as any,
			aSticky = oTable.getSticky() || [];

		if (bSelected) {
			aSticky.push(sText);
		} else if (aSticky.length) {
			var iElementIndex = aSticky.indexOf(sText);
			aSticky.splice(iElementIndex, 1);
		}

		oTable.setSticky(aSticky);
	}

	onToggleInfoToolbar(oEvent: any) {
		var oTable = this.byId("idProductsTable") as any;
		oTable.getInfoToolbar().setVisible(!oEvent.getParameter("pressed"));
	}


	onListItemPress(oEvent: any) {
		MessageToast.show("Item Pressed: " + oEvent.getSource().getTitle());
	}

	onItemClose(oEvent: any) {
		var oItem = oEvent.getSource(),
			oList = oItem.getParent();

		oList.removeItem(oItem);
		MessageToast.show("Item Closed: " + oItem.getTitle());
	}

	onRejectPress() {
		MessageToast.show("Reject Button Pressed");
	}


	onAcceptPress() {
		MessageToast.show("Accept Button Pressed");
	}

	onCollapseExpandPress() {
		const oSideNavigation = this.byId("sideNavigation") as any;
		const bExpanded = oSideNavigation.getExpanded();
		oSideNavigation.setExpanded(!bExpanded);
	}


	onItemSelect(oEvent: any): void {
		const oItem = oEvent.getParameter("item");
		const sText = oItem.getText();
		const target = oItem.getTarget();
		MessageToast.show(`Item selected: ${sText}`);
		console.log(target);
		this.navTo(target, {});
	}


	logout(): void {

		this.getOwnerComponent().setModel(new JSONModel({
			id: '',
			name: '',
			alias: '',
			scopes: [],
			active: false
		}), 'session') as any;

		(this.byId("sideNavigation") as any).setVisible(false);

		localStorage.removeItem('token');
		MessageToast.show("Logout successful!");

		this.navTo('SignIn', {});

	}


	onAvatarPressed(): void {
		MessageToast.show("Avatar pressed!");
	}

	onLogoPressed(): void {
		MessageToast.show("Logo pressed!");
	}

	_handleMediaChange(): void {
		var rangeName = Device.media.getCurrentRange("StdExt").name;

		switch (rangeName) {
			// Shell Desktop
			case "LargeDesktop":
				(this.byId("productName") as any).setVisible(true);
				(this.byId("secondTitle") as any)?.setVisible(true);
				(this.byId("searchField") as any)?.setVisible(true);

				(this.byId("searchButton") as any)?.setVisible(false);
				MessageToast.show("Screen width is corresponding to Large Desktop");
				break;

			// Tablet - Landscape
			case "Desktop":
				(this.byId("productName") as any)?.setVisible(true);
				(this.byId("secondTitle") as any)?.setVisible(false);
				(this.byId("searchField") as any)?.setVisible(true);

				(this.byId("searchButton") as any)?.setVisible(false);
				MessageToast.show("Screen width is corresponding to Desktop");
				break;

			// Tablet - Portrait
			case "Tablet":
				(this.byId("productName") as any)?.setVisible(true);
				(this.byId("secondTitle") as any)?.setVisible(true);
				(this.byId("searchButton") as any)?.setVisible(true);
				(this.byId("searchField") as any)?.setVisible(false);

				MessageToast.show("Screen width is corresponding to Tablet");
				break;

			case "Phone":
				(this.byId("searchButton") as any)?.setVisible(true);
				(this.byId("searchField") as any)?.setVisible(false);
				(this.byId("productName") as any)?.setVisible(false);
				(this.byId("secondTitle") as any)?.setVisible(false);
				MessageToast.show("Screen width is corresponding to Phone");
				break;

			default:
				break;
		}
	}
}
