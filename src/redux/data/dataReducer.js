const initialState = {
  loading: false,
  allLips: [],
  allOwnerLips: [],
  approvedLips: [],
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...initialState,
        loading: true,
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        allLips: action.payload.allLips,
        allOwnerLips: action.payload.allOwnerLips,
        approvedLips: action.payload.approvedLips,
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    case "OWNER":
      return{

      };
    default:
      return state;
  }
};

export default dataReducer;
