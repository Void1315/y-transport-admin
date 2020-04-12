import React from 'react'
import {Button,ButtonGroup,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions} from '@material-ui/core'
import {Delete,Visibility,Create} from '@material-ui/icons';
import {makeStyles,createStyles} from '@material-ui/styles'
//@ts-ignore
import {useNotify,useDataProvider,useRedirect,useDelete} from 'react-admin';
const style = createStyles({
  button:{
        
  }
})
const useStyle = makeStyles(style)


const DeleteDialog = ({name,open,close,onDelete}:{onDelete:(...args:any[])=>any,name:string,open:boolean,close:React.Dispatch<React.SetStateAction<boolean>>}) => {
  return <Dialog
    open={open}
    onClose={()=>close(false)}
  >
    <DialogTitle id="alert-dialog-title">{`确定要删除${name}?`}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
            删除<b><em>{name}</em></b>您还有机会将其回复，但此操作不会删除<b><em>{name}</em></b>关联信息。若其他信息关联<b><em>{name}</em></b>则需要您重新选择管理对象。
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={()=>close(false)} color="primary" autoFocus>
            关闭
      </Button>
      <Button onClick={onDelete} color="primary">
            确认删除
      </Button>
    </DialogActions>
  </Dialog>
}

interface IOptionButtonGroupProps {
    source:string;
    onDelete?:(...args:any[])=>any
    onShow?:(...args:any[])=>any
    onEdit?:(...args:any[])=>any
    name:string
    label:string
}
export const OptionButtonGroup:React.FC<IOptionButtonGroupProps> = ({name,onShow,onEdit,source,onDelete,label,...props}:IOptionButtonGroupProps) => {
  const classes = useStyle()
  const [openDelete, setOpenDelete] = React.useState(false);
  const redirect = useRedirect();
  const notify = useNotify()
  const [approve] = useDelete(
    source,
    //@ts-ignore
    props.record.id,
    {},
    {
      undoable: true,
      onSuccess: () => {
        setOpenDelete(false)
        notify('删除成功,您还有机会撤销', 'info', {}, true);
      },
      onFailure: (error:any) => {setOpenDelete(false);notify(`删除失败: ${error}`, 'warning')},
    }
  );
  const changeDelete = () => {
    setOpenDelete(true)
  }
  const deleteItem = () => {
    if(onDelete){
      return onDelete()
    }else{
      approve()
    }
  }
  const changeShow = () => {
    if(onShow){
      return onShow()
    }else{
      //@ts-ignore
      redirect(`/${source}/${props.record.id}/show`)
    }
  }
  const changeEdit = () => {
    if(onEdit){
      return onEdit()
    }else{
      //@ts-ignore
      redirect(`/${source}/${props.record.id}`)
    }
  }
  return (
    <>
      <DeleteDialog onDelete={deleteItem} name={name} open={openDelete} close={setOpenDelete} />
      <ButtonGroup  color="primary">
        <Button
          color="primary"
          className={classes.button}
          startIcon={<Visibility />}
          onClick={changeShow}
        >
        查看
        </Button>
        <Button
          color="primary"
          className={classes.button}
          startIcon={<Create />}
          onClick={changeEdit}
        >
        编辑
        </Button>
        <Button
        
          color="secondary"
          className={classes.button}
          startIcon={<Delete />}
          onClick={changeDelete}
        >
        删除
        </Button>
      </ButtonGroup>
    </>
  )
}