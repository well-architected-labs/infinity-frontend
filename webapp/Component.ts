import UIComponent from "sap/ui/core/UIComponent";
import models from "./model/models";
import Device from "sap/ui/Device";
import { Role, User } from "./model/entities/User.entity";
import MessageToast from "sap/m/MessageToast";
import { Route } from "./model/entities/Route";
import JSONModel from "sap/ui/model/json/JSONModel";
import { HttpService } from "./services/HttpService.service";

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

		if (!await this.hasAnyScope(route)) {
			this.getRouter().navTo("home", {}, true);
			MessageToast.show('Você não tem permissão de utilizar esta rota');
			return;
		}
	}

	private async hasAnyScope(route: string): Promise<boolean> {
		const routes = this.getMetadata().getManifestObject().getEntry('sap.ui5').routing.routes as Route[];

		var routeSettigs = routes.find(c => c.name.includes(route)) as Route
		let isAllowed = routeSettigs.scopes.some(scope => scope.includes("*"))
		
		if(isAllowed)
			return true;

		const currentUser = await HttpService.get<User>("/v1/users/current");
		
		this.setModel(new JSONModel({
			id: currentUser.role.id,
			name: currentUser.role.name,
			alias: currentUser.role.alias,
			scopes: currentUser.role.scopes,
			active: true
		}), 'session');


		if (currentUser && currentUser.role && Array.isArray(currentUser.role.scopes)) {
			return routeSettigs.scopes.some(scope =>
				currentUser.role.scopes.some((c: any) => c.alias === scope)
			);
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
