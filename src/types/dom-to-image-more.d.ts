declare module "dom-to-image-more" {
  function toPng(node: HTMLElement, options?: { scale?: number }): Promise<string>;
  function toJpeg(node: HTMLElement, options?: { scale?: number; quality?: number }): Promise<string>;
  function toBlob(node: HTMLElement, options?: { scale?: number }): Promise<Blob>;
  export { toPng, toJpeg, toBlob };
}