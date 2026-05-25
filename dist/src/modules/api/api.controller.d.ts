import { ApiService } from './api.service';
export declare class ApiController {
    private readonly apiService;
    constructor(apiService: ApiService);
    info(): {
        name: string;
        version: string;
        status: string;
        timestamp: string;
    };
    endpoints(): {
        auth: string[];
        users: string[];
        ejercicios: string[];
        quiz: string[];
        progreso: string[];
        compiler: string[];
        core: string[];
    };
}
