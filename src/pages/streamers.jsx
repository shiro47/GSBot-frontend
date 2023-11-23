import React, { useState, useRef} from 'react';
import { Container, InputGroup, FormControl, Button, Form, Modal, Alert } from 'react-bootstrap';
import StreamerCard from '../components/streamerCard';
import { Search } from 'react-bootstrap-icons';
import { useCookies } from 'react-cookie';

const Streamers = () => {
  const [cookies] = useCookies(['discordServerId', 'discordToken']);
  const [searchTerm, setSearchTerm] = useState('');
  const [show, setShow] = useState(false);
  const [selectedOption, setSelectedOption] = useState('oneStreamer');
  const [alertVariant, setAlertVariant] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const formRef = useRef(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleOptionChange = (event) => setSelectedOption(event.target.value);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSend = async () => {
    const formData = new FormData(formRef.current);

    let streamers = [];
    if (selectedOption === 'oneStreamer') {
      const streamerName = formData.get('streamerName');
      if (streamerName) {
        streamers.push(streamerName);
      }
    } else if (selectedOption === 'manyStreamers') {
      const multipleStreamers = formData.get('multipleStreamers');
      if (multipleStreamers) {
        streamers = multipleStreamers.split('\n').map((streamer) => streamer.trim());
      }
    }

    const headers = {
      Authorization: `Bearer ${cookies.discordToken}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(`http://localhost:8000/streamers/${cookies.discordServerId}/add-streamers`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(streamers),
    });

    if (response.ok) {
      setShowAlert(true);
      setAlertVariant('success');
      setAlertMessage('Streamer added successfully.');
      window.location.reload();
    } else {
      setAlertVariant('danger');
      setAlertMessage('Something went wrong. Streamer could not be added.');
    }

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    handleClose();
  };

  return (
    <>
      <Alert variant={alertVariant} className='custom-alert' show={showAlert} onClose={() => setShowAlert(false)} dismissible>
        {alertMessage}
      </Alert>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add streamer to database</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form ref={formRef}>
            <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
              <Form.Label>Streamers</Form.Label>
              <div>
                <Form.Check
                  type='radio'
                  id='oneStreamer'
                  name='streamerOption'
                  value='oneStreamer'
                  checked={selectedOption === 'oneStreamer'}
                  onChange={handleOptionChange}
                  label='One streamer'
                />
                <Form.Check
                  type='radio'
                  id='manyStreamers'
                  name='streamerOption'
                  value='manyStreamers'
                  checked={selectedOption === 'manyStreamers'}
                  onChange={handleOptionChange}
                  label='Many streamers'
                />
              </div>
              {selectedOption === 'oneStreamer' ? (
                <Form.Control type='text' name='streamerName' placeholder='Enter streamer name' />
              ) : (
                <Form.Control as='textarea' name='multipleStreamers' rows={3} placeholder='Enter multiple streamers' />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary' onClick={handleSend}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Container fluid className='bg-transparent vh-100'>
        <Container>
          <InputGroup className='mb-3'>
            <FormControl
              placeholder='Search streamers...'
              value={searchTerm}
              onChange={handleSearch}
              aria-label='Search streamers'
              aria-describedby='search-addon'
            />
            <InputGroup.Text id='search-addon'>
              <Search />
            </InputGroup.Text>
            <Button variant='info' style={{ marginLeft: '10px' }} onClick={handleShow}>
              Add Streamer
            </Button>
          </InputGroup>
        </Container>
        <Container className='card-container'>
          <div className='scrollable-card-group'>
              <StreamerCard searchTerm={searchTerm} />
          </div>
        </Container>
      </Container>
    </>
  );
};

export default Streamers;
