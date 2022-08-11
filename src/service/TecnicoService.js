import axios from 'axios';


export class TecnicoService {

    getTecnico (){
        return axios.get('http://localhost:9090/api/v1.0/tecnico').then(res => res.data.result);
    }
    postTecnico (tecn){
        return axios.post('http://localhost:9090/api/v1.0/tecnico',tecn);
    }
    putTecnico(tecni){
        return axios.put('http://localhost:9090/api/v1.0/tecnico',tecni);
    }
    deleteTecnico (id){
        return axios.delete('http://localhost:9090/api/v1.0/tecnico/'+id);
    }
}

