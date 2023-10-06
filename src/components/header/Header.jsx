import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import useFirebaseAuth from "../../../firebase/Auth";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { AiOutlineUser, AiOutlineHome } from "react-icons/ai";
import { BsLightningCharge } from "react-icons/bs";
import { MdOndemandVideo } from "react-icons/md";
import { LiaUserCircleSolid } from "react-icons/lia";
import { BiLogOut, BiHelpCircle } from "react-icons/bi";
import { VscChromeClose } from "react-icons/vsc";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.scss";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/cinemaze-logo.png";
import Modal from "../modal/Modal";

const Header = React.memo(({ authPage }) => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState("");
  const [userMenu, setUserMenu] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const navigate = useNavigate();
  const { signOut } = useFirebaseAuth();
  const location = useLocation();

  const { authUser } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.auth);

  const controlNavbar = useCallback(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        if (window.scrollY > lastScrollY && !mobileMenu) {
          setShow("hide");
        } else {
          setShow("show");
        }
      } else {
        setShow("top");
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, mobileMenu]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    controlNavbar();
  }, [controlNavbar]);

  const searchQueryHandler = (event) => {
    event.preventDefault();
    if (query.length > 0) {
      navigate(`/search/${query}`);
      setShowSearch(false);
    }
  };

  const openSearch = useCallback(() => {
    setMobileMenu(false);
    setShowSearch(true);
  }, []);

  const openMobileMenu = useCallback(() => {
    setMobileMenu(true);
    setShowSearch(false);
  }, []);

  const navigationHandler = useCallback(
    (type) => {
      if (type === "movie") {
        navigate("/explore/movie");
      } else if (type === "login") {
        navigate("/login", {replace: true});
      } else if (type === "tv") {
        navigate("/explore/tv");
      } else if (type === "favourites") {
        navigate("/favourites");
      } else {
        navigate("/");
      }
      setMobileMenu(false);
    },
    [navigate]
  );

  const userMenuHandler = useCallback(() => {
    setUserMenu(!userMenu);
  }, [userMenu]);

  const signOutHandler = useCallback(() => {
    signOut();
    navigate("/");
    setUserMenu(false);
  }, [signOut, navigate]);

  const renderLoginButton = () => {
    if (!authUser) {
      return (
        <div className="loginBtn" onClick={() => navigationHandler("login")}>
          <AiOutlineUser />
          <span> Login </span>
        </div>
      );
    } else {
      return (
        <div className="user" onClick={userMenuHandler}>
          <LiaUserCircleSolid />
        </div>
      );
    }
  };

  return (
    <>
      <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
        <ContentWrapper>
          <div className="logo" onClick={() => navigate("/")}>
            <img src={logo} alt="" />
          </div>
          <ul className="menuItems">
            <li className="menuItem" onClick={() => navigationHandler("movie")}>
              Movies
            </li>
            <li className="menuItem" onClick={() => navigationHandler("tv")}>
              TV Shows
            </li>
            <li className="menuItem">
              <HiOutlineSearch onClick={openSearch} />
            </li>
            <li className="menuItem">{!isLoading && renderLoginButton()}</li>
          </ul>

          <div className="mobileMenuItems">
            <div className="menuItem">{!isLoading && renderLoginButton()}</div>
            <HiOutlineSearch onClick={openSearch} />
            {mobileMenu ? (
              <VscChromeClose onClick={() => setMobileMenu(false)} />
            ) : (
              <SlMenu onClick={openMobileMenu} />
            )}
          </div>
        </ContentWrapper>
        {showSearch && (
          <div className="searchBar">
            <ContentWrapper>
              <form className="searchInput" onSubmit={searchQueryHandler}>
                <input
                  type="text"
                  placeholder="Search for a movie or tv show...."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <VscChromeClose onClick={() => setShowSearch(false)} />
              </form>
            </ContentWrapper>
          </div>
        )}
        <ul className={`userMenuItems  ${userMenu ? "show" : ""}`}>
          <VscChromeClose onClick={() => setUserMenu(false)} />
          <li className="userMenuItem" onClick={() => navigationHandler("/")}>
            <AiOutlineHome />
            <span>Home</span>
          </li>
          <li
            className="userMenuItem"
            onClick={() => navigationHandler("favourites")}
          >
            <MdOutlineFavoriteBorder />
            <span>Favorites</span>
          </li>
          <li className="userMenuItem">
            <MdOndemandVideo />
            <span> WatchList</span>
          </li>
          <li className="userMenuItem">
            <BsLightningCharge />
            <span>What's New!</span>
          </li>
          <li className="userMenuItem">
            <BiHelpCircle />
            <span>Help Center</span>
          </li>
          <li
            className="userMenuItem"
            onClick={() => {
              setModalIsOpen(true);
            }}
          >
            <BiLogOut />
            <span>Logout</span>
          </li>
        </ul>
      </header>
      <Modal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onConfirm={() => {
          signOutHandler();
        }}
        title="Logout!"
        content="Do you really want to Logout?"
        btnContent="Confirm"
      />
    </>
  );
});

export default Header;
