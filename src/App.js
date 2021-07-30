import React, { Component } from "react";
import "./App.css";
import Navigation from "./components/navigation/navigation";
import FaceRecognition from "./components/facerecognition/facerecognition";
import ImageLinkForm from "./components/imagelinkform/imagelinkform";
import Rank from "./components/Rank/rank";
import Particles from "react-particles-js";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Loader from "./components/loader/loader";

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};
const initialState = {
  input: "",
  imageUrl: "",
  box: [],
  route: " ",
  isSignedIn: false,
  loading: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocation = (data) => {
    var FaceLocation = [];
    const clarifaiFaceArr = data.outputs[0].data.regions;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    for (var i = 0; i < clarifaiFaceArr.length; i++) {
      const singleBox = {
        leftCol: clarifaiFaceArr[i].region_info.bounding_box.left_col * width,
        topRow: clarifaiFaceArr[i].region_info.bounding_box.top_row * height,
        rightCol:
          width - clarifaiFaceArr[i].region_info.bounding_box.right_col * width,
        bottomRow:
          height -
          clarifaiFaceArr[i].region_info.bounding_box.bottom_row * height,
      };
      FaceLocation.push(singleBox);
    }
    return FaceLocation;
  };

  componentDidMount = () => {
    this.onSetLoading(true)
    const token = window.localStorage.getItem("token");
    if (token) {
      fetch("https://nameless-retreat-80613.herokuapp.com:/signin", {
        method: "post",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.userId) 
          {
            this.getUserProfile(data.userId);
            this.onSetLoading(false);

          }
          else {
            this.onRouteChange("signout");
            this.removeAuthToken();
          }
        })
        .catch(() => {
          this.onRouteChange("signout");
          this.removeAuthToken();
        });
    } else {
            this.onSetLoading(false);

      this.onRouteChange("signout");
      fetch("https://nameless-retreat-80613.herokuapp.com:/", {
        method: "get",
        headers: {
          "Content-type": "text/html",
          Authorization: `Bearer ${token}`,
        },
      })
        .then(console.log("works"))
        .catch((err) => console.log(err));
    }
  };
  displayFaceBox = (box) => {
    this.setState({ box: box });
  };
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.onSetLoading(true);
    this.setState({ imageUrl: this.state.input });
    if (this.state.input === "") {
      alert("please enter image url");
    } else {
      fetch("https://nameless-retreat-80613.herokuapp.com:/imageurl", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          input: this.state.input,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          if (response) {
            fetch("https://nameless-retreat-80613.herokuapp.com/image", {
              method: "put",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${window.localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                id: this.state.user.id,
              }),
            })
              .then((response) => response.json())
              .then((count) => {
                this.setState(
                  Object.assign(this.state.user, {
                    entries: count,
                  })
                );
                this.onSetLoading(false);
              })
              .catch((err) => {
                this.onSetLoading(false);
              });
          }

          this.displayFaceBox(this.calculateFaceLocation(response));
        })
        .catch((err) => alert("Enter a valid url"));
    }
  };

  getUserProfile = (userId) => {
    fetch(`https://nameless-retreat-80613.herokuapp.com/profile/${userId}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((user) => {
        if (user.email && user.id) {
          this.onRouteChange("home");
          this.loadUser(user);
        } else {
          this.onRouteChange("signout");
          this.removeAuthToken();
        }
      })
      .catch((err) => {
        console.log(err);

        this.onRouteChange("signout");
        this.removeAuthToken();
      });
  };
  removeAuthToken = () =>
    window.localStorage.getItem("token") &&
    window.localStorage.removeItem("token");

  saveAuthToken = (token) => {
    window.localStorage.setItem("token", token);
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
       this.removeAuthToken()
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  onSetLoading = (isLoading) => {
    this.setState({ loading: isLoading });
  };

  render() {
    const { isSignedIn, imageUrl, route, box, loading } = this.state;
    return (
      <div>
        <div className="App">
        {loading && <Loader />}
        {route !== '' &&
        (
        <div> 
          <Particles className="particles" params={particlesOptions} />
          <Navigation
            isSignedIn={isSignedIn}
            onRouteChange={this.onRouteChange}
          />
          </div>
        )}
          {route === "home" ? (
            <div>
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />

              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          ) : route === "signin" ? (
            <Signin
              loadUser={this.loadUser}
              onRouteChange={this.onRouteChange}
              onSetLoading={this.onSetLoading}
              loading={loading}
              getUserProfile={this.getUserProfile}
              saveAuthToken={this.saveAuthToken}
            />
          ) : route === 'register' || route ==='signout' ? 
            <Register
              loadUser={this.loadUser}
              onRouteChange={this.onRouteChange}
              onSetLoading={this.onSetLoading}
              loading={loading}
              getUserProfile={this.getUserProfile}
              saveAuthToken={this.saveAuthToken}
            />
          :
          null
          }
        </div>
      </div>
    );
  }
}

export default App;
