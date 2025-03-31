export default {

	formatValue: (value: string) => {
		return value?.toUpperCase();
	},

	formatToList: (keys: Array<string>) => {
		console.log(keys)
		if (!Array.isArray(keys)) {
			return keys;
		}
		return keys.map((id: string) => {
			return { id: id };
		});
	}
};
