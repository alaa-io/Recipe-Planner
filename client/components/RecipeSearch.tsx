import AutorenewIcon from "@mui/icons-material/Autorenew";
import SearchIcon from "@mui/icons-material/Search";
import {
  Container,
  Divider,
  Grid,
  IconButton,
  Input,
  MenuItem,
  Paper,
  Select,
  Tooltip,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import InputBase from "@mui/material/InputBase";

export interface RecipeSearchProps {
  onSearchInputChange: (e: string) => void;
  servings: number;
  onServingsInputChange: (e: number) => void;
  randomizeRecipes: () => void;
  searchTerm: string;
}

const RecipeSearch = (props: RecipeSearchProps): JSX.Element => {
  const {
    onSearchInputChange,
    servings,
    onServingsInputChange,
    randomizeRecipes,
    searchTerm,
  } = props;

  return (
    <Container maxWidth="sm">
      <Paper component="form" sx={{ display: "flex", alignItems: "center" }}>
        <InputBase
          sx={{ ml: 3, flex: 1 }}
          placeholder="Search for recipes"
          inputProps={{ "aria-label": "Search for recipes" }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      <Grid
        item
        container
        display="flex"
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Input
          id="search"
          sx={{
            marginTop: "0.5rem",
          }}
          value={searchTerm}
          onChange={(e) => onSearchInputChange(e.target.value)}
        />
        <Select
          id="servings"
          label="Number of people"
          value={servings}
          onChange={(e) => onServingsInputChange(e.target.value as number)}
          sx={{ width: 150, marginBottom: 2 }}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={7}>7</MenuItem>
        </Select>
      </Grid>
      <Grid
        item
        container
        display="flex"
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Tooltip title={`Generate Random Recipes`} placement="right">
          <AutorenewIcon
            sx={{
              marginTop: "0.5rem",
              cursor: "pointer",
              fontSize: "3rem",
              ":hover": {
                color: blue[500],
              },
            }}
            onClick={randomizeRecipes}
          />
        </Tooltip>
      </Grid>
    </Container>
  );
};

export default RecipeSearch;
