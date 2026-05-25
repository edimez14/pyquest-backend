export declare class ApiService {
    getInfo(): {
        name: string;
        version: string;
        status: string;
        timestamp: string;
    };
    getEndpoints(): {
        auth: string[];
        users: string[];
        ejercicios: string[];
        quiz: string[];
        progreso: string[];
        compiler: string[];
        core: string[];
    };
}
