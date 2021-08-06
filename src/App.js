import React, { Component, useState, useEffect } from "react";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import "./App.css";

const app = new Clarifai.App({
  apiKey: "8aac32d8e37c427b9ff6e5910f7131ee",
});

const particlesOptions = {
  //customize this to your liking
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
  boxes: [],
  route: "home",
  isSignedIn: true,
  user: {
    id: "",
    name: "Testing User",
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

  calculateFacesLocation = (data) => {
    // detect multiple faces
    const faces = data.outputs[0].data.regions;
    const facesResult = [];
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(faces, "what are faces -- array");
    faces.forEach((data) => {
      const face = data.region_info.bounding_box;
      const faceData = {
        leftCol: face.left_col * width,
        topRow: face.top_row * height,
        rightCol: width - face.right_col * width,
        bottomRow: height - face.bottom_row * height,
      };
      facesResult.push(faceData);
    });

    return facesResult;
  };

  displayFaceBox = (boxes) => {
    this.setState({ boxes: boxes });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  // ISSUE ONE : model id is required
  // https://stackoverflow.com/questions/62516331/clarifai-face-detect-model-does-not-exist
  // example img address
  // SINGLE IMAGE
  // https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500

  // MULTIPLE FACES IMAGES
  // https://media.glamour.com/photos/5e50661baf992600086814af/master/w_2560%2Cc_limit/Friends-cast-milkshake.jpg

  // ----------

  // issue: Clarifai api doesn't always work!!
  // because of the hourly request limit
  // 11003 Hourly request limit exceeded

  // Improvement 2: detecting multiple faces - step by step guide
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    // a403429f2ddf4b49b307e318f00e528b

    //console.log(Clarifai.FACE_DETECT_MODEL, "what is face detect model");
    app.models
      .predict("a403429f2ddf4b49b307e318f00e528b", this.state.input)
      .then((response) => {
        if (response) {
          // error because we haven't set up the back end yet !
          //   fetch("http://localhost:3000/image", {
          //     method: "put",
          //     headers: { "Content-Type": "application/json" },
          //     body: JSON.stringify({
          //       id: this.state.user.id,
          //     }),
          //   })
          //     .then((response) => response.json())
          //     .then((count) => {
          //       this.setState(Object.assign(this.state.user, { entries: count }));
          //     });
          console.log("success", response);
        }
        this.displayFaceBox(this.calculateFacesLocation(response));

        console.log(
          this.calculateFacesLocation(response),
          "what is the result of calculate faces"
        );
      })
      .catch((err) => console.log(err, "what is the error"));
  };

  // onButtonSubmit = () => {
  //   this.setState({ imageUrl: this.state.input });
  //   fetch("http://localhost:3000/imageurl", {
  //     method: "post",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       input: this.state.input,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((response) => {
  //       if (response) {
  //         fetch("http://localhost:3000/image", {
  //           method: "put",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             id: this.state.user.id,
  //           }),
  //         })
  //           .then((response) => response.json())
  //           .then((count) => {
  //             this.setState(Object.assign(this.state.user, { entries: count }));
  //           })
  //           .catch(console.log);
  //       }
  //       this.displayFaceBox(this.calculateFaceLocation(response));
  //     })
  //     .catch((err) => console.log(err));
  // };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, boxes } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
