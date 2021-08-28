import instance from "../../api";
 
export async function loginUser(dispatch, loginPayload) {
  try {
    dispatch({ type: 'REQUEST_LOGIN' });
    let response = await instance.post('/auth/signin',loginPayload, { 'Content-Type': 'application/json' });
    let {data} = response
    console.log(data)
    //let data = await response.json();
 
    if (data.user) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      localStorage.setItem('currentUser', JSON.stringify(data));
      return data
    }
 
    dispatch({ type: 'LOGIN_ERROR', error: data.errors[0] });
    return;
  } catch (error) {
    dispatch({ type: 'LOGIN_ERROR', error: error });
  }
}
 
export async function logout(dispatch) {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
  dispatch({ type: 'LOGOUT' });
}

export async function registerUser (signUpPayload) {
  try {
    
    let response = await instance.post('/auth/signup',signUpPayload, { 'Content-Type': 'application/json' });
    console.log(response)
    //let data = await response.json();

    return response

  } catch (error) {
    return error
  }
}