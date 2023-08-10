import {
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, useRef, useState } from "react";
import axios from "axios";
import "./Chat.css";
import SendIcon from "@mui/icons-material/Send";

// Prepared questions
// What is the one time fee for pets?
// How long does a typical tour of the property take?
// Can I bring someone with me during the tour?
// What are the security measures taken by the property?
// What are the property office's working hours?
// Is the property managed by an on-site management team or a third-party management company?
// What is the total number of units on the property?
// What is the property's address and contact information?
// What are the nearby attractions in the neighborhood?
// Can multiple applicants apply together for a single unit?
// Can applicants check the status of their application during the review process?
// How long does an application take to approve?
// What information and documents are required as part of the application?
// How can I fill the application form?
// What is the application fee?
// What is the process for submitting a rental application?
// What are the towing policies or consequences for unauthorized parking?
// What is the allocated vehicle limit per unit?
// Is street parking available near the property for residents and visitors?
// Are there designated parking areas for motorcycles or bicycles?
// What kind of parking does your property offer?
// Can residents request additional parking spaces if needed?
// Are there reserved parking spots for residents?
// Is there on-site parking available for guests?
// Does the property offer a valet parking service?
// Does the property organize any pet-friendly events?
// Are there any special accommodations for residents with service animals?
// Are residents required to show proof of pet vaccinations or licenses?
// What are the regulations for pet owners to follow?
// What pet amenities are available in the community?
// What is the monthly fee for pets?"
// What is the weight limit for pets?
// What types of pets are allowed ?
// How many pets are allowed per unit?
// What are the apartment features offered at the property?
// What are the amenities offered at the property?

export default function Chat() {
  const ENTER_KEY_CODE = 13;

  const scrollBottomRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");

  const sendFAQs = (message) => {
    axios
      .post("https://ws-qa.hyly.us:5000/", {
        message,
        propertyId: "1515103520797991461",
      })
      .then((res) => {
        updateLastMessage(res.data.response);
      });
  };

  const updateLastMessage = (message) => {
    setChatMessages((prev) => [
      ...prev,
      {
        user: "Hayley_v2",
        message,
      },
    ]);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleEnterKey = (event) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (message) {
      console.log("Send!");
      sendFAQs(message);

      setChatMessages([
        ...chatMessages,
        {
          user: "User",
          message: message,
        },
      ]);

      setMessage("");
    }
  };

  const listChatMessages = chatMessages.map((chatMessage, index) => (
    <ListItem key={index}>
      <ListItemText primary={`${chatMessage.user}: ${chatMessage.message}`} />
    </ListItem>
  ));

  return (
    <Fragment>
      <Container>
        <Paper elevation={5}>
          <Box p={3}>
            <Typography variant="h4" gutterBottom>
              GuessCard test
            </Typography>
            <Divider />
            <Grid container spacing={4} alignItems="center">
              <Grid id="chat-window" xs={12} item>
                <List id="chat-window-messages">
                  {listChatMessages}
                  <ListItem ref={scrollBottomRef}></ListItem>
                </List>
              </Grid>
              <Grid xs={11} item>
                <FormControl fullWidth>
                  <TextField
                    onChange={handleMessageChange}
                    onKeyDown={handleEnterKey}
                    value={message}
                    label="Type your message..."
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              <Grid xs={1} item>
                <IconButton
                  onClick={sendMessage}
                  aria-label="send"
                  color="primary"
                >
                  <SendIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Fragment>
  );
}
