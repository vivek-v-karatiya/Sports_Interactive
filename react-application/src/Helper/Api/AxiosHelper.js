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
  //     await axios
  //       .get("https://api.npoint.io/20c1afef1661881ddc9c")
  //       .then((response) => {
  //         console.log(response);
  //         return response;
  //       });
  //   } catch (error) {
  //     return `Error :- ${error}`;
  //   }
};
