import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

export default async () => {
  try {
    const dataDir = path.join(process.cwd(), "data", "cms");
    const createDir = await mkdir(dataDir, { recursive: true });

    console.log(`created ${createDir === undefined && "successfully"}`);

    const content = await readdir(dataDir);
    const requiredFiles = ["sessions.txt", "users.txt"];
    for (let file of requiredFiles) {
      if (content.includes(file)) {
        console.log(`${file} already exits. Ok.`);
      } else {
        console.log(
          `${file} does not exist, but needed for DB. Creating ${file}...`,
        );
        await writeFile(path.join(dataDir, file), "", { encoding: "utf8" });
      }
    }
  } catch (err) {
    console.error(err.message);
  }
};
