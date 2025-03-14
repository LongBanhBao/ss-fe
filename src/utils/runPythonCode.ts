import axios from "axios";
import Bottleneck from "bottleneck";

export const instancePiston = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export const getRuntime = async () => {
  try {
    const response = await instancePiston.get("/runtimes");
    const python_runtime = response.data.filter(
      (runtime: { language: string }) => runtime.language === "python"
    );
    const version = python_runtime[0].version;
    return version;
  } catch (error) {
    console.log("Error in get runtime", error);
  }
};

let version: string = "3.10";
(async () => {
  version = await getRuntime();
})();

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 300,
});

type RunPythonCodeResponse = {
  code: number;
  output: string;
  signal: string | null;
  stderr: string;
  stdout: string;
};

export const runPythonCode = limiter.wrap(
  async (
    code: string,
    input: string
  ): Promise<RunPythonCodeResponse | null> => {
    try {
      const response = await instancePiston.post("/execute", {
        language: "python",
        version: version,
        files: [
          {
            name: "main.py",
            content: code,
          },
        ],
        stdin: input,
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      });
      const output = response.data.run;
      console.log("Output", output);
      return output;
    } catch (error) {
      console.log("Error in post piston", error);
      return null;
    }
  }
);
