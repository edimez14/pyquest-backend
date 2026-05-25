import { RachasService } from './rachas.service';
import { Request } from 'express';
export declare class RachasController {
    private readonly rachasService;
    constructor(rachasService: RachasService);
    obtenerRachas(request: Request & {
        user?: {
            sub: number;
        };
    }): Promise<import("./dto/rachas-response.dto").RachasResponseDto>;
}
