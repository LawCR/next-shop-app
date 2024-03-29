import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material"
import NextLink from "next/link"
import { useContext } from "react"
import { UIContext } from '../../context';

export const AdminNavbar = () => {
    const {toogleSideMenu} = useContext(UIContext)
    
    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref>
                    <Link display='flex' alignItems='center' >
                        <Typography variant='h6'>Teslo |</Typography>
                        <Typography sx={{ml: 0.5}}>Shop</Typography>
                    </Link>
                </NextLink>
                
                <Box flex={1} />
                
                <Button onClick={toogleSideMenu}>
                    Menú
                </Button>
            </Toolbar>
        </AppBar>
    )
}

