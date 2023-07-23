import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, CardGroup } from 'react-bootstrap';
import { useCookies } from 'react-cookie';

const ApexCard = ({ searchTerm }) => {
  const [cookies] = useCookies(['discordServerId', 'discordToken']);
  const [players, setPlayers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      const headers = {
        Authorization: `Bearer ${cookies.discordToken}`,
      };
      const response = await fetch(`http://localhost:8000/apex_db/${cookies.discordServerId}`, { headers });
      const playersData = await response.json();
      setPlayers(playersData);
      setIsLoading(false);
    };
    fetchPlayers();
  }, [cookies]);

  const removePlayer = async (player_name) => {
    const headers = {
      Authorization: `Bearer ${cookies.discordToken}`,
    };
    const response = await fetch(`http://localhost:8000/apex_db/${cookies.discordServerId}/${player_name}`, {
      method: 'DELETE',
      headers,
    });
    if (response.ok) {
      setAlertVariant('success');
      setAlertMessage('Player deleted successfully.');
      setShowAlert(true);
      setPlayers((prevPlayer) =>
        prevPlayer.filter((player) => player.ID !== player_name)
      );
    } else {
      setAlertVariant('danger');
      setAlertMessage('Failed to delete player.');
      setShowAlert(true);
    }
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const filteredPlayers = players.filter((player) =>
    player.display_name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Row className="gx-4 gy-4">
          {filteredPlayers.map((player) => (
            <Col key={player.DiscordID} xs={12} sm={6} md={4} lg={3}>
              <Card className="custom-card h-100 d-flex flex-column">
                <Card.Img variant="top" src={`https://cdn.discordapp.com/avatars/${player.DiscordID}/${player.avatar}`} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{player.display_name}</Card.Title>
                  <Card.Text>{player.ID}</Card.Text>
                  <Button
                    variant="danger"
                    className="mt-auto"
                    onClick={() => removePlayer(player.ID)}
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
            className="custom-alert"
          >
            {alertMessage}
          </Alert>
        )}
      </Container>
    </CardGroup>)}
    </>
  );
};

export default ApexCard;
