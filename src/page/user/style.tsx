import {createStyles} from '@material-ui/styles'
export default createStyles({
  container:{

  },
  label:{
    margin: '18px 0'
  },
  card:{
    marginTop: 32,
    marginBottom:32,
    padding:  32,
  },
  mapBox: {
    height: 400,
    position: 'relative',
    margin: '0 auto',
    zIndex: 1,
    ['@media only screen and (max-width: 1024px)']:{
      height: 200,
      width: '100%',
    },
    ['@media only screen and (min-width: 1440px)']:{
      width: '75%',
    }
  },
})