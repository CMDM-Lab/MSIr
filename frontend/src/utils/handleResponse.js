const handleResponse = (res, MySwal, history)=>{
    switch(res.status){
        case 400:
        case 404:
            MySwal.fire({
                icon: 'error',
                title: `${res.data.message}`,
            })
            break
        case 401:
            MySwal.fire({
                icon: 'error',
                title: `${res.data.message}`,
            }).then(()=>{
              history.push('/users/sign_in')
            })
            break
        case 403:
        
            MySwal.fire({
                icon: 'error',
                title: `${res.data.message}`,
            }).then(()=>{
                history.goBack()
            })
            break
        case 500:
            MySwal.fire({
                icon: 'error',
                title: `${res.data.message}`,
                text: `Please retry after a while. (${res.data.message})`,
              }).then(()=>{
                history.goBack()
            })
            break
        default:
            break
    }

}
export {handleResponse}