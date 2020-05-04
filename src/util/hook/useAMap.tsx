import {Map} from 'react-amap'
import React from 'react'
interface IuseAMapProps {
    created?:(...args:any)=>any;
}
const useAMap = ({created}:IuseAMapProps) => {
  const [loading,setLoading] = React.useState(true);
  const [map,setMap] = React.useState<any>(null)
  const [AMap,setAMap] = React.useState<any>(null)
  const events = {
    created: (map:any) => {
      //@ts-ignore
      setAMap(window.AMap)
      setMap(map)
      setLoading(false)
      map.setMapStyle('amap://styles/whitesmoke');
      //@ts-ignore
      created&&created(map,window.AMap)
    }
  }
  const el = (<Map  amapkey={"722458940738295f8c529ecd3037af98"}  version={"1.4.15"} events={events} />)
  return {
    loading,
    el,
    map,
    AMap
  }
}
export default useAMap;