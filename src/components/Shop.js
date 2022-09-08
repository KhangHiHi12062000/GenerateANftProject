import React, {useEffect , useState} from "react";
import { useDispatch, useSelector} from "react-redux";
import { connect, sendTransacsion} from "../redux/blockchain/blockchainActions"
import { fetchData , getOwner } from "../redux/data/dataActions";
import * as s from "../styles/globalStyles";
import LipRenderer from "./lipRenderer";
import { getListing } from "../redux/data/dataActions";


const Shop = (props) => {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [loading, setLoading] = useState(false);

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

    // useEffect(() => {
    //     if (blockchain.account != "" && blockchain.lipToken != null) {
    //       dispatch(fetchData(blockchain.account));
    //     }
    //   }, [blockchain.lipToken]);
      console.table(data.allLips)
      console.log(data.approvedLips)
      console.log(data.approvedLips.length)
    return(
         <s.Container jc={"center"} fd={"row"} style={{ flexWrap: "wrap" }}>
            {data.allLips.map((item, index) => {
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
                            <button
                              disabled={loading ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                console.log(data);
                                const result1 = getOwner(item.id).then((result)=>{
                                
                                  if(result != blockchain.account){
                                    purchase(blockchain.lipToken._address, item.id);
                                  }else{
                                    console.log("Can not transfer");
                                  }
                                  return result;
                                })
                              }
                            }
                            >
                              BuyNFT
                            </button>
                          </s.Container>
                        </s.Container>
                      );
                    })}
                  </s.Container>
            ) 
}
export default Shop;