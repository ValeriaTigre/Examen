import axios from 'axios';

export class ProvinciaService {    

    getProvincia (){
        return axios.get('http://localhost:9090/api/v1.0/provincia').then(res => res.data.result);
    }
    postProvincia (provin){
        return axios.post('http://localhost:9090/api/v1.0/provincia',provin);
    }
    putProvincia (prov){
        return axios.put('http://localhost:9090/api/v1.0/provincia',prov);
    }
    deleteProvincia (id){
        return axios.delete('http://localhost:9090/api/v1.0/provincia/'+id);
    }
}