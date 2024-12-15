import React, { createContext, useReducer, ReactNode, useContext, useEffect } from "react";

// Define the Member interface
interface Member {
  id: number;
  name: string;
  address: string;
  contact: string;
  gender: string;
  hub: string;
}
interface Convert {
  id: number,
  name: string,
  address: string,
  contact: string,
  gender: string;
  prayerrequest: string
}
// Define the initial state
const initialState = {
  members: [] as Member[],
  covert: [] as Convert[],
  churchData: [] as Record<string, any>[],
};




// Define action types
type Action =
  | { type: "ADD_MEMBER"; payload: Omit<Member, "id"> }
  | { type: "ADD_CONVERT"; payload: Omit<Convert, "id"> }
  | { type: "ADD_CHURCH_DATA"; payload: Record<string, any> }

  | { type: "UPDATE_MEMBER"; payload: Member }
  | { type: "UPDATE_CONVERT"; payload: Convert }
  | { type: "UPDATE_CHURCH_DATA"; payload: Record<string, any> }


  | { type: "RESET" }
  | { type: "REMOVE_MEMBER"; payload: number }
  | { type: "REMOVE_CONVERT"; payload: number }

// Define the state type
type State = typeof initialState;

// Reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_MEMBER":
      const newId = state.members.length
        ? Math.max(...state.members.map((member) => member.id)) + 1
        : 1;
      return {
        ...state,
        members: [...state.members, { id: newId, ...action.payload }],
      };
    case "REMOVE_MEMBER":
      return {
        ...state,
        members: state.members.filter((member) => member.id !== action.payload),
      };
    case "UPDATE_MEMBER":
      return {
        ...state,
        members: state.members.map((member) =>
          member.id === action.payload.id ? action.payload : member
        ),
      };
    case "ADD_CHURCH_DATA":
      return {
        ...state,
        churchData: [...state.churchData, action.payload],
      };
    case "UPDATE_CHURCH_DATA": {
      return {
        ...state, churchData:
          state.churchData.map((data) => data.id === action.payload.id ? action.payload : data)
      }
    }

    case "ADD_CONVERT": console.log(state, action.payload);
      const convId = state.covert.length
        ? Math.max(...state.covert.map((member) => member.id)) + 1
        : 1;
      return { ...state, covert: [...state.covert, { id: convId, ...action.payload }] }

    case "REMOVE_CONVERT":
      return {
        ...state,
        covert: state.covert.filter((conv) => conv.id !== action.payload),
      };
    case "UPDATE_CONVERT":
      return {
        ...state,
        covert: state.covert.map((conv) =>
          conv.id === action.payload.id ? action.payload : conv
        ),
      }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// Define the context type
interface DataContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Create the provider component
interface DataProviderProps {
  children: ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Load initial state from local storage
  const storedState = JSON.parse(localStorage.getItem("dataContext") || "null");
  const [state, dispatch] = useReducer(reducer, storedState || initialState);

  // Save state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("dataContext", JSON.stringify(state));
  }, [state]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;

// Custom hook to use the context
export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};

