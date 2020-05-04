import React, { SyntheticEvent } from 'react'
import {Container,Card,TextField,CircularProgress,Select,MenuItem,InputLabel,Button} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {Autocomplete} from '@material-ui/lab'
//@ts-ignore
import { useDataProvider} from 'react-admin';
//@ts-ignore
import _ from 'loadsh';
import Fetch from '../../util/fetch'
import {useAMap} from '../../util/hook';
import style from './style'
const useStyle = makeStyles(style)
const UserPage = () => {
  const dataProvider = useDataProvider()
  const classes = useStyle()
  const [routeList,setRouteList] = React.useState([])
  const [selectRoute,setSelectRoute] = React.useState<any>(null)
  const [routerMap,setRouterMap] = React.useState<any>(null)
  const [startId,setStartId] = React.useState(0)
  const [endId,setEndId] = React.useState(0)
  const [tripList,setTripList] = React.useState([])
  const [tripError,setTripError] = React.useState(false)
  const [tripTip,setTripTip] = React.useState('')
  const [startError,setStartError] = React.useState(false)
  const [startTip,setStartTip] = React.useState('')
  const [endError,setEndError] = React.useState(false)
  const [endTip,setEndTip] = React.useState('')
  const [selectTripId,setSelectTripId] = React.useState(0)
  const changeRouteId = (event: any,value:any) => {
    setSelectRoute(value)
  }
  const mapCreate = (map:any,AMap:any) => {
    AMap.plugin(["AMap.Driving"],()=>{
      let r = new AMap.Driving({
        map,
      })
      setRouterMap(r)
    });
  }
  const {loading:mapLoading,el:mapEl,AMap,map} = useAMap({created:mapCreate})
  const search = (pathJsonObject:any) => {
    if(AMap&&routerMap){
      let _pathJson = _.cloneDeep(pathJsonObject)
      const startPoint =  new AMap.LngLat(_pathJson[0].lng,_pathJson[0].lat) 
      const endPoint = new AMap.LngLat(_pathJson[_pathJson.length - 1].lng,_pathJson[_pathJson.length - 1].lat) 
      const opts = {waypoints:_pathJson.slice(1,-1).map((item: { lng: any; lat: any; })=>{
        return new AMap.LngLat(item.lng,item.lat)
      })}
      routerMap&&routerMap.search(startPoint,endPoint,opts)
    }
  }
  const changeTrip = (e:any) => {
    setSelectTripId(e.target.value)
    setTripError(false)
  }
  const changeBuy = () => {
    let error = false
    if(!startId){
      setStartError(true)
      error = true;
    }
    if(!endId){
      setEndError(true)
      error = true;
    }
    if(!selectTripId){
      setTripError(true)
      error = true;
    }
    // if(!error){
    //     Fetch.
    // }
  }
  React.useEffect(()=>{
    dataProvider.all('routes_data').then((res:any)=>{
      setRouteList(res.data)
    }).catch((err:any)=>{
      console.log(err)
    })
  },[dataProvider])
  React.useEffect(()=>{
    if(selectRoute){
      const pathData = JSON.parse(selectRoute.path_json)
      search(pathData)
      fetchTrip()
    }
    setSelectTripId(0)
    setEndId(0)
    setStartId(0)
  },[selectRoute])
  const fetchTrip = () => {
    Fetch.post('/trip/get_trip',{
      route_id:selectRoute.id
    }).then((res:any)=>{
      setTripList(res.data.data)
    }).catch((err:any)=>{
      console.log(err)
    })
  }
  const SelectPoint = ({pathData,isStart=false,isEnd=false,value,error}:{error:boolean,value:number,pathData:any,isStart?:boolean,isEnd?:boolean}) => {
    let jump = isEnd && startId !=0;
    const changePoint = (e:any) => {
      const id = parseInt(e.target.value,10)
      if(isStart){setStartId(id);setStartError(false)}
      if(isEnd){setEndId(id);setEndError(false)}
    }
    return (
      <Select error={error} variant="outlined" value={value} onChange={changePoint} style={{ width: '100%' }}>
        {
          pathData.map((item:any,index:number)=>{
            if(isStart&&endId&&item.id === endId)jump=true;
            if(isEnd&&startId&&item.id === startId){jump=false;return;} //
            if(isEnd&&index === 0)return;
            if(isStart&&index === pathData.length-1)return;
            return (
              !jump&&<MenuItem key={item.id} value={item.id}>{item.keyword}</MenuItem>
            )
          })
        }
      </Select>
    )
  }

  return (
    <Container className={classes.container}>
      <Card className={classes.card}>
        <div className={classes.mapBox}>
          {mapLoading && <CircularProgress />}
          {mapEl}
        </div>
        <InputLabel className={classes.label}>选择路线</InputLabel>
        <Autocomplete
          options={routeList}
          getOptionLabel={(option:any) => option.name}
          onChange={changeRouteId}
          noOptionsText="没有找到路线"
          style={{ width: '100%' }}
          renderInput={(params) => <TextField {...params} label="选择路线" variant="outlined" />}
        />
        {
          selectRoute&&selectRoute.path_json && (
            <>
              <InputLabel className={classes.label} >选择出发点</InputLabel>
              <SelectPoint error={startError} value={startId} pathData={JSON.parse(selectRoute.path_json)} isStart />
              <InputLabel className={classes.label} >选择目的地</InputLabel>
              <SelectPoint error={endError} value={endId} pathData={JSON.parse(selectRoute.path_json)} isEnd />
              <InputLabel className={classes.label}>选择车次</InputLabel>
              <Select
                error={tripError}
                variant="outlined"
                onChange={changeTrip}
                value={selectTripId}
                style={{ width: '100%' }}>
                {
                  tripList.length > 0 ?tripList.map((item:any)=>{
                    return  <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                  }):<MenuItem value={0}>
                    <em>暂无车次</em>
                  </MenuItem>
                }
              </Select>
              <Button className={classes.label} onClick={changeBuy} variant="contained" color="primary">
                下单
              </Button>
            </>
            
          )
        }
        
      </Card>
    </Container>
  )
}
export default UserPage