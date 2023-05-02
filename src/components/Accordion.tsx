import { Leader } from "@/tpyes";
import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Image from "next/image";
import * as Cesium from "cesium";

const Accordion = ({
  title,
  content,
  leader,
  setHighlightedLeader,
  highlightedLeader,
  setPosition,
}: {
  title: string;
  content: JSX.Element;
  leader: Leader;
  setHighlightedLeader: Function;
  highlightedLeader: string;
  setPosition: Function;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    if (title !== highlightedLeader && isExpanded) {
      setIsExpanded(false);
    }
  }, [highlightedLeader, isExpanded, title]);

  function toggleAccordion() {
    setIsExpanded((prev) => {
      if (prev) {
        setHighlightedLeader("");
        setPosition(null);
      } else {
        setHighlightedLeader(title);
        setPosition(
          Cesium.Cartesian3.fromDegrees(
            leader.longitude,
            leader.latitude,
            20000000.0
          )
        );
      }
      return !prev;
    });
  }

  return (
    <>
      <Card.Header
        className="bg-dark text-light"
        onClick={toggleAccordion}
        style={{ cursor: "pointer" }}
      >
        <Row>
          <Col className="col-9">{title}</Col>
          <Col className="float-right">
            <Image src={leader.flag} alt="" width={56} height={42} />
          </Col>
        </Row>
      </Card.Header>
      {isExpanded && (
        <Card.Body className="bg-dark text-light">{content}</Card.Body>
      )}
    </>
  );
};

export default Accordion;
