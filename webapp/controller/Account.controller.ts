import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";
import MessageToast from "sap/m/MessageToast";
import { HttpService } from "../services/HttpService.service";
import { Generic } from "../model/entities/Generic.dto";
import formatter from "../model/formatter";
import { Skill, User } from "../model/entities/User.entity";

export default class Account extends BaseController {


	async onInit(): Promise<void> {
		await this.getRouter().getRoute("Account")
			.attachPatternMatched(async (oEvent: any) => {
				await this.onLoadPage();
			}, this);
	}

	async onLoadPage() {
		await this.onLoad();
		await this.onLoadCurrent()
	}

	async onSave(): Promise<void> {

		const data = (this.getView().getModel() as JSONModel).getData() as User;

		if (data && data.person && data.person.skillsTemp)
			data.person.skills = data.person.skillsTemp?.map((id: string) => {
				return {
					id: id,
				} as Skill;
			});

		console.log(data.person)

		if (data.id && data.id !== '0')
			await this.update(data);
	}

	async update(data: User): Promise<void> {
		await HttpService.put<User>("/v1/users", data).
			then((response: User) => {
				this.getView().setModel(new JSONModel(response));
				MessageToast.show("Usuário atualizado com sucesso!");
			}).catch((error) => {
				MessageToast.show("Ocorreu um erro!");
			})
	}

	async onLoadCurrent(): Promise<void> {


		this.getView().setModel(new JSONModel({
			"email": "gabriel@4erp.io",
			"password": "",
			"person": {
				"firstName": "Gabriel",
				"lastName": "",
				"legalName": "",
				"fantasyName": "",
				"taxId": "",
				"bio": {
					"about": "",
					"resume": "",
					"linkedin": "",
					"webSite": "",
					"experiences": [
						{
							"name": "",
							"description": "",
							"dateInit": "2022-01-02T00:00:00",
							"dateEnd": "2022-01-02T00:00:00",
							"current": false
						}
					],
					"educations": [
						{
							"name": "",
							"description": "",
							"dateInit": "2022-01-02T00:00:00",
							"dateEnd": "2024-12-28T00:00:00"
						}
					]
				},
				"phone": {
					"id": "",
					"ddi": "",
					"ddd": "",
					"number": ""
				},
				"skills": [

				]
			}
		}));

		await HttpService.get<User>(`/v1/users/current`)
			.then((response: User) => {
				response.person.skillsTemp = response.person.skills ? response.person.skills.map((skill: Skill) => skill.id) : []
				this.getView().setModel(new JSONModel({
					...response,
				}));

			}).catch((error) => {
				this.onNavBack();
				MessageToast.show("Ocorreu um erro!");
			});
	}

	async onLoad(): Promise<void> {
		await HttpService.get<Generic[]>("/v1/skills")
			.then((response: Generic[]) => {
				this.getView().setModel(new JSONModel(response), "skills");
			});
	}

	async onAddExperience(): Promise<void> {


		const data = (this.getView().getModel() as JSONModel).getData() as User;

		if (!data.person.bio.experiences)
			data.person.bio.experiences = []

		data.person.bio.experiences.push({
			current: false,
			dateEnd: "2025-03-28T00:00:00",
			dateInit: "2025-03-28T00:00:00",
			description: "",
			name: "",
		});

		this.getView().setModel(new JSONModel({
			...data,
		}));
	}

	async onAddEducation(): Promise<void> {
		const data = (this.getView().getModel() as JSONModel).getData() as User;

		if (!data.person.bio.educations)
			data.person.bio.educations = []

		data.person.bio.educations.push({
			dateEnd: "2025-03-28T00:00:00",
			dateInit: "2025-03-28T00:00:00",
			description: "",
			name: "",
		});

		this.getView().setModel(new JSONModel({
			...data,
		}));
	}

	async onRemoveExperience(oEvent: any): Promise<void> {
		var oButton = oEvent.getSource();

		var sPath = oButton.getBindingContext().getPath();

		var aParts = sPath.split("/");
		var iIndex = parseInt(aParts[aParts.length - 1]);

		var oModel = this.getView().getModel() as any;
		var aEducations = oModel.getProperty("/person/bio/experiences");
		var sId = aEducations[iIndex].id;
		console.log(sId)
		aEducations.splice(iIndex, 1);

		oModel.setProperty("/person/bio/experiences", aEducations);

	}

	async onRemoveEducation(oEvent: any): Promise<void> {
		var oButton = oEvent.getSource();
		var sPath = oButton.getBindingContext().getPath();
		var aParts = sPath.split("/");
		var iIndex = parseInt(aParts[aParts.length - 1]);
		var oModel = this.getView().getModel() as any;
		var aEducations = oModel.getProperty("/person/bio/educations");
		var sId = aEducations[iIndex].id;
		console.log(sId)
		aEducations.splice(iIndex, 1);

		oModel.setProperty("/person/bio/educations", aEducations);

	}
}
