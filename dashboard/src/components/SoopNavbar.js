import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { AiFillSetting } from "react-icons/ai";

const SoopNavbar = () => {
  const [state, setState] = useState({
    left: false,
  });

  const muiTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "rgba(255, 255, 255, 1)",
        contrastText: "#737373",
      },
    },
  });

  const toggleDrawer = (anchor, isOpen) => event => {
    console.log("toggleDrawer 호출", isOpen);
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setState({ ...state, [anchor]: isOpen });
  };

  const sideBar = anchor => {
    console.log(anchor);
    return (
      <Box
        sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  return (
    <>
      <ThemeProvider theme={muiTheme}>
        <AppBar position="static" sx={{ mb: 2, boxShadow: "rgba(149, 157, 165, 0.2) 0px 3px 10px" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer("left", true)}
            >
              <RiMenuUnfoldFill />
            </IconButton>
            <Drawer anchor={"left"} open={state["left"]} onClose={toggleDrawer("left", false)}>
              {sideBar("left")}
            </Drawer>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: "Pretendard-Bold" }}>
              대시보드 이름이에요
            </Typography>
            {/* TODO: onClick => Drag n Drop 시작 */}
            <IconButton color="inherit">
              <AiFillSetting />
            </IconButton>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </>
  );
};

export default SoopNavbar;
