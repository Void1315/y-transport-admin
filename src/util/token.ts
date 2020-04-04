export const tokenCheck = () => {
  let token = getCookie("token");
  return !!token;
}
function getCookie(cname:string)
{
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i=0; i<ca.length; i++) 
  {
    let c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}