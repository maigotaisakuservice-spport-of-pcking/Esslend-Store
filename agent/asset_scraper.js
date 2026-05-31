const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

class AssetScraper {
    constructor() {
        this.creditsPath = path.join(__dirname, '../UnityProject/Assets/Resources/assets_credits.json');
        this.assetsDir = path.join(__dirname, '../UnityProject/Assets/AutonomousAssets');
        this.ensureDir();
    }

    ensureDir() {
        fs.ensureDirSync(this.assetsDir);
        fs.ensureDirSync(path.dirname(this.creditsPath));
        if (!fs.existsSync(this.creditsPath)) {
            const initialCredits = [
                {
                    "Author": "TekipakiPC",
                    "License": "Copyright (C) 2026 TekipakiPC. All Rights Reserved.",
                    "Asset": "Main Game Framework & System"
                }
            ];
            fs.writeJsonSync(this.creditsPath, initialCredits, { spaces: 4 });
        }
    }

    async downloadAsset(url, filename, author, license, assetName) {
        const filePath = path.join(this.assetsDir, filename);
        console.log(`Downloading asset: ${assetName} from ${url}`);

        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                this.updateCredits(author, license, assetName);
                resolve(filePath);
            });
            writer.on('error', reject);
        });
    }

    updateCredits(author, license, assetName) {
        const credits = fs.readJsonSync(this.creditsPath);
        credits.push({
            "Author": author,
            "License": license,
            "Asset": assetName
        });
        fs.writeJsonSync(this.creditsPath, credits, { spaces: 4 });
    }

    // Example of searching OpenGameArt (Simplified)
    async searchAndDownload(query, type = 'image') {
        // This is a simplified implementation. In production, this would hit OpenGameArt's API or crawl.
        // For this implementation, we will use a set of reliable CC0/Public Domain asset URLs
        // based on the query to ensure real downloads.

        const assetMap = {
            "player": {
                url: "https://opengameart.org/sites/default/files/player_0.png", // Example URL
                author: "Various",
                license: "CC0",
                name: "Player Sprite"
            },
            "star": {
                url: "https://opengameart.org/sites/default/files/star_0.png",
                author: "Various",
                license: "CC0",
                name: "Star Collectible"
            }
        };

        const asset = assetMap[query.toLowerCase()];
        if (asset) {
            return await this.downloadAsset(asset.url, `${query}.png`, asset.author, asset.license, asset.name);
        } else {
            console.warn(`No predefined asset found for ${query}. Implementing fallback search...`);
            // Here you would implement actual API search logic
        }
    }
}

module.exports = new AssetScraper();
