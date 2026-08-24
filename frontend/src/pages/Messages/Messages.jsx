import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../../assets/logo/kite-brand-logo.png";

function Messages() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);


  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");

      const currentUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      setUsers(
        res.data.filter(
          (u) => u._id !== currentUser._id
        )
      );

    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="chat-container">


      {/* LEFT CONNECT PANEL */}

      <div className="users-list">


        <div className="users-header">


          <div className="connect-title">

            <button
              className="back-btn"
              onClick={() => navigate("/home")}
            >
              <FaArrowLeft />
            </button>


            <h2>
              Connect
            </h2>


          </div>



          <input
            className="user-search"
            placeholder="Search people..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


        </div>



        {
          users
            .filter((user) =>
              user.username
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map((user) => (

              <div
                key={user._id}
                className="user-item"
                onClick={() =>
                  navigate(`/chat/${user._id}`)
                }
              >


                <div className="avatar-wrapper">


                  <img
                    src={
                      user.avatar ||
                      "https://i.pravatar.cc/100"
                    }
                    alt=""
                  />


                  <span className="online-dot"></span>


                </div>



                <div className="user-info">


                  <h4>
                    {user.username}
                  </h4>


                  <p>
                    Tap to chat
                  </p>


                </div>



              </div>

            ))
        }



      </div>





      {/* RIGHT EMPTY CONNECT SCREEN */}


     <div className="connect-empty">

  <div className="empty-content">

    <img
      src={logo}
      alt="KITE"
      className="connect-logo"
    />

    <h1>
      Welcome to Connect
    </h1>

    <p>
      Choose someone from your network
      <br/>
      and start a conversation.
    </p>

  </div>

</div>



    </div>
  );
}


export default Messages;