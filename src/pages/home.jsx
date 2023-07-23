import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';


const HomePage = () => {
    return (
        <div className="home-page vh-100">
      <Container className="h-100 d-flex justify-content-center align-items-center">
        <Row>
          <Col>
            <h1 className="text-center">Welcome to GSBot</h1>
            <p className="text-center">
              GSBot is a powerful Discord bot that can assist you with various tasks.
            </p>
            <p className="text-center">
              To use GSBot, please contact us on Discord.
            </p>
            <div className="text-center mt-4">
              <Button variant="primary">Join our Discord Server</Button>
            </div>
            <div className="text-center mt-2">
              <small>Don't have Discord? <a href="https://discord.com" target="_blank" rel="noopener noreferrer">Get it here</a></small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
    
    )
  }
  export default HomePage;