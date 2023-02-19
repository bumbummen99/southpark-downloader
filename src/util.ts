import { BaseEncodingOptions, PathLike } from 'fs';
import { lstat, readdir } from 'fs/promises';

declare type ReaddirOptions = (BaseEncodingOptions & {
  withFileTypes?: false | undefined;
}) | BufferEncoding | null | undefined;

export async function readdirRecursive(path: PathLike, options?: ReaddirOptions): Promise<string[]> {
  const paths = await readdir(path, options);
  for (const p of paths) {
    if ((await lstat(p)).isDirectory()) {
      paths.push(...(await readdirRecursive(p, options)));
    }
  }
  return paths;
};

export default {
  readdirRecursive
};
