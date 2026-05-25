import { CompilerService } from './compiler.service';
import { RunPythonDto } from './dto/run-python.dto';
export declare class CompilerController {
    private readonly compilerService;
    constructor(compilerService: CompilerService);
    executePython(payload: RunPythonDto): Promise<{
        passed: boolean;
        phase: string;
        language: string;
        error: string;
        details: string;
        stdout: string;
        stderr: string;
        exitCode: number;
        executionTimeMs: number;
        readyForAiReview: boolean;
        output?: undefined;
        memoryKb?: undefined;
    } | {
        passed: boolean;
        phase: string;
        language: string;
        output: string;
        stdout: string;
        stderr: string;
        exitCode: number;
        executionTimeMs: number;
        memoryKb: number | null;
        readyForAiReview: boolean;
        error?: undefined;
        details?: undefined;
    }>;
}
