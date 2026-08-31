import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails = () => {
  const { id } = useParams();

  const ingredient = useSelector((state) =>
    state.ingredients.ingredients.find((item) => item._id === id)
  );

  if (!ingredient) {
    return null;
  }

  return <IngredientDetailsUI ingredientData={ingredient} />;
};
