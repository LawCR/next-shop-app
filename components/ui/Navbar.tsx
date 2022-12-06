import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material"
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { UIContext, CartContext } from '../../context';

export const Navbar = () => {

    const {asPath, push} = useRouter()
    const category =  asPath.split('/')[1] === 'category' ? asPath.split('/')[2] : ''

    const {toogleSideMenu} = useContext(UIContext)
    const {numberOfItems} = useContext(CartContext)

    const [searchTerm, setSearchTerm] = useState('')
    const [isSearchVisible, setIsSearchVisible] = useState(false)

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return
        push(`/search/${searchTerm}`)
    }
    
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


                <Box sx={{ display: isSearchVisible ? 'none' : {xs: 'none', sm: 'block'}}} className='fadeIn'>
                    <NextLink href='/category/men' passHref>
                        <Link>
                            <Button color={`${category === 'men' ? 'primary': 'info'}`}>Hombres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/women' passHref>
                        <Link>
                            <Button color={`${category === 'women' ? 'primary': 'info'}`}>Mujeres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/kid' passHref>
                        <Link>
                            <Button color={`${category === 'kid' ? 'primary': 'info'}`}>Niños</Button>
                        </Link>
                    </NextLink>
                </Box>

                <Box flex={1} />

                {/* Search para pantallas grandes */}
                {
                    isSearchVisible
                        ? (
                            <Input
                                sx={{ display: {xs: 'none', sm: 'flex'}}}
                                className='fadeIn'
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() : null}
                                type='text'
                                placeholder="Buscar..."
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setIsSearchVisible(false)}
                                        >
                                            <ClearOutlined />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        )
                        : 
                        ( 
                            <IconButton
                                className='fadeIn'
                                onClick={() => setIsSearchVisible(true)}
                                sx={{ display: {xs: 'none', sm: 'flex'}}}
                            >
                                <SearchOutlined />
                            </IconButton>
                        )
                }

                {/* Search para Pantallas pequeñas */}
                <IconButton
                    sx={{display: {xs: 'flex', sm: 'none'}}}
                    onClick={toogleSideMenu}
                >
                    <SearchOutlined />
                </IconButton>
                
                <NextLink href='/cart' passHref>
                    <Link>
                        <IconButton>
                            <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color="secondary" >
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>
                <Button onClick={toogleSideMenu}>
                    Menú
                </Button>
            </Toolbar>
        </AppBar>
    )
}

