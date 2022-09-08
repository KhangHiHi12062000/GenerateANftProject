import React, { useEffect, useState ,createContext} from "react";
import "./App.css";
import { useDispatch, useSelector} from "react-redux";
import { connect, sendTransacsion} from "./redux/blockchain/blockchainActions";
import { fetchData , getOwner } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import { BrowserRouter as Router, Route, Routes , useNavigate} from 'react-router-dom'
import LipRenderer from "./components/lipRenderer";
import formInput from "./components/formInput";
import Navbar from "./components/Navbar";
import _color from "./assets/images/bg/_color.png";
import Shop from "./components/Shop";
import Assets from "./components/Assets";
import Home from "./components/Home";

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  //const authContext = createContext();

  const handleConnect = (e) => {
      e.preventDefault();
      dispatch(connect());
  }

  const transferFrom = (_account, _to, _id) => {
    setLoading(true);
    blockchain.lipToken.methods
      .transferFrom(_account,_to,_id)
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

  useEffect(() => {
    if (blockchain.account != "" && blockchain.lipToken != null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.lipToken]);
  
  return (
    <s.Screen image={_color}>
      <Navbar />
      <Router>
          <Routes>
            <Route exact path="/Home" element={<Home account={blockchain.account} onclick={handleConnect}/>}/>
            <Route exact path="/Shop" element={<Shop/>}/>
            <Route exact path="/Assets" element={<Assets/>}/>
          </Routes>
      </Router>
    </s.Screen>
  );

}

export default App;
