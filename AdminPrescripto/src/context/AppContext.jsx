import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currency = "₹"

    const calculateAge = (dob) => {
      const today = new Date();
      const birtDate = new Date(dob)

      let age = today.getFullYear() - birtDate.getFullYear()
      return age
    }

    const months = ["","Jan","Fab","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nav","Dec"]
    const slotDateFormet = (SlotDate ) => {
      const dateArray = SlotDate.split("_")
      return dateArray[0]+ " " + months[Number(dateArray[1])] + " " + dateArray[2]
    } 

    const value = {
     calculateAge,
     slotDateFormet,
     currency
    }

    return (
        <AppContext.Provider  value={value} >
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider