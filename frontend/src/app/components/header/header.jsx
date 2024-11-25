import React from 'react';

import { HeaderBar, Container } from './items.jsx';
import { useLoading } from '../../contexts/loading_context.js';
import { colorData } from '../color.data.js';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function Header({ children }) {
    const { loading, setLoading } = useLoading();

    if (loading) console.log("loading");
    const theme = createTheme({
        palette: {
            primary: {
                main: `${colorData.quinary}`, // Utilisez la couleur que vous voulez
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <HeaderBar>
                    {children}
                </HeaderBar>
                {loading &&
                    <>
                        <LinearDeterminate />
                    </>
                }
            </Container>
        </ThemeProvider>
    );
}

function LinearDeterminate() {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(timer);
                    return 100;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 50);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgress
                variant="determinate"
                value={progress}
                color='primary' 
                style={{zIndex: '999', position: 'absolute', top:'0', width: '100vw', background: `${colorData.primary}`}}/>
        </Box>
    );
}