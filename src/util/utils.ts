export function debounce(fn:(...args: any)=>void, wait:number) {
  let timer:any = null;
  return function () {
    //@ts-ignore
    let context = this
    let args = arguments
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(function () {
      //@ts-ignore
      fn.apply(context, args)
    }, wait)
  }
}