declare module modifyCssUrls {
  export interface options {
    append?: string;
    modify?: Function;
    prepend?: string;
  }
  export interface Stream extends NodeJS.ReadWriteStream {
      write(file: any): boolean;
  }
  export function modifyCssUrls(options?: options): Stream;
}
