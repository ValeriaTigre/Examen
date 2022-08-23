import axios from 'axios'

export class FormaPagoService {

    getFormaPago() {
        return axios.get('http://localhost:9090/api/v1.0/formapago')
            .then(res => res.data.result);
    }

    postFormaPago(formapag) {
        return axios.post('http://localhost:9090/api/v1.0/formapago', formapag)
    }

    putFormaPago(formpag) {
        return axios.put('http://localhost:9090/api/v1.0/formapago', formpag)
    }

    deleteFormaPago(id){
        return axios.delete('http://localhost:9090/api/v1.0/formapago/' + id)
    }
}