import React, { useReducer, useState } from "react";
import { initialState, AuthReducer } from "./reducer";
 
const AuthStateContext = React.createContext();
const AuthDispatchContext = React.createContext();
const InfoStateContext = React.createContext([{}, () => {}]);
//const InfoSetContext = React.createContext();

export function useAuthState() {
    const context = React.useContext(AuthStateContext);
    if (context === undefined) {
      throw new Error("useAuthState must be used within a ContextProvider");
    }
   
    return context;
  }
   
export function useAuthDispatch() {
    const context = React.useContext(AuthDispatchContext);
    if (context === undefined) {
      throw new Error("useAuthDispatch must be used within a ContextProvider");
    }
   
    return context;
  }

export function useInfoState() {
    const [info, setInfo] = React.useContext(InfoStateContext);
    if (info === undefined) {
      throw new Error("useInfoState must be used within a ContextProvider");
    }
   
    return [info, setInfo];
  }

/*export function setInfoState() {
    const context = React.useContext(InfoSetContext);
    if (context === undefined) {
      throw new Error("setInfoState must be used within a ContextProvider");
    }
   
    return context;
  }*/

export const ContextProvider = ({ children }) => {
    const [user, dispatch] = useReducer(AuthReducer, initialState);
    const [info, setInfo] = useState({
      page:'', //show banner
      pageInfo:'', //show banner detail
      projectName:'',
    })
   
    return (
      <AuthStateContext.Provider value={user}>
        <AuthDispatchContext.Provider value={dispatch}>
          <InfoStateContext.Provider value={[info, setInfo]}>
              {children}
          </InfoStateContext.Provider>
        </AuthDispatchContext.Provider>
      </AuthStateContext.Provider>
    );
  };