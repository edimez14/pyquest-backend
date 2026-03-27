import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { RunPythonDto } from './dto/run-python.dto';

interface Judge0SubmissionResponse {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string | null;
  memory: number | null;
  status: {
    id: number;
    description: string;
  };
}

@Injectable()
export class CompilerService {
  private readonly providerUrl = process.env.COMPILER_PROVIDER_URL ?? '';
  private readonly providerApiKey = process.env.COMPILER_PROVIDER_API_KEY ?? '';
  private readonly pythonLanguageId = Number(
    process.env.COMPILER_PYTHON_LANGUAGE_ID ?? 71,
  );
  private readonly maxTimeoutMs = Number(
    process.env.COMPILER_MAX_TIMEOUT_MS ?? 5000,
  );
  private readonly defaultTimeoutMs = 2000;
  private readonly maxOutputLength = 16000;

  async executePython(payload: RunPythonDto) {
    if (!this.providerUrl) {
      throw new ServiceUnavailableException(
        'El compilador externo no está configurado.',
      );
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

    const stderr =
      result.stderr ?? result.compile_output ?? result.message ?? '';
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

  private normalizeTimeout(timeoutMs?: number): number {
    const value = timeoutMs ?? this.defaultTimeoutMs;
    if (value > this.maxTimeoutMs) {
      return this.maxTimeoutMs;
    }
    return value;
  }

  private validateSecurityRules(code: string) {
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
        throw new BadRequestException(
          'El código contiene instrucciones no permitidas por seguridad.',
        );
      }
    }
  }

  private async callExternalCompiler(payload: {
    source_code: string;
    stdin: string;
    language_id: number;
    cpu_time_limit: number;
    wall_time_limit: number;
    memory_limit: number;
    redirect_stderr_to_stdout: boolean;
  }): Promise<Judge0SubmissionResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.providerApiKey) {
      headers['X-Auth-Token'] = this.providerApiKey;
    }

    let response: Response;

    try {
      response = await fetch(
        `${this.providerUrl}/submissions?base64_encoded=false&wait=true`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(this.maxTimeoutMs + 1000),
        },
      );
    } catch {
      throw new ServiceUnavailableException(
        'No hay conexión con el compilador externo.',
      );
    }

    if (!response.ok) {
      throw new ServiceUnavailableException(
        'No fue posible ejecutar el código en el compilador externo.',
      );
    }

    return (await response.json()) as Judge0SubmissionResponse;
  }

  private toFriendlyPythonError(
    stderr: string,
    statusDescription: string,
  ): string {
    if (/SyntaxError/i.test(stderr)) return 'Error de sintaxis en el código.';
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

  private lastErrorLine(stderr: string, fallback: string): string {
    const lines = stderr
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    return lines.length > 0 ? lines[lines.length - 1] : fallback;
  }

  private limitOutput(value: string): string {
    if (value.length <= this.maxOutputLength) {
      return value;
    }

    return `${value.slice(0, this.maxOutputLength)}\n...[salida truncada]`;
  }
}
