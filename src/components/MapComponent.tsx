import React, { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import usBoundaries from "../../public/us_boundary.json";
import cnBoundaries from "../../public/cn_boundary.json";
import ruBoundaries from "../../public/ru_boundary.json";
import braBoundaries from "../../public/bra_boundary.json";
import inBoundaries from "../../public/in_boundary.json";
import jpBoundaries from "../../public/jp_boundary.json";
import { Leader } from "../tpyes";
import { leaderData } from "../utils";
import Accordion from "./Accordion";
import { Configuration, OpenAIApi } from "openai";

interface MessageLog {
  message: string;
  response: string;
}

const configuration = new Configuration({
  organization: "org-7I99Yz2EvJQXM3L3JeCjpgoa",
  apiKey: "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",
});

let conversationHistory: string[] = [];

async function sendMessageToChatGPT(message: string, leader: string) {
  const context =
    "The Xalaxians are an advanced alien race with telepathic abilities, shimmering silver skin, and glowing blue eyes. They possess advanced technology, including interdimensional travel and the ability to harness black hole energy. Unlike humans, they see themselves as stewards of the universe and have no interest in dominating other species, including humans. They recently moved their ship into Earth's orbit, intentionally making it visible to humans in order to make contact. The ship is approximately the size of New Jersey. The Xalaxians seek to help all life on Earth flourish, and news of their presence has quickly spread around the world. People around the globe are anxiously awaiting to see if they will make contact or pose a threat. The people of Earth know absolutely nothing about the aliens. When they do finally decide to make contact, it will be the very first interaction so they should not have any knowledge of anything mentioned previously about the Xalaxians.";

  const prompt =
    context +
    conversationHistory.join("") +
    " The Xalaxian emissary decides to contact " +
    leader +
    " The message reads: " +
    message +
    " Respond as " +
    leader;

  const openai = new OpenAIApi(configuration);
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 2048,
    temperature: 0,
    top_p: 1,
    n: 1,
    stream: false,
    logprobs: null,
  });

  const response = completion.data.choices[0].text;
  if (response) {
    const trimmedResponse = response.substr(response.lastIndexOf(":") + 1);
    conversationHistory.push("Xalaxian emissary: " + message);
    conversationHistory.push(leader + ": " + trimmedResponse);
    return trimmedResponse;
  } else {
    return "";
  }
}
const MapComponent = () => {
  const [water, setWater] = useState(50.0);
  const [waterMax, setWaterMax] = useState(50.0);
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);
  const [leaders, setLeaders] = useState<{ [key: string]: Leader }>(leaderData);
  const [highlightedLeader, setHighlightedLeader] = useState("");
  const [spaceShip, setSpaceShip] = useState<Cesium.Entity | null>(null);
  const [position, setPosition] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messageLog, setMessageLog] = useState<MessageLog[]>([]);
  const chatLogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const start = Cesium.JulianDate.fromDate(new Date());
    // Create the Cesium Viewer
    const cesiumViewer = new Cesium.Viewer("cesiumContainer", {
      shouldAnimate: true, // Enable animations
      shadows: true,
      terrain: Cesium.Terrain.fromWorldTerrain(),
    });
    cesiumViewer.scene.globe.enableLighting = true;

    //Make sure viewer is at the desired time.
    cesiumViewer.clock.startTime = start.clone();
    cesiumViewer.clock.currentTime = start.clone();

    const url = "./SpaceShip1.gltf";

    const position = Cesium.Cartesian3.fromDegrees(
      -74.006,
      40.7128,
      50000000.0
    );
    const heading = Cesium.Math.toRadians(270);
    const pitch = 0;
    const roll = 0;
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      hpr
    );
    const entity = cesiumViewer.entities.add({
      name: url,
      position: position,
      orientation: orientation,
      model: {
        color: Cesium.Color["DARKSLATEGREY"],
        uri: url,
      },
    });
    setSpaceShip(entity);
    // Zoom to the bounding sphere of the entity
    cesiumViewer.trackedEntity = entity;

    setViewer(cesiumViewer);

    // Clean up when the component unmounts
    return () => {
      cesiumViewer.destroy();
    };
  }, []);

  useEffect(() => {
    if (viewer) {
      viewer.dataSources.removeAll();
      if (highlightedLeader === "President of the United States") {
        viewer.dataSources.add(getDataSource(usBoundaries));
      } else if (highlightedLeader === "President of China") {
        viewer.dataSources.add(getDataSource(cnBoundaries));
      } else if (highlightedLeader === "President of Russia") {
        viewer.dataSources.add(getDataSource(ruBoundaries));
      } else if (highlightedLeader === "President of Brazil") {
        viewer.dataSources.add(getDataSource(braBoundaries));
      } else if (highlightedLeader === "Prime Minister of India") {
        viewer.dataSources.add(getDataSource(inBoundaries));
      } else if (highlightedLeader === "Prime Minister of Japan") {
        viewer.dataSources.add(getDataSource(jpBoundaries));
      }
    }
  }, [highlightedLeader, viewer]);

  useEffect(() => {
    if (viewer && viewer.clock) {
      let lastTickTime = viewer.clock.currentTime.secondsOfDay;
      const intervalId = viewer.clock.onTick.addEventListener(() => {
        if (!viewer.clock.shouldAnimate) {
          return;
        }
        const currentTickTime = viewer.clock.currentTime.secondsOfDay;
        const elapsedSeconds = currentTickTime - lastTickTime;
        if (elapsedSeconds >= 1) {
          setWater((prevWater) => prevWater - 0.05);
          lastTickTime = currentTickTime;
        }
        if (viewer.clock.multiplier > 10) {
          viewer.clock.multiplier = 10;
        }
      });

      return () => {
        if (viewer && viewer.clock) {
          viewer.clock.onTick.removeEventListener(intervalId);
        }
      };
    }
  }, [viewer]);

  useEffect(() => {
    if (position && viewer) {
      viewer.trackedEntity = undefined;
      viewer.camera.flyTo({
        destination: position,
        orientation: {
          pitch: Cesium.Math.toRadians(-90),
        },
      });
    } else if (viewer && spaceShip && !position) {
      viewer.trackedEntity = spaceShip;
      const destination = Cesium.Cartesian3.fromDegrees(
        -74.006,
        40.7128,
        50100000.0
      );
      const heading = Cesium.Math.toRadians(270);
      const pitch = 0;
      const roll = 0;
      const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(
        destination,
        hpr
      );
      viewer.camera.flyTo({
        destination,
        orientation,
      });
    }
  }, [position, spaceShip, viewer]);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messageLog]);
  function handleButtonClick() {
    setShowModal(true);
    setMessage("");
    setMessageLog([]);
  }
  function handleSendMessage(highlightedLeader: string) {
    if (message) {
      setMessageLog([
        ...messageLog,
        {
          message: message,
          response: "....",
        },
      ]);
      setMessage("");
      sendMessageToChatGPT(message, highlightedLeader)
        .then((response) => {
          if (response) {
            // Display response in a new dialog box
            setMessageLog([
              ...messageLog,
              {
                message,
                response,
              },
            ]);
          }
        })
        .catch((error) => {
          // Handle error here
          console.error(error);
        });
    }
  }
  return (
    <div style={{ position: "relative" }}>
      <div
        id="cesiumContainer"
        style={{ width: "100%", height: "100vh" }}
      ></div>

      <Card
        className="bg-dark text-light"
        style={{ position: "absolute", left: 5, top: 5 }}
      >
        <Card.Body>
          <Row>
            <Col>
              <strong>Resource</strong>
            </Col>
            <Col>
              <strong>Storage</strong>
            </Col>
            <Col>
              <strong>Max</strong>
            </Col>
          </Row>
          <Row className="text-end">
            <Col style={{ color: "lightblue" }}>Water</Col>
            <Col
              style={{
                color: `${
                  water < 10 ? "red" : water < 25 ? "yellow" : "white"
                }`,
              }}
            >
              {water.toFixed(2)} t
            </Col>
            <Col>{waterMax} t</Col>
          </Row>
        </Card.Body>
      </Card>
      <Card
        className="bg-dark text-light"
        style={{
          position: "fixed",
          left: 5,
          top: 100,
          maxHeight: window.innerHeight - 300 + "px",
          overflowY: "scroll",
        }}
      >
        {Object.entries(leaders).map(([role, leader], index) => (
          <Accordion
            key={index}
            title={role}
            content={
              <>
                <Card.Body>
                  <p>{leader.name}</p>
                  <Button onClick={handleButtonClick}>Make Contact</Button>
                </Card.Body>
              </>
            }
            leader={leader}
            setHighlightedLeader={setHighlightedLeader}
            highlightedLeader={highlightedLeader}
            setPosition={setPosition}
          />
        ))}
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Send Message</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <div style={{ maxHeight: 400, overflowY: "scroll" }} ref={chatLogRef}>
            {messageLog.map((item, index) => (
              <div key={index}>
                <p>You: {item.message}</p>
                <p>
                  {leaders[highlightedLeader]?.name}: {item.response}
                </p>
              </div>
            ))}
          </div>
          <Form className="bg-dark text-light">
            <Form.Group controlId="message">
              <Form.Label>Message</Form.Label>
              <Form.Control
                className="bg-dark text-light"
                as="textarea"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-dark text-light">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSendMessage(leaders[highlightedLeader]?.name)}
          >
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const getDataSource = (json) => {
  const dataSource = new Cesium.GeoJsonDataSource("boundaries");
  dataSource.load(json, {
    stroke: Cesium.Color.WHITE,
    fill: Cesium.Color.TRANSPARENT,
  });
  return dataSource;
};

export default MapComponent;
