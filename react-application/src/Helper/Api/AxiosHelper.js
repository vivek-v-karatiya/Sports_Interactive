import Axios from "axios";

export const axiosGetApiHelper = async (apiPath) => {
	let data;
	try {
		await Axios.get(apiPath)
			.then((result) => {
				data = result;
			})
			.catch((error) => {
				data = `Error:-${error}`;
			});
	} catch (error) {
		data = `Error:-${error}`;
	}
	return data;
};
