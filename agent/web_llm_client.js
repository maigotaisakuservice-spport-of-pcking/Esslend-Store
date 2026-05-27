const { CreateMLCEngine } = require("@mlc-ai/web-llm");

class WebLLMClient {
    constructor() {
        this.modelId = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC";
        this.engine = null;
    }

    async initialize() {
        console.log(`Initializing WebLLM with model: ${this.modelId}`);
        // In a Node environment, this requires appropriate environment setup (GPU/Vulkan etc.)
        // For GitHub Actions, we assume the environment is set up as per workflow.
        this.engine = await CreateMLCEngine(this.modelId, {
            initProgressCallback: (report) => console.log(report.text),
            device: "cpu" // Explicitly set to CPU for CI environments
        });
    }

    async generateResponse(systemPrompt, userPrompt) {
        if (!this.engine) {
            await this.initialize();
        }

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ];

        const reply = await this.engine.chat.completions.create({
            messages,
            temperature: 0.7,
        });

        return reply.choices[0].message.content;
    }
}

module.exports = new WebLLMClient();
