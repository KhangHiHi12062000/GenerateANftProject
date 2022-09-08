import React, {useEffect , useState} from "react";
import { useDispatch, useSelector} from "react-redux";
import { connect, sendTransacsion} from "../redux/blockchain/blockchainActions"
import { fetchData , getOwner } from "../redux/data/dataActions";
import * as s from "../styles/globalStyles";
import LipRenderer from "./lipRenderer";

const Assets = (props) => {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");

    const mintNFT = (_account, _name) => {
        setLoading(true);
        blockchain.lipToken.methods
          .createRandomLip(_name)
          .send({
            from: _account,
            value: blockchain.web3.utils.toWei("0.01", "ether"),
          })
          .once("error", (err) => {
            setLoading(false);
            console.log(err);
          })
          .then((receipt) => {
            setLoading(false);
            console.log(receipt);
            dispatch(fetchData(blockchain.account));
          });
      };

      const addListingTrader = (_price, _account, _id) => {
        setLoading(true);
        blockchain.nftTrader.methods
          .addListing(_price, _account, _id)
          .send({
            from: blockchain.account,
          })
          .once("error", (err) => {
            setLoading(false);
            console.log(err);
          })
          .then((receipt) => {
            setLoading(false);
            console.log(receipt);
            dispatch(fetchData(blockchain.account));
          });
      };
    
      const purchase = (_constractAddr, _id) => {
        setLoading(true);
        blockchain.nftTrader.methods
          .purchase(_constractAddr, _id, 1)
          .send({
            from: blockchain.account,
            value: blockchain.web3.utils.toWei("0.01", "ether"),
          })
          .once("error", (err) => {
            setLoading(false);
            console.log(err);
          })
          .then((receipt) => {
            setLoading(false);
            console.log(receipt);
            dispatch(fetchData(blockchain.account));
          });
      };
    
      const BurnNft = ( _id) => {
        setLoading(true);
        blockchain.lipToken.methods
          ._burn(_id)
          .send({
            from: blockchain.account,
          })
          .once("error", (err) => {
            setLoading(false);
            console.log(err);
          })
          .then((receipt) => {
            setLoading(false);
            console.log(receipt);
            dispatch(fetchData(blockchain.account));
          });
      };
    
      const setApprovedForAll = (_contractAddr, _approved) => {
        setLoading(true);
        blockchain.lipToken.methods
          .setApprovalForAll(_contractAddr,_approved)
          .send({
            from: blockchain.account,
          })
          .once("error", (err) => {
            setLoading(false);
            console.log(err);
          })
          .then((receipt) => {
            setLoading(false);
            console.log(receipt);
            dispatch(fetchData(blockchain.account));
          });
      };
    
      const levelUpLip = (_account, _id) => {
        setLoading(true);
        blockchain.lipToken.methods
          .levelUp(_id)
          .send({
            from: _account,
          })
          .once("error", (err) => {
            setLoading(false);
            console.log(err);
          })
          .then((receipt) => {
            setLoading(false);
            console.log(receipt);
            dispatch(fetchData(blockchain.account));
          });
      };

    // useEffect(() => {
    //     if (blockchain.account != "" && blockchain.lipToken != null) {
    //       dispatch(fetchData(blockchain.account));
    //     }
    //   }, [blockchain.lipToken]);

    return(
         <div>
      {blockchain.account === "" || blockchain.lipToken === null ? (
        <s.Container ai={"center"} style={{ padding: "24px" }}>
            <s.TextTitle>Need click to connect button</s.TextTitle>
        </s.Container>
        
      ) : (
        <s.Container ai={"center"} style={{ padding: "24px" }}>
          <s.TextTitle>Welcome to the game</s.TextTitle>
          <s.SpacerSmall />
          <form>
            <label>
              <input 
              type="text" 
              name="name" 
              placeholder="Enter Name of NFT"
              value={name}
              onChange={(e) => setName(e.target.value)}></input> 
              </label>
            
                <input type="button" value="CREATE NFT LIP" 
                onClick={(e) => {
              e.preventDefault();
              mintNFT(blockchain.account, name);
            }}/>
          </form>

          <s.SpacerMedium />
          <s.Container jc={"center"} fd={"row"} style={{ flexWrap: "wrap" }}>
            {data.allOwnerLips.map((item, index) => {
                
              return (
                <s.Container key={index} style={{ padding: "15px" }}>
                  <LipRenderer lip={item} />
                  <s.SpacerXSmall />
                  <s.Container>
                    <s.TextDescription>ID: {item.id}</s.TextDescription>
                    <s.TextDescription>DNA: {item.dna}</s.TextDescription>
                    <s.TextDescription>LEVEL: {item.level}</s.TextDescription>
                    <s.TextDescription>NAME: {item.name}</s.TextDescription>
                    <s.SpacerXSmall />
                    {()=>{
                      
                    }}
                    <button
                      disabled={loading ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        levelUpLip(blockchain.account, item.id);
                      }}
                    >
                      Level Up
                    </button>
                    <button
                      disabled={loading ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        console.log(blockchain.lipToken._address);
                        const result1 = getOwner(item.id).then((result)=>{
                  
                            setApprovedForAll(blockchain.nftTrader._address, true);
                              
                            addListingTrader("100000",blockchain.lipToken._address,item.id);
                          return result;
                        })

                      }}
                    >
                      Sell
                    </button>
                  </s.Container>
                </s.Container>
              );
            })}
          </s.Container>
        </s.Container>
      )}
      </div>
    )
}
export default Assets;