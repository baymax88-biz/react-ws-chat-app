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
