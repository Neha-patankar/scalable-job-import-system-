import axios from "axios";
import { parseStringPromise } from "xml2js";

export const fetchJobsFromAPI = async (url) => {
  const response = await axios.get(url);
  const json = await parseStringPromise(response.data, { explicitArray: false });
  return json;
};
