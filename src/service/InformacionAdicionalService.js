import axios from "axios";

export class InformacionAdicionalService {
  getInformacionAdicional() {
    return axios
      .get("http://localhost:9090/api/v1.0/informacionadicional")
      .then((res) => res.data.result);
  }

  postInformacionAdicional(infor) {
    return axios.post(
      "http://localhost:9090/api/v1.0/informacionadicional",
      infor
    );
  }

  putInformacionAdicional(inform) {
    return axios.put(
      "http://localhost:9090/api/v1.0/informacionadicional",
      inform
    );
  }

  deleteInformacionAdicional(inform) {
    return axios.delete(
      "http://localhost:9090/api/v1.0/informacionadicional/",
      inform
    );
  }
}