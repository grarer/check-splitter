import { Dialog, AppBar, Toolbar, IconButton, Typography, Button, List, ListItemButton, ListItemText, Divider, TextField, Stack } from "@mui/material";
import { VNode } from "preact";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "preact/hooks";
import { getSettings, updateSettings } from "../model/settings";


export function SettingsDialog(props: {open: boolean, onClose: () => void}): VNode {

    const [name, setName] = useState(getSettings().yourName);

    function saveAndClose() {
        updateSettings({yourName: name});
        props.onClose();
    }

    // TODO transition animation
    return <Dialog
    fullScreen
    open={props.open}
    onClose={props.onClose}
  >
    <AppBar sx={{ position: 'relative' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={props.onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
          Settings
        </Typography>
        <Button autoFocus color="inherit" onClick={saveAndClose}>
          save
        </Button>
      </Toolbar>
    </AppBar>
    <Stack direction="column" style={{padding: "20px", marginTop: "10px"}}>
        <TextField
            style={{ maxWidth: "6in", margin: "auto" }}
            label="Your Name"
            value={name}
            onChange={(event) => setName((event.target as HTMLInputElement).value)}
        />
    </Stack>
  </Dialog>
};