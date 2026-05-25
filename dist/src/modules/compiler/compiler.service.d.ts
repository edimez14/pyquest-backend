import { RunPythonDto } from './dto/run-python.dto';
export declare class CompilerService {
    private readonly providerUrl;
    private readonly providerApiKey;
    private readonly pythonLanguageId;
    private readonly maxTimeoutMs;
    private readonly defaultTimeoutMs;
    private readonly maxOutputLength;
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
    private normalizeTimeout;
    private validateSecurityRules;
    private callExternalCompiler;
    private toFriendlyPythonError;
    private lastErrorLine;
    private limitOutput;
}
