export declare class CoreService {
    getHealth(): {
        status: string;
        service: string;
        timestamp: string;
    };
    getRoutes(): {
        auth: string[];
        users: string[];
        ejercicios: string[];
        quiz: string[];
        progreso: string[];
        compiler: string[];
    };
}
