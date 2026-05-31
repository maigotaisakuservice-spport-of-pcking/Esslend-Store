const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

function generateGuid() {
    return uuidv4().replace(/-/g, '').substring(0, 32);
}

function createMetaFile(filePath) {
    const metaPath = `${filePath}.meta`;
    if (fs.existsSync(metaPath)) return;

    const guid = generateGuid();
    const content = `fileFormatVersion: 2
guid: ${guid}
DefaultImporter:
  externalObjects: {}
  userData:
  assetBundleName:
  assetBundleVariant:
`;
    fs.writeFileSync(metaPath, content);
    console.log(`Generated meta for: ${filePath}`);
}

module.exports = { createMetaFile };
