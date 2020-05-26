import React from 'react'
import {Container,Card,TextField,CircularProgress,Select,MenuItem,Grid,InputLabel,Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import {Autocomplete} from '@material-ui/lab'
//@ts-ignore
import { useDataProvider} from 'react-admin';
//@ts-ignore
import _ from 'loadsh';
import Fetch from '../../util/fetch'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import {useAMap} from '../../util/hook';
import style from './style'
import parse from 'date-fns/parse'
import compareAsc from 'date-fns/compareAsc'
import format from 'date-fns/format'
import add from 'date-fns/add'
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
  const [startError,setStartError] = React.useState(false)
  const [endError,setEndError] = React.useState(false)
  const [dialog,setDialog] = React.useState(false)
  const [selectTripId,setSelectTripId] = React.useState(0)
  const [startName,setStartName] = React.useState('')
  const [endName,setEndName] = React.useState('')
  const [time,setTime] = React.useState('')
  const [price,setPrice] = React.useState(0.0)
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
    if(!error){
      setDialog(true)
      const data = JSON.parse(selectRoute.path_json)
      const startData = data.filter((item: { id: number; })=>item.id === startId)[0]
      const endData = data.filter((item: { id: number; })=>item.id === endId)[0]
      setStartName(startData.keyword)
      setEndName(endData.keyword)
      const time = parse(startData.time,'HH:mm',new Date())
      const timeStr = compareAsc(time,new Date())>0?format(time,'yyyy年 MM月 dd日 HH:mm'):format(add(time,{
        days: 1,
      }),'yyyy年 MM月 dd日 HH:mm')
      setTime(timeStr)
      setPrice(endData.price - (startData.price||0))
    }
  }
  const handleClose = () => {
    setDialog(false)
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
  const handelBuy = () => {
    dataProvider.create("order",{
      data:{
        trip_id: selectTripId,
        start_id:startId,
        end_id:endId
      }
    }).then((res:any)=>{
      window.open(res.resData,"_blank");
    }).catch((err:any)=>{

    }).finally(()=>{
      handleClose()
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
      <Dialog fullWidth open={dialog} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">
          确认订单
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText> */}
          <Grid container direction="column">
            <Grid container alignItems="center">
              <Grid container item  xs={5}>
                <DialogContentText>出发地</DialogContentText>
              </Grid>
              <Grid container direction="column" item alignItems="center" justify="center" xs={2}>
                <span>G81</span>
                <ArrowRightAltIcon style={{transform: 'scale(6.5,1.0)'}}/>
              </Grid>
              <Grid container item justify="flex-end" xs={5}>
                <DialogContentText>目的地</DialogContentText>
              </Grid>
            </Grid>
            <Grid container alignItems="center">
              <Grid container item justify="space-between"  xs={12}>
                <span>{startName}</span>
                <DialogContentText>{time} 开</DialogContentText>
                <span>{endName}</span>
              </Grid>
            </Grid>
            <Grid container justify="flex-end" alignItems="center">
              <Grid container item justify="flex-end"  xs={2}>
                <span style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                }}>单价</span>
              
              </Grid>
              <Grid container item justify="flex-end" alignItems="center"  xs={2}>
                <span style={
                  {
                    color: 'coral',
                    fontSize: 20,
                    fontWeight: 900,
                    marginRight:8,
                  }
                }>{price}</span>
                <span>元</span>
              </Grid>
            
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            关闭
          </Button>
          <Button onClick={handelBuy} color="primary">
            立即下单
          </Button>
        </DialogActions>
      </Dialog>
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