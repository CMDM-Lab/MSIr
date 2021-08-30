export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
  
    if (user && user.auth_token) {
      return { 'x-access-token': user.auth_token };
    } else {
      return {};
    }
  }