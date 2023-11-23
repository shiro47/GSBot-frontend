import React, { useState, useRef, useEffect } from 'react';
import { Container, InputGroup, FormControl, Button, Form, Modal, FormLabel} from 'react-bootstrap';
import ApexCard from '../components/apexCard';
import { Search } from 'react-bootstrap-icons';
import { useCookies } from 'react-cookie';

const ApexDB = () => {
  const [cookies] = useCookies(['discordServerId', 'discordToken']);
  const [searchTerm, setSearchTerm] = useState('');
  const [show, setShow] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
     // Set loading state to true
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSend = async () => {
    const formData = new FormData(formRef.current);

    const playerName = formData.get('playerName');
    const DiscordID = formData.get('discordID');
    const platform = formData.get('platform');
    const requestBody = {
      playerName: playerName,
      discordID: parseInt(DiscordID),
      platform: platform,
    };
    const headers = {
      Authorization: `Bearer ${cookies.discordToken}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(`http://localhost:8000/apex_db/${cookies.discordServerId}/add-player`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(requestBody),
    })
      if (response.ok) {
        window.location.reload()
      };}


    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add player to database</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form ref={formRef}>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Player</Form.Label>
                <Form.Control type="text" name="playerName" placeholder="Enter origin player name" />
                <FormLabel>Discord ID</FormLabel>
                <Form.Control type="number" name="discordID" placeholder="Enter discord id" />
                <Form.Label>Choose platform:</Form.Label>
                <Form.Select name="platform" aria-label="Default select example">
                <option value="PC">PC</option>
                <option value="X1">XBOX</option>
                <option value="PS4">Playstation</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSend}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Container fluid className="bg-transparent vh-100">
          <Container>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search players..."
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search players"
                aria-describedby="search-addon"
              />
              <InputGroup.Text id="search-addon">
                <Search />
              </InputGroup.Text>
              <Button variant='info' style={{ marginLeft: "10px" }} onClick={handleShow}>Add Player</Button>
            </InputGroup>
          </Container>
          <Container className="card-container">
            <div className="scrollable-card-group">
                <ApexCard searchTerm={searchTerm} />
            </div>
          </Container>
        </Container>
      </>
    );
  };
  export default ApexDB;