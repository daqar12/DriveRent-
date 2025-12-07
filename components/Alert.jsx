'use client'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

const Alert = {
  success: (title = "Success!", text = "", timer = 2000) => {
    MySwal.fire({
      icon: 'success',
      title,
      text,
      timer,
      showConfirmButton: false,
    })
  },

  error: (title = "Error!", text = "", timer = 2000) => {
    MySwal.fire({
      icon: 'error',
      title,
      text,
      timer,
      showConfirmButton: false,
    })
  },

  warning: (title = "Warning!", text = "", timer = 2000) => {
    MySwal.fire({
      icon: 'warning',
      title,
      text,
      timer,
    })
  },

  info: (title = "Info", text = "", timer = 2000) => {
    MySwal.fire({
      icon: 'info',
      title,
      text,
      timer,
    })
  },

  confirm: async (title = "Are you sure?", text = "You won't be able to revert this!") => {
    const result = await MySwal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    })
    return result.isConfirmed
  },

  custom: (options) => {
    // options = {title, text, icon, showConfirmButton, timer, ...}
    MySwal.fire(options)
  }
}

export default Alert;
