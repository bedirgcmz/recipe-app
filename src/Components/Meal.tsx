import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Modal,
  IconButton,
  CardMedia, // Import CardMedia
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface MealData {
  strMeal: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  [key: string]: string | undefined;
}

const Meal: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [mealData, setMealData] = useState<MealData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null); // New state for input validation
  const [open, setOpen] = useState<boolean>(false);

  const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

  const getMeal = async () => {
    if (!userInput.trim()) {
      setInputError("Please write a meal name"); // Set input error if input is empty
      return;
    }
    setInputError(null); // Clear the input error if input is valid
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url + userInput);
      const data = await res.json();
      if (data.meals) {
        setMealData(data.meals[0]);
      } else {
        setMealData(null);
        setError("No meal found");
      }
    } catch (error) {
      setError("Error fetching meal data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const ingredients = mealData
    ? Object.keys(mealData)
        .filter((key) => key.startsWith("strIngredient") && mealData[key as keyof MealData])
        .map((key) => mealData[key as keyof MealData])
    : [];

  return (
    <Box sx={{ textAlign: "center", mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Find Your Best Meal
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          px: 2,
        }}
      >
        <Box sx={{ width: "400px", height: "55px", borderRadius: "6px 0 0 6px" }}>
          <TextField
            fullWidth
            label="Write a meal word..."
            variant="outlined"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            error={!!inputError}
            helperText={inputError}
            InputProps={{
              sx: {
                height: "55px",
                borderRadius: "6px 0 0 6px",
              },
            }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={getMeal}
          disabled={loading}
          sx={{ height: "55px", borderRadius: "0 6px 6px 0", ml: "-3px" }}
        >
          Search
        </Button>
      </Box>

      {loading && (
        <Box sx={{ mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography variant="body1" color="error" sx={{ mt: 4 }}>
          {error}
        </Typography>
      )}

      {mealData && (
        <Card sx={{ maxWidth: "600px", mt: 4, mx: "auto" }}>
          <CardContent>
            <CardMedia
              component="img"
              height="300"
              image={mealData.strMealThumb}
              alt={mealData.strMeal}
              sx={{ borderRadius: "8px" }}
            />
            <Typography sx={{ mt: 1 }} variant="h5">
              {mealData.strMeal}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {mealData.strArea}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {ingredients.map((ingredient, index) => (
                <Grid item xs={6} key={index}>
                  <Typography>{ingredient}</Typography>
                </Grid>
              ))}
            </Grid>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 3, width: "100%" }}
              onClick={handleOpen}
            >
              View Recipe
            </Button>
          </CardContent>
        </Card>
      )}

      <Modal open={open} onClose={handleClose} aria-labelledby="recipe-modal-title">
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "600px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="recipe-modal-title" variant="h6" component="h2">
            {mealData?.strMeal}
          </Typography>
          <Typography sx={{ mt: 2, textAlign: "left" }}>{mealData?.strInstructions}</Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default Meal;
