"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompilerService = void 0;
const common_1 = require("@nestjs/common");
let CompilerService = class CompilerService {
    providerUrl = process.env.COMPILER_PROVIDER_URL ?? '';
    providerApiKey = process.env.COMPILER_PROVIDER_API_KEY ?? '';
    pythonLanguageId = Number(process.env.COMPILER_PYTHON_LANGUAGE_ID ?? 71);
    maxTimeoutMs = Number(process.env.COMPILER_MAX_TIMEOUT_MS ?? 5000);
    defaultTimeoutMs = 2000;
    maxOutputLength = 16000;
    async executePython(payload) {
        if (!this.providerUrl) {
            throw new common_1.ServiceUnavailableException('El compilador externo no está configurado.');
        }
        const code = payload.code.trim();
        const timeoutMs = this.normalizeTimeout(payload.timeoutMs);
        this.validateSecurityRules(code);
        const result = await this.callExternalCompiler({
            source_code: code,
            stdin: payload.stdin ?? '',
            language_id: this.pythonLanguageId,
            cpu_time_limit: timeoutMs / 1000,
            wall_time_limit: timeoutMs / 1000,
            memory_limit: 128000,
            redirect_stderr_to_stdout: false,
        });
        const stderr = result.stderr ?? result.compile_output ?? result.message ?? '';
        const stdout = result.stdout ?? '';
        const statusId = result.status?.id ?? 13;
        const statusDescription = result.status?.description ?? 'Error';
        const executionTimeMs = result.time
            ? Number(result.time) * 1000
            : timeoutMs;
        const passed = statusId === 3;
        const phase = result.compile_output ? 'compile' : 'runtime';
        if (!passed) {
            return {
                passed: false,
                phase,
                language: 'python',
                error: this.toFriendlyPythonError(stderr, statusDescription),
                details: this.lastErrorLine(stderr, statusDescription),
                stdout: this.limitOutput(stdout),
                stderr: this.limitOutput(stderr),
                exitCode: statusId,
                executionTimeMs,
                readyForAiReview: true,
            };
        }
        return {
            passed: true,
            phase,
            language: 'python',
            output: this.limitOutput(stdout),
            stdout: this.limitOutput(stdout),
            stderr: this.limitOutput(stderr),
            exitCode: statusId,
            executionTimeMs,
            memoryKb: result.memory,
            readyForAiReview: true,
        };
    }
    normalizeTimeout(timeoutMs) {
        const value = timeoutMs ?? this.defaultTimeoutMs;
        if (value > this.maxTimeoutMs) {
            return this.maxTimeoutMs;
        }
        return value;
    }
    validateSecurityRules(code) {
        const forbiddenPatterns = [
            /\bimport\s+os\b/i,
            /\bimport\s+subprocess\b/i,
            /\bimport\s+socket\b/i,
            /\bimport\s+ctypes\b/i,
            /\bfrom\s+os\s+import\b/i,
            /\bfrom\s+subprocess\s+import\b/i,
            /\b__import__\s*\(/i,
            /\bexec\s*\(/i,
            /\beval\s*\(/i,
            /\bopen\s*\(/i,
        ];
        for (const pattern of forbiddenPatterns) {
            if (pattern.test(code)) {
                throw new common_1.BadRequestException('El código contiene instrucciones no permitidas por seguridad.');
            }
        }
    }
    async callExternalCompiler(payload) {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.providerApiKey) {
            headers['X-Auth-Token'] = this.providerApiKey;
        }
        let response;
        try {
            response = await fetch(`${this.providerUrl}/submissions?base64_encoded=false&wait=true`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(this.maxTimeoutMs + 1000),
            });
        }
        catch {
            throw new common_1.ServiceUnavailableException('No hay conexión con el compilador externo.');
        }
        if (!response.ok) {
            throw new common_1.ServiceUnavailableException('No fue posible ejecutar el código en el compilador externo.');
        }
        return (await response.json());
    }
    toFriendlyPythonError(stderr, statusDescription) {
        if (/SyntaxError/i.test(stderr))
            return 'Error de sintaxis en el código.';
        if (/IndentationError/i.test(stderr))
            return 'Error de indentación en el código.';
        if (/NameError/i.test(stderr))
            return 'Se está usando una variable o nombre no definido.';
        if (/TypeError/i.test(stderr))
            return 'Se está usando un tipo de dato de forma incorrecta.';
        if (/ZeroDivisionError/i.test(stderr))
            return 'Se intentó dividir entre cero.';
        if (/IndexError/i.test(stderr))
            return 'Se intentó acceder a una posición inválida en una lista.';
        if (/KeyError/i.test(stderr))
            return 'Se intentó acceder a una clave inexistente en un diccionario.';
        if (/AttributeError/i.test(stderr))
            return 'Se intentó usar un atributo o método que no existe.';
        if (/ModuleNotFoundError/i.test(stderr))
            return 'Se intentó importar un módulo no disponible.';
        if (/Timeout/i.test(stderr) || /time limit/i.test(statusDescription))
            return 'El programa tardó demasiado en ejecutarse.';
        return 'El código no se pudo ejecutar correctamente.';
    }
    lastErrorLine(stderr, fallback) {
        const lines = stderr
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
        return lines.length > 0 ? lines[lines.length - 1] : fallback;
    }
    limitOutput(value) {
        if (value.length <= this.maxOutputLength) {
            return value;
        }
        return `${value.slice(0, this.maxOutputLength)}\n...[salida truncada]`;
    }
};
exports.CompilerService = CompilerService;
exports.CompilerService = CompilerService = __decorate([
    (0, common_1.Injectable)()
], CompilerService);
//# sourceMappingURL=compiler.service.js.map