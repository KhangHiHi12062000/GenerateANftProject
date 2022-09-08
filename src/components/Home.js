import React, {useEffect} from "react";
import { useDispatch, useSelector} from "react-redux";
import { connect, sendTransacsion} from "../redux/blockchain/blockchainActions"
import { fetchData , getOwner } from "../redux/data/dataActions";
import * as s from "../styles/globalStyles";
import LipRenderer from "./lipRenderer";

const Home = (props) => {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);

    return(
        <div>
        <s.Container ai={"center"} style={{ padding: "24px" }}>
          <s.TextTitle>Welcome to the game</s.TextTitle>

          <s.SpacerMedium />
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
                    
                  </s.Container>
                </s.Container>
              );
            })}
          </s.Container>
        </s.Container>
      </div>
    )
}
export default Home;