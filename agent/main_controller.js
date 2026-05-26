const path = require('path');
const fs = require('fs-extra');
const { extractTextFromPDF } = require('./pdf_parser');
const webLLMClient = require('./web_llm_client');
const assetScraper = require('./asset_scraper');
const { createMetaFile } = require('./meta_generator');

async function main() {
    console.log("Starting TekipakiPC Autonomous Developer...");

    try {
        // 1. Parse Specifications
        const siyoPath = path.join(__dirname, '../siyo.pdf');
        if (!fs.existsSync(siyoPath)) {
            throw new Error("siyo.pdf not found in root directory.");
        }
        const specs = await extractTextFromPDF(siyoPath);
        console.log("Specifications extracted successfully.");

        // Check for update.pdf if update mode is on
        const isUpdate = process.env.GAME_UPDATE === 'true';
        let updateSpecs = "";
        if (isUpdate) {
            const updatePath = path.join(__dirname, '../update.pdf');
            if (fs.existsSync(updatePath)) {
                updateSpecs = await extractTextFromPDF(updatePath);
                console.log("Update specifications extracted.");
            }
        }

        // 2. Planning and Code Generation with LLM
        const systemPrompt = "You are a lead Unity developer agent. Your output must be valid C# code for Unity. Do not include markdown formatting or explanations, just the raw code.";

        // Task: Generate Player Controller
        console.log("Generating PlayerController.cs using WebLLM...");
        const playerPrompt = `Main Specs: ${specs}\n${updateSpecs ? "Update Specs: " + updateSpecs : ""}\nGenerate a C# PlayerController script for a 2D star collecting game. Include movement and basic collision detection for triggers.`;
        const playerCode = await webLLMClient.generateResponse(systemPrompt, playerPrompt);

        const scriptsDir = path.join(__dirname, '../UnityProject/Assets/Scripts');
        fs.ensureDirSync(scriptsDir);

        const playerScriptPath = path.join(scriptsDir, 'PlayerController.cs');
        fs.writeFileSync(playerScriptPath, playerCode);
        createMetaFile(playerScriptPath);

        // Task: Generate Game Manager
        console.log("Generating GameManager.cs using WebLLM...");
        const gmPrompt = `Main Specs: ${specs}\n${updateSpecs ? "Update Specs: " + updateSpecs : ""}\nGenerate a C# GameManager script to handle score and game state.`;
        const gmCode = await webLLMClient.generateResponse(systemPrompt, gmPrompt);

        const gmScriptPath = path.join(scriptsDir, 'GameManager.cs');
        fs.writeFileSync(gmScriptPath, gmCode);
        createMetaFile(gmScriptPath);

        // 3. Asset Acquisition
        console.log("Acquiring necessary assets...");
        // Using real, known CC0 assets from Kenneys (highly reliable for game dev)
        await assetScraper.downloadAsset(
            "https://raw.githubusercontent.com/KenneyNL/Kenney-Assets/master/Assets/Tiny%20Town/Tiles/tile_0000.png",
            "player.png",
            "Kenney",
            "CC0",
            "Player Sprite"
        );
        await assetScraper.downloadAsset(
            "https://raw.githubusercontent.com/KenneyNL/Kenney-Assets/master/Assets/Tiny%20Town/Tiles/tile_0108.png",
            "star.png",
            "Kenney",
            "CC0",
            "Star Collectible"
        );

        // Generate meta files for all downloaded assets
        const assetsDir = path.join(__dirname, '../UnityProject/Assets/AutonomousAssets');
        const files = fs.readdirSync(assetsDir);
        files.forEach(file => {
            if (!file.endsWith('.meta')) {
                createMetaFile(path.join(assetsDir, file));
            }
        });

        console.log("Autonomous development phase completed successfully.");

    } catch (error) {
        console.error("Development failed:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}
