import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";

export default class Version extends BaseController {

	onInit(): void {
		const version = this.getOwnerComponent().getMetadata().getManifestObject().getJson() as any
		console.log(version)
		this.getView().setModel(new JSONModel({
			version: version._version
		}))
	}
}
