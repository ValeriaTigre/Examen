import axios from "axios";

export class EmpresaService {
  getEmpresas() {
    return axios
      .get("http://localhost:9090/api/v1.0/empresa")
      .then((res) => res.data.result);
  }
  postEmpresas(empresas) {
    return axios.post("http://localhost:9090/api/v1.0/empresa", empresas);
  }
  putEmpresas(empresas) {
    return axios.put("http://localhost:9090/api/v1.0/empresa", empresas);
  }
  deleteEmpresas(empresas) {
    return axios.delete("http://localhost:9090/api/v1.0/empresa", empresas);
  }
}