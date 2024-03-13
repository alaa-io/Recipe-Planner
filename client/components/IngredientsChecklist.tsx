import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";

export type Ingredient = {
  name: string;
  quantity: string | number | null;
  unit: string | null;
};

export interface IngredientsChecklistProps {
  ingredients: Ingredient[];
}

export type IngredientChecklist = {
  name: string;
  quantity: string | number | null;
  unit: string | null;
};

const IngredientsChecklist = (
  props: IngredientsChecklistProps
): JSX.Element => {
  const { ingredients } = props;

  const [checked, setChecked] = useState<number[]>([]);
  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const onCheckClickHandler = (e: number): void => {
    if (checked.includes(e)) {
      setChecked(checked.filter((item) => item !== e));
    } else {
      setChecked([...checked, e]);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        paddingTop: "0.3rem",
        paddingBottom: "0.3rem",
      }}
    >
      <TableContainer component={Paper}>
        <Table size="medium" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                Ingredient
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                Quantity{" "}
                <Button
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: "normal",
                    minWidth: "1rem",
                    maxWidth: "1rem",
                  }}
                  onClick={() => {
                    alert(
                      "Quantity with same measurement units have been added together from all recipes (ex: 10g and 12g will be displayed as 22g). If the measurement units are different, you will need to shop for the total both measurments (ex: Milk 1 cup, Milk 250ml are NOT combined)."
                    );
                  }}
                >
                  ?
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredients.map((ingredient: any, index: any) => (
              <TableRow
                key={crypto.randomUUID()}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => {
                  if (checked.includes(index)) {
                    onCheckClickHandler(index);
                  } else {
                    onCheckClickHandler(index);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <TableCell component="th" scope="row">
                  <Checkbox checked={checked.includes(index)} />
                  {ingredient.name}
                </TableCell>
                <TableCell align="right">{`
                              ${
                                ingredient.quantity === 0
                                  ? "xxxsx"
                                  : ingredient.quantity
                              } 
                              ${
                                ingredient.unit === null ? "" : ingredient.unit
                              }`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default IngredientsChecklist;
