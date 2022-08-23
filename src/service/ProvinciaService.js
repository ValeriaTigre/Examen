import axios from 'axios';

export class ProvinciaService {    

    getFormaPago (){
        return axios.get('http://localhost:9090/api/v1.0/provincia').then(res => res.data.result);
    }
    postFormaPago (provin){
        return axios.post('http://localhost:9090/api/v1.0/provincia',provin);
    }
    putFormaPago (prov){
        return axios.put('http://localhost:9090/api/v1.0/provincia',prov);
    }
    deleteFormaPago (id){
        return axios.delete('http://localhost:9090/api/v1.0/provincia/'+id);
    }
}