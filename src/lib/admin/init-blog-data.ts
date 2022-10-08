import { mkdir } from "node:fs/promises";
import path from "node:path";

export default async () => {
  try {
    const blogDataDir = path.join(process.cwd(), "data", "blog");
    let createDir = await mkdir(blogDataDir, { recursive: true });

    console.log(`created 'blog' ${createDir === undefined && "successfully"}`);

    createDir = await mkdir(path.join(blogDataDir, "drafts"), {
      recursive: true,
    });
    console.log(
      `created 'drafts' ${createDir === undefined && "successfully"}`,
    );
  } catch (err) {
    console.error(err.message);
  }
};
