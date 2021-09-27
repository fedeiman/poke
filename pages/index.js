import React, {useState, useEffect} from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import styles from '../styles/Home.module.css'
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';

const Item = styled(Card)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

//implementacion de pokedex simple

    export default function BasicGrid() {

        const [pokemons,setPokemons] = useState([])
        const [selectedPokemons,setSelectedPokemons] = useState()
        const [filter,setFilter] = useState([])
        const [search, setSearch] = useState("")
        const [offset,setOffset] = useState(0)
        const [detail,setDetail] = useState(false)


        useEffect(() => {
            fetch(`https://pokeapi.co/api/v2/pokemon?limit=200&offset=${offset}`)
                .then(response => response.json())
                .then(allpokemon => {
                    setPokemons(allpokemon.results)
                    setFilter(allpokemon.results)
                })
        },[offset])
        
        useEffect(() => {
            if(search === ""){
                setFilter(pokemons)
            }
            else{
                setFilter(pokemons.filter(poke => poke.name.includes(search)))
                
            }
        },[search])

        const nextPage = () => {
            setOffset(prevState=>prevState + 200)
            setSearch("")
            window.scrollTo(0, 0);
        }
        const PrevPage = () => {
            setOffset(prevState=>prevState - 200)
            setSearch("")
            window.scrollTo(0, 0);
        }

        const onChange = (event) => {
            setSearch(event.target.value)
        }

        const showDetail = (id) => {
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                .then(response => response.json())
                .then(allpokemon => setSelectedPokemons(allpokemon))
            setDetail(true)
        }
        const backFunction = () => {
            setDetail(false)
            setSelectedPokemons(undefined)
        }

    return (
        <>
        {!detail ? 
        <div>
            <div className={styles.search}>
                <input type="search" placeholder="buscar pokemon.." value={search} onChange={(event)=>onChange(event)}/>
            </div>
            <Box sx={{ flexGrow: 1 }} className={styles.box}>
                <Grid container spacing={2}> 
                {filter && filter.map((item,index)=>
                    <Grid item xs={3} key={index}>
                            <Item className={styles.box}
                                onClick={()=>showDetail(item.name)}
                            >
                                {item.name}<br/>
                                {offset + index + 1}
                            </Item>
                    </Grid>
                )
                }
                </Grid>
            </Box>
            <div className={styles.buttons}>
                <div className={styles.PrevButton}>
                    <button disabled={offset === 0} onClick={()=>PrevPage()}>Anterior</button>
                </div>
                <div className={styles.nextButton}>
                    <button onClick={()=>nextPage()}>Siguiente</button>
                </div>
            </div>
        </div>
        :
            <div className={styles.card}>
                {selectedPokemons &&
                <Card className={styles.cardInfo}>
                        <Button
                            className={styles.backButton}
                            disabled={selectedPokemons.id === 1}
                            onClick={()=>showDetail(offset-1+selectedPokemons.id)}
                        >
                            Anterior
                        </Button>
                    <CardContent>
                        <Typography variant="h3" component="div">
                            {selectedPokemons.name} #{selectedPokemons.id}
                        </Typography>
                        <CardContent>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Tipo: {
                                selectedPokemons.types.map((item,index)=>
                                    `${item.type.name} `
                                )
                            }
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            altura: {selectedPokemons.height}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            peso: {selectedPokemons.weight}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Habilidades: {
                                selectedPokemons.abilities.map((item,index)=>
                                    `${item.ability.name} `
                                )
                            }
                        </Typography>
                        <CardMedia
                        component="img"
                        image={selectedPokemons.sprites.front_default}
                        alt="green iguana"
                    />
                        </CardContent>
                        <Button
                            className={styles.backButton}
                            onClick={()=>backFunction()}
                        >
                            Volver
                        </Button>
                    </CardContent>
                    <Button
                        className={styles.backButton}
                        onClick={()=>showDetail(offset+1+selectedPokemons.id)}
                >
                        Siguiente
                    </Button>
                </Card>
                }
            </div>
        }
        </>
    );
    }