import React, { Component, useState ,useEffect, useAuth} from "react";
import { Link, useHistory } from "react-router-dom";
import { menuItems } from "./menuItems";
import { FaBeer } from 'react-icons/fa';
import "./Navbar.css"
import { Button } from "./Button";
import _logo from "../assets/images/bg/LOGO.png";
import { useDispatch, useSelector} from "react-redux";
import { connect, sendTransacsion} from "../redux/blockchain/blockchainActions"
import { fetchData , getOwner } from "../redux/data/dataActions";
import * as s from "../styles/globalStyles";

const Navbar = (props) => {
    const [clicked,setClicked]= useState(false);
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    //const auth = useAuth();

    const handleClick = () => {
        setClicked(!clicked);
    };

    useEffect(() => {
        if (blockchain.account != "" && blockchain.lipToken != null) {
          dispatch(fetchData(blockchain.account));
        }
      }, [blockchain.lipToken]);
    return(
        <nav className="NavbarItems">
            <h1 className="navbar-logo">NFT Project
                
            <i className="fab fa-react"></i></h1>
            <div><img className="img" src={_logo} width = "50" height = "50"></img></div>
            
            <div className="menu-icon" onClick={handleClick}>
                <i className={clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
            </div>
            <ul className={clicked ? 'nav-menu active' : 'nav-menu'}>
                {menuItems.map((item,index) => {
                    return(
                    <li key={index}>
                        <a className={item.cName} href={item.url}>
                            {item.title}
                        </a>
                    </li>
                    );
                })}
            </ul>
            <button
            onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
            }}
            >
            CONNECT
          </button>         
        </nav>
    )
}

export default Navbar;