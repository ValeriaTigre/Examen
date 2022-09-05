export class TecnicoService {
    getTecnicos() {
      return axios
        .get("http://localhost:9090/api/v1.0/tecnico")
        .then((res) => res.data.result);
    }
    postTecnicos(tecnico) {
      return axios.post("http://localhost:9090/api/v1.0/tecnico", tecnico);
    }
    putTecnicos(tecnico) {
      return axios.put("http://localhost:9090/api/v1.0/tecnico", tecnico);
    }
    deleteTecnicos(tecnico) {
      return axios.delete("http://localhost:9090/api/v1.0/tecnico/", tecnico);
    }
  }
