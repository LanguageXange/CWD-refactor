import React, { useState, useEffect } from "react";
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
  apiKey: "XXXX",
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

function App2() {
  const [originalState, setOriginalState] = useState(initialState);
  const [input, setInput] = useState(initialState.input);
  const [route, setRoute] = useState(initialState.route);
  const [boxes, setBoxes] = useState(initialState.boxes);
  const [isSignedIn, setIsSignedIn] = useState(initialState.isSignedIn);
  const [user, setUser] = useState(initialState.user);
  // setOriginalState({imageURL:"..."}) will trigger rerender
  const [imageUrl, setImageUrl] = useState(initialState.imageUrl);

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  };
  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const displayFaceBox = (boxes) => {
    setBoxes(boxes);
  };

  const calculateFacesLocation = (data) => {
    // detect multiple faces
    const faces = data.outputs[0].data.regions;
    const facesResult = [];
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
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

  const onRouteChange = (route) => {
    console.log(route);
    if (route === "signout") {
      setOriginalState(initialState);
    } else if (route === "home") {
      setIsSignedIn(true);
    }
    setRoute(route);
  };

  const onButtonSubmit = () => {
    setImageUrl(input);
    console.log(originalState);
    app.models
      .predict("a403429f2ddf4b49b307e318f00e528b", input)
      .then((response) => {
        if (response) {
          console.log("success", response);
        }
        displayFaceBox(calculateFacesLocation(response));
      })
      .catch((err) => console.log(err, "what is the error"));
  };
  return (
    <div className="App">
      <Particles className="particles" params={particlesOptions} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === "home" ? (
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
        </div>
      ) : route === "signin" ? (
        <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
      ) : (
        <Register loadUser={loadUser} onRouteChange={onRouteChange} />
      )}
    </div>
  );
}

export default App2;
