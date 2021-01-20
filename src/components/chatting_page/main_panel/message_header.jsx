import React from "react";
import styles from "./message_header.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Image from "react-bootstrap/Image";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
const MessageHeader = ({ handleSearchChange }) => (
  <div className={styles.messageHeader}>
    <Container>
      <Row className={styles.row1}>
        <Col className={styles.tr1td1}>
          <i className="fas fa-unlock"></i>
          <div className={styles.chattingRoomName}>Chatting room name</div>
          <i className="fas fa-crown"></i>
        </Col>
        <Col className={styles.tr1td2}>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">
                <i className="fas fa-search"></i>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              onChange={handleSearchChange}
              placeholder="Search Messages"
              aria-label="Search"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </Col>
      </Row>
      <div className={styles.userName}>
        <div>
          <Image src="" />
          userName
        </div>
      </div>
      <Row>
        <Col>
          <Accordion>
            <Card>
              <Card.Header style={{ padding: " 0 1rem" }}>
                <Accordion.Toggle
                  as={Button}
                  variant="link"
                  eventKey="0"
                  style={{
                    background: "none",
                    color: "#000000",
                    fontSize: "14px",
                  }}
                >
                  Description
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>Hello! I'm the body</Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Col>
        <Col>
          <Accordion>
            <Card>
              <Card.Header style={{ padding: " 0 1rem" }}>
                <Accordion.Toggle
                  as={Button}
                  variant="link"
                  eventKey="0"
                  style={{
                    background: "none",
                    color: "#000000",
                    fontSize: "14px",
                  }}
                >
                  Post counts
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>Hello! I'm the body</Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Col>
      </Row>
    </Container>
  </div>
);

export default MessageHeader;
