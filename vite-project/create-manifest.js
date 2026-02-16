import fs from "fs";
import * as path from "path";

const directoryPath = "./src/Characters";
const outputPath = "./src/";

console.log(`Parsing ${directoryPath}:`);

try {
    const filesAndDirs = fs.readdirSync(directoryPath);
    const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

    // Future-proof rule map for determining the default image
    const defaultImageMap = {
        "splash.webp": true,
    };

    let manifest = {};

    filesAndDirs.forEach((character) => {
        const subFolder = path.join(directoryPath, character);
        const stats = fs.statSync(subFolder);

        if (!stats.isDirectory()) return;

        console.log(`Checking this path: ${subFolder}`);
        console.log("\t" + fs.readdirSync(subFolder));

        let charObj = JSON.parse(
            fs.readFileSync(path.join(subFolder, "metadata.json"))
        );

        charObj.images = [];
        charObj.defaultImage = null;

        const files = fs.readdirSync(subFolder);

        files.forEach((file) => {
            const ext = path.extname(file).toLowerCase();
            if (!imageExtensions.includes(ext)) return;

            if (defaultImageMap[file] && !charObj.defaultImage) {
                // Assign first matching default
                charObj.defaultImage = file;
            } else {
                charObj.images.push(file);
            }
        });

        manifest[charObj.name] = charObj;
    });

    console.log(JSON.stringify(manifest, null, 2));
    fs.writeFileSync(
        path.join(outputPath, "manifest.json"),
        JSON.stringify(manifest)
    );

} catch (err) {
    console.log("Error:", err);
    process.exit(1);
}
