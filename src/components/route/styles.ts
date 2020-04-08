import {createStyles} from '@material-ui/styles'
export default createStyles({
  mapBox: {
    height: 400,
    position: 'relative',
    zIndex: 1,
    ['@media only screen and (max-width: 500px)']:{
      width: 256,
    },
    ['@media only screen and (max-width: 1024px)']:{
      width: 500,
    },
    ['@media only screen and (min-width: 1440px)']:{
      width: 1000,
      height: 600,
    }
  },
  autoComplete:{
    marginBottom: 20,
  }
})