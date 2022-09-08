// constants
import Web3 from "web3";
import LipToken from "../../contracts/LipToken.json";
import NFTTrader from "../../contracts/NFTTrader.json";
// log
import { fetchData } from "../data/dataActions";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const sendTransacsion = (_acount, _to) =>{
  return async (dispatch) => {
      try {
        let params = [{
          "from":_acount,
          "to":_to,
          "gas": Number(30000).toString(16),
          "gasPrice":Number(250000000).toString(16),
          "value":Number(10000000000000000000).toString(16),
        }];

        const accounts = await window.ethereum.request({
          method: "eth_sendTransaction", params
        });
      } catch (err) {
        console.log(err);        
      }

};
};


const getOwnerRequest = (payload) => {
  return{
    type: "OWNER",
    payload: payload,
  };
};
const sendTransacsionRequest = (payload) => {
  return{
    type: "SEND",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    if (window.ethereum) {
      let web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await window.ethereum.request({
          method: "net_version",
        });
        console.log(networkId);
        const lipTokenNetworkData = await LipToken.networks[networkId];
        console.log(lipTokenNetworkData);
        const nftTraderNetwork = await NFTTrader.networks[networkId];
        console.log(nftTraderNetwork);
        if (lipTokenNetworkData) {
          web3.eth.getAccounts();
            const lipToken = new web3.eth.Contract(
            LipToken.abi,
            lipTokenNetworkData.address
          );
            const nftTrader = new web3.eth.Contract(
            NFTTrader.abi,
            nftTraderNetwork.address
          );
          dispatch(
            connectSuccess({
              account: accounts[0],
              lipToken: lipToken,
              nftTrader: nftTrader,
              web3: web3,
            })
          );

          // Add listeners start
          
          window.ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });

          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          dispatch(connectFailed("Change network to Polygon."));
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } else {
      dispatch(connectFailed("Install Metamask."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
