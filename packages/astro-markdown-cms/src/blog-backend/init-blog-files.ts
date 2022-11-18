import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

export const initBlogFileSystem = async () => {
  try {
    const blogDataDir = join(process.cwd(), 'data', 'blog');
    let createDir = await mkdir(blogDataDir, { recursive: true });

    console.log(`created 'blog' ${createDir === undefined && 'successfully'}`);

    createDir = await mkdir(join(blogDataDir, 'drafts'), {
      recursive: true
    });
    console.log(
      `created 'drafts' ${createDir === undefined && 'successfully'}`
    );
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else console.error(err);
  }
};
