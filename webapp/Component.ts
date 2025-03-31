import UIComponent from "sap/ui/core/UIComponent";
import models from "./model/models";
import Device from "sap/ui/Device";
import { Role, User } from "./model/entities/User.entity";
import MessageToast from "sap/m/MessageToast";
import { Route } from "./model/entities/Route";
import JSONModel from "sap/ui/model/json/JSONModel";
import { HttpService } from "./services/HttpService.service";
import AuthService from "./services/AuthService.service";
import { Session } from "./model/entities/Session";

/**
 * @namespace com.erp.myapp
 */
export default class Component extends UIComponent {
	public static metadata = {
		manifest: "json",
	};

	private contentDensityClass: string;

	public init(): void {
		// call the base component's init function
		super.init();

		// create the device model
		this.setModel(models.createDeviceModel(), "device");

		this.getRouter().attachRouteMatched(this.onRouteMatched, this);

		// create the views based on the url/hash
		this.getRouter().initialize();
	}

	private async onRouteMatched(oEvent: any): Promise<void> {
		const route: string = oEvent.getParameter("name");

		await this.isSessionActive(route);

		if (!await this.hasAnyScope(route)) {
			this.getRouter().navTo("home", {}, true);
			MessageToast.show('Usuário sem permissão para acessar rota!');
			return;
		}
	}

	async checkRouteActive(route: string) {

		const routes = this.getMetadata().getManifestObject().getEntry('sap.ui5').routing.routes as Route[];
		const routeSettigs = routes.find(c => c.name.includes(route)) as Route

		let token = localStorage.getItem('token');

		if (!token && routeSettigs.authorization)
			this.getRouter().navTo("SignIn", {}, true);
		if (token && route.includes('SignIn'))
			this.getRouter().navTo("home", {}, true);
		if (token && route.includes('SignIn'))
			this.getRouter().navTo("home", {}, true);
		if (token && route.includes('SignUp'))
			this.getRouter().navTo("home", {}, true);
		if (!token && route.includes('SignUp'))
			return;
		if (!token && route.includes('SignUp'))
			return;

	}

	async isSessionActive(route: string): Promise<void> {

		await AuthService.current().then((response) => {
			this.setModel(new JSONModel({
				user: response,
				active: true
			}), 'session');
			this.checkRouteActive(route);
		}).catch(() => {
			localStorage.removeItem('token')
			this.checkRouteActive(route);
		})
	}

	private async hasAnyScope(route: string): Promise<boolean> {
		const routes = this.getMetadata().getManifestObject().getEntry('sap.ui5').routing.routes as Route[];
		const routeSettigs = routes.find(c => c.name.includes(route)) as Route
		const isAllowed = routeSettigs.scopes.some(scope => scope.includes("*"))

		if (isAllowed)
			return true;

		const session = (this.getModel("session") as JSONModel).getData() as Session;

		console.log(session)

		if (session.user && session.user.role && Array.isArray(session.user.role.scopes)) {
			let exsists = routeSettigs.scopes.some(scope =>
				session.user.role.scopes.some((c: any) => c.alias === scope)
			);
			console.log(exsists);
			return exsists;
		}

		return false;
	}

	/**
	 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
	 * design mode class should be set, which influences the size appearance of some controls.
	 * @public
	 * @returns css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
	 */
	public getContentDensityClass(): string {
		if (this.contentDensityClass === undefined) {
			// check whether FLP has already set the content density class; do nothing in this case
			if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
				this.contentDensityClass = "";
			} else if (!Device.support.touch) {
				// apply "compact" mode if touch is not supported
				this.contentDensityClass = "sapUiSizeCompact";
			} else {
				// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
				this.contentDensityClass = "sapUiSizeCozy";
			}
		}
		return this.contentDensityClass;
	}
}
