import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Figure, Spinner } from 'react-bootstrap';
import { useCookies } from 'react-cookie';

const ServerList = () => {
  const [cookies, setCookie] = useCookies(['discordToken', 'discordRefreshToken']);
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true); // Add the loading state

  useEffect(() => {
    const fetchServers = async () => {
      const headers = {
        Authorization: `Bearer ${cookies.discordToken}`,
      };
      const response = await fetch(`http://localhost:8000/servers`, { headers });
      const serversData = await response.json();
      setServers(serversData);
      setLoading(false); // Set loading to false when the data is fetched
    };
    fetchServers();
  }, [cookies]);

  const handleItemClick = (serverId, serverIcon, serverName) => {
    setCookie('discordServerId', serverId, { path: '/' });
    setCookie('discordServerIcon', serverIcon, { path: '/' });
    setCookie('discordServerName', serverName, { path: '/' });
    window.location.href = 'http://localhost:3000/dashboard';
  };

  return (
    <section className="vh-100 gradient-custom">
      <Container className="py-5 h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col xs={12} md={8} lg={6} xl={5}>
            <Card className="bg-dark text-white" style={{ borderRadius: "1rem", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
              <Card.Body className="p-5 text-center">
                <h2 className="fw-bold mb-4 text-uppercase" style={{ fontSize: "2rem" }}>SELECT SERVER</h2>
                <div className="mb-md-5 mt-md-4 pb-5" style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {loading ? ( // Display the spinner while loading is true
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : (
                    <ListGroup as="ol" numbered>
                      {servers.map((server) => (
                        <ListGroup.Item
                          key={server.id}
                          as="li"
                          className="d-flex justify-content-between align-items-start"
                          onClick={() => handleItemClick(server.id, server.icon, server.name)}
                        >
                          <div className="ms-2 me-auto">
                            <div className="fw-bold">{server.name}</div>
                            {server.id}
                          </div>
                          <Figure>
                            <Figure.Image
                              width={60}
                              height={80}
                              alt="Server Image"
                              src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`}
                              roundedCircle
                            />
                          </Figure>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ServerList;
