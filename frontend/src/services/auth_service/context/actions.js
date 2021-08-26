import instance from "../../api";
 
export async function loginUser(dispatch, loginPayload) {
  const requestOptions = {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginPayload),
  };
 
  try {
    dispatch({ type: 'REQUEST_LOGIN' });
    let response = await instance.post('/auth/signin',requestOptions);
    let data = await response.json();
 
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
  dispatch({ type: 'LOGOUT' });
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
}

export async function registerUser (signUpPayload) {
  const requestOptions = {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signUpPayload),
  };

  try {
    let response = await instance.post('/auth/signup',requestOptions);
    let data = await response.json();

    return data

  } catch (error) {
    return error
  }
}