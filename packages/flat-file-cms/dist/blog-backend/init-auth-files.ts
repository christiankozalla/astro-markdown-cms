import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const initAuthFileSystem = async () => {
  try {
    const dataDir = join(process.cwd(), "data", "cms");
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
        await writeFile(join(dataDir, file), "", { encoding: "utf8" });
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else console.error(err);
  }
};
