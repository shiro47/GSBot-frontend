import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, CardGroup } from 'react-bootstrap';
import { useCookies } from 'react-cookie';

const StreamerCard = ({ searchTerm }) => {
  const [cookies] = useCookies(['discordServerId', 'discordToken']);
  const [streamers, setStreamers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStreamers = async () => {
      setIsLoading(true);
      const headers = {
        Authorization: `Bearer ${cookies.discordToken}`,
      };
      const response = await fetch(`http://localhost:8000/streamers/${cookies.discordServerId}`, { headers });
      const streamersData = await response.json();
      setStreamers(streamersData);
      setIsLoading(false); // Set isLoading to false when data is fetched
    };
    fetchStreamers();
  }, [cookies]);

  const removeStreamer = async (streamer_name) => {
    const headers = {
      Authorization: `Bearer ${cookies.discordToken}`,
    };
    const response = await fetch(`http://localhost:8000/streamers/${cookies.discordServerId}/${streamer_name}`, {
      method: 'DELETE',
      headers,
    });
    if (response.ok) {
      setAlertVariant('success');
      setAlertMessage('Streamer deleted successfully.');
      setShowAlert(true);
      setStreamers((prevStreamers) =>
        prevStreamers.filter((streamer) => streamer.streamer_name !== streamer_name)
      );
    } else {
      setAlertVariant('danger');
      setAlertMessage('Failed to delete streamer.');
      setShowAlert(false);
    }
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const filteredStreamers = streamers.filter((streamer) =>
    streamer.display_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {isLoading ? ( // Display spinner while loading
        <div className='d-flex justify-content-center align-items-center w-100'>
          <Spinner animation='border' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </Spinner>
        </div>
      ) : (
        <CardGroup>
          <Container>
            <Row className='gx-4 gy-4'>
              {filteredStreamers.map((streamer) => (
                <Col key={streamer.streamer_name} xs={12} sm={6} md={4} lg={3}>
                  <Card className='custom-card h-100 d-flex flex-column'>
                    <a
                      href={`https://www.twitch.tv/${streamer.streamer_name}`}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Card.Img variant='top' src={`${streamer.avatar}`} />
                    </a>
                    <Card.Body className='d-flex flex-column'>
                      <Card.Title>{streamer.display_name}</Card.Title>
                      <Button
                        variant='danger'
                        className='mt-auto'
                        onClick={() => removeStreamer(streamer.streamer_name)}
                      >
                        Delete
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            {showAlert && (
              <Alert
                variant={alertVariant}
                onClose={() => setShowAlert(false)}
                dismissible
                className='custom-alert'
              >
                {alertMessage}
              </Alert>
            )}
          </Container>
        </CardGroup>
      )}
    </>
  );
};

export default StreamerCard;
