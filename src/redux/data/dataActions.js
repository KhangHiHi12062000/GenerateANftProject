// log
import store from "../store";
import Web3 from "web3";
import LipToken from "../../contracts/LipToken.json";
import NFTTrader from "../../contracts/NFTTrader.json"


const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};
const getOwnerRequest = (payload) => {
  return {
    type: "OWNER",
    payload: payload,
  };
};

export const getOwner = async (_id) => {
      const web3 = new Web3(window.ethereum);
      const networkId = await window.ethereum.request({
        method: "net_version",
      });
      const lipTokenNetworkData = await LipToken.networks[networkId];
      if (lipTokenNetworkData) {
      const contract = await new web3.eth.Contract(
        LipToken.abi,
        lipTokenNetworkData.address);
      const owner = await contract.methods.ownerOf(_id).call();
      return owner;
      }
      
}

export const getListing = async (_id) => {
  const web3 = new Web3(window.ethereum);
  const networkId = await window.ethereum.request({
    method: "net_version",
  });
  const TraderNetworkData = await NFTTrader.networks[networkId];
  if (TraderNetworkData) {
  const contract = new web3.eth.Contract(
    NFTTrader.abi,
    TraderNetworkData.address);
  const item = await contract.methods.methods.listings("0xB8170e2AD08812a2403697873B5CddEE8Ac09D81",_id)
  return item;
  }
  
}

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let allLips = await store
        .getState()
        .blockchain.lipToken.methods.getLips()
        .call();

      let allOwnerLips = await store
        .getState()
        .blockchain.lipToken.methods.getOwnerLips(account)
        .call();
      let approvedLips = [];
      allLips.forEach( async (element) => {
        await store
        .getState()
        .blockchain.nftTrader.methods.listings("0xB8170e2AD08812a2403697873B5CddEE8Ac09D81",element.id)
        .call().then((result)=>{
          if(result.price !== "0"){ approvedLips.push(element)}
        });
      });

      dispatch(
        fetchDataSuccess({
          allLips,
          allOwnerLips,
          approvedLips,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
