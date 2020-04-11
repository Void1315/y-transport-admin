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
interface IconvertFileToBase64Props {
  
}
export const convertFileToBase64 = (file:any) => new Promise((resolve, reject) => {
  console.log(file)
  const reader = new FileReader();
  reader.readAsDataURL(file.rawFile);

  reader.onload = () => resolve({
    base64:reader.result,
    title:file.title
  });
  reader.onerror = reject;
});