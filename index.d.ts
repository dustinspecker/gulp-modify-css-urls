declare module modifyCssUrls {
  export interface Options {
    append?: string;
    modify?: Function;
    prepend?: string;
  }
  export interface Stream extends NodeJS.ReadWriteStream {
      write(file: any): boolean;
  }
  export function modifyCssUrls(options?: Options): Stream;
}
