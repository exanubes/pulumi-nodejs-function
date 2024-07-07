import { AssetArchive, StringAsset } from "@pulumi/pulumi/asset";
import { join } from "node:path";
import * as esbuild from "esbuild";
import { BuildOptions } from "esbuild";

export type TypescriptAssetArchiveArgs = Omit<
  BuildOptions,
  | "entryPoints"
  | "write"
  | "minify"
  | "outfile"
  | "outdir"
  | "outbase"
  | "outExtension"
> & {
  path: string;
};

export class TypescriptAssetArchive extends AssetArchive {
  constructor(path: string, props?: Omit<TypescriptAssetArchiveArgs, "path">) {
    const fileName = path.split("/").at(-1);
    if (!fileName) throw new Error("invalid path");
    if (!fileName.endsWith(".ts"))
      throw new Error("The path should point to a typescript file");

    const code = TypescriptAssetArchive.build({
      path,
      ...props,
    });
    if (!code) throw new Error("File is empty");

    super({
      [fileName.replace(/\.ts$/, ".js")]: new StringAsset(code),
    });
  }

  private static build({ path, ...props }: TypescriptAssetArchiveArgs) {
    if (!path) throw new Error("path is required");
    const { node } = process.versions;
    const [version] = node.split(".");

    const response = esbuild.buildSync({
      entryPoints: [join(process.cwd(), path)],
      bundle: true,
      write: false,
      platform: "node",
      minifyWhitespace: true,
      minify: false,
      target: props.target || (version ? `node${version}` : "node20"), // Specify your node version
      format: "cjs", // CommonJS format for Lambda compatibility
      external: [], // Add any external dependencies you want to exclude from the bundle
      tsconfig: join(process.cwd(), "tsconfig.json"),
      ...props,
    });

    return response?.outputFiles?.[0].text;
  }
}
