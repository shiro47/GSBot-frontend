import React, { useContext } from 'react';
import { Container, Nav, Navbar, NavDropdown, Button, Figure } from 'react-bootstrap';
import AuthContext from './AuthContext';
import { useCookies } from 'react-cookie';

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [cookies, removeCookie] = useCookies([
    'discordToken',
    'discordRefreshToken',
    'discordServerId',
    'discordServerIcon',
    'discordServerName',
  ]);

  const handleLogout = (event) => {
    event.preventDefault();
    removeCookie('discordToken', { path: '/' });
    removeCookie('discordRefreshToken', { path: '/' });
    removeCookie('discordServerId');
    removeCookie('discordServerIcon');
    removeCookie('discordServerName');
    setIsLoggedIn(false);
    window.location.href = 'http://localhost:3000/';
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">GSBot</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn && (
              <>
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                <NavDropdown title="Databases" id="collasible-nav-dropdown" menuVariant="dark">
                  <NavDropdown.Item href="/streamers">Streamers</NavDropdown.Item>
                  <NavDropdown.Item href="/apexDB">Apex players</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>

          {isLoggedIn ? (
            <Nav>
              {isLoggedIn && cookies.discordServerId !== "undefined" && cookies.discordServerIcon !== "undefined" && (
                <NavDropdown
                  title={
                    <>
                      <Figure>
                        <Figure.Image
                          width={25}
                          height={25}
                          alt="Discord Server Icon"
                          src={`https://cdn.discordapp.com/icons/${cookies.discordServerId}/${cookies.discordServerIcon}.png`}
                          roundedCircle
                          style={{ marginRight: '0.5rem' }}
                        />
                        {cookies.discordServerName}
                      </Figure>
                    </>
                  }
                  id="collasible-nav-dropdown"
                  menuVariant="dark"
                  align="end"
                >
                  <NavDropdown.Item href="/login">Change Server</NavDropdown.Item>
                </NavDropdown>
              )}


              <Nav.Link eventKey={2} href="/login">
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link eventKey={2} href="/login">
                <Button variant="outline-light">Login</Button>
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
