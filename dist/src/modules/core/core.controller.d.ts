import { CoreService } from './core.service';
export declare class CoreController {
    private readonly coreService;
    constructor(coreService: CoreService);
    health(): {
        status: string;
        service: string;
        timestamp: string;
    };
    routes(): {
        auth: string[];
        users: string[];
        ejercicios: string[];
        quiz: string[];
        progreso: string[];
        compiler: string[];
    };
}
