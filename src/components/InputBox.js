import React, { useRef, useState } from 'react'
import { Grid, TextField, Button, CardContent, Typography, makeStyles } from '@material-ui/core';
import '../css/InputBox.css'
import { DataGrid } from './DataGrid';

const useStyles = makeStyles({
    input: {
        color: "white"
    }
});

export function InputBox() {
    const [clicked, setClicked] = useState(false);

    const classes = useStyles();
    const valueRef = useRef('')

    const sendValue = () => {
        let elem = document.getElementById('Mint');
        elem.style.display = 'none';
        setClicked(true)
    }

    function keyPress(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    }

    return (
        <>
            <div className="Mint" id="Mint">
                <Typography gutterBottom variant="h3" align="center">
                </Typography>
                <Grid>
                    <CardContent>
                        <form noValidate autoComplete='off'>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <TextField type="Mint" placeholder="Enter mint address" label="Mint" variant="outlined"
                                        fullWidth inputProps={{ className: classes.input }} onKeyDown={keyPress}
                                        inputRef={valueRef}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="button" variant="contained" color="primary" fullWidth onClick={sendValue}>Submit</Button>
                                </Grid>

                            </Grid>
                        </form>
                    </CardContent>
                </Grid>
            </div>

            <div>
                {clicked && 
                    <DataGrid mint={valueRef.current.value}/>
                }
            </div>
        </>

    )
}

export default InputBox;