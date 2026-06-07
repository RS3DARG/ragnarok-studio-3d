declare module "html2canvas" {
  interface Options {
    scale?: number;
    useCORS?: boolean;
    backgroundColor?: string | null;
    logging?: boolean;
    allowTaint?: boolean;
    foreignObjectRendering?: boolean;
  }
  function html2canvas(element: HTMLElement, options?: Options): Promise<HTMLCanvasElement>;
  export default html2canvas;
}