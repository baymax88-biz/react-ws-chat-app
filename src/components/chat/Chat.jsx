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
import { Fragment, useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Chat.css";
import SendIcon from "@mui/icons-material/Send";

export default function Chat() {
  const ENTER_KEY_CODE = 13;

  const scrollBottomRef = useRef(null);
  const webSocket = useRef(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const initTrigger = () => {
      axios
        .post("https://ws-qa.hyly.us:5000/", {
          message:
            "I want to move in by September 1st into a 1 BR apartment. What options do you have?",
        })
        .then((res) => {
          updateLastMessage(res.data.response);
        });

      console.log("Opening WebSocket");
      webSocket.current = new WebSocket("wss://ws-qa.hyly.us:9001");

      const openWebSocket = () => {
        webSocket.current.onopen = (event) => {
          console.log("Open:", event);
        };
        webSocket.current.onclose = (event) => {
          console.log("Close:", event);
        };
      };

      openWebSocket();
    };

    initTrigger();

    return () => {
      console.log("Closing WebSocket");
      webSocket.current.close();
    };
  }, []);

  useEffect(() => {
    webSocket.current.onmessage = (event) => {
      const chatMessage = event.data;
      console.log("Message:", chatMessage);
      setChatMessages([
        ...chatMessages,
        {
          user: "Hayley_v2",
          message: chatMessage,
        },
      ]);
      if (scrollBottomRef.current) {
        scrollBottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
  }, [chatMessages]);

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
      webSocket.current.send(message.toString());

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
