import { loginApi, signUpApi, verifyOtp } from "../../Api/api";
import { setUser,setError,clearError,setLogin, setEmail } from "../Slice/authSlice";
import axios from "axios";


export const signUpAsync = (userData,navigate) => async (dispatch) => {
    try{
        const response = await signUpApi(userData)
        console.log("Api Response:",response)
        if (response.data.error){
          dispatch(setError(response.data.error))
        }
        else if (response.status >= 200 && response.status <300){
            console.log("User Created Successfully")
            dispatch(setUser(response.data.data))
            navigate('/verify')
        }
        else{
          dispatch(setError(response.data.error));
        }
        
    } catch(error){
      console.log('Error during user creation:', error );
      console.log("Error Response:",error.response)
      console.log("Error Response data:",error.response.data.error)
      dispatch(setError(error.response.data.error))

    }
}


export const verifyOtpAsync = (email,otp,navigate) => async (dispatch) => {
  try{
    const response = await verifyOtp(email,otp)
    console.log("APi Response:",response)
    if (response.status === 200){
      dispatch(setUser(response.data.user))
      navigate('/')
    } else {
      dispatch(setError(response.data.error))
    }
  } catch(error){
    console.log("Errors:",error)
    dispatch(setError(error.response.data.error))
  }
}

export const login = (email,password,navigate) => async (dispatch) =>{
  dispatch(setError(''))
  try{
    const response = await loginApi(email,password)
    console.log(response)
    if(response.status === 200){
      dispatch(setLogin(response.data))
      console.log("UserDetails:",response.data.user.id)
      console.log("token:",response.data.jwt)
      localStorage.setItem('token', response.data.jwt)
      localStorage.setItem('userId',response.data.user.id)
      localStorage.setItem('CurrentUser',JSON.stringify(response.data))
      console.log("userid:",response.data.user.id)
      dispatch(clearError())
      navigate('/home/profile')
    }
    else{
      dispatch(setError("invalid details"))
    }
  }catch(error){
    console.log("An Error Occured:",error)
    if(error.response.data.error === 'User Is not verified'){
      dispatch(setEmail(email))
      navigate('/verify')
    }
    console.log("---------",error.response.data.error)
    dispatch(setError(error.response.data.error))
  }
}

export const googleLoginAsync = (tokenId, navigate) => async (dispatch) => {
  try {

    const response = await axios.post('http://127.0.0.1:8000/auth/login/google/', {
      access_token: tokenId,
      
    });

    const { user, token } = response.data;
    console.log("User:",user)
    console.log("Token:",token)
    dispatch(setUser(user));
    dispatch(setLogin(token));
    navigate('/');
  } catch (error) {
    console.log("Error:",error);
    dispatch(setError("Google login failed. Please try again."));
  }
};
