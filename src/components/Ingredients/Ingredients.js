import React, { useCallback, useMemo, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal'
import Search from './Search';

const ingredientReducer = (ingredientState, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;

    case 'ADD':
      return [...ingredientState, action.ingredient]

    case 'DELETE':
      return ingredientState.filter(ingredient => ingredient.id !== action.id)

    default:
      throw new Error('Should not get there!')

  }
}

const httpReducer = (prevHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null }

    case 'RESPONSE':
      return { ...prevHttpState, loading: false }

    case 'ERROR':
      return { loading: false, error: action.errorMessage }

    case 'CLEAR':
      return { ...prevHttpState, error: null }

    default:
      throw new Error('Should not be reached!')
  }
}

function Ingredients() {

  const [userIngredients, dispatchIngredient] = useReducer(ingredientReducer, [])
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null })

  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients)
    dispatchIngredient({ type: 'SET', ingredients: filteredIngredients })
  }, [])

  const addIngredientHandler = useCallback(ingredient => {
    dispatchHttp({ type: 'SEND' })
    fetch('https://react-http-75081-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' })
      return response.json()
    }).then(responseData => {
      // setUserIngredients(prevIngredients =>
      //   [...prevIngredients, { id: responseData.name, ...ingredient }]
      // )
      dispatchIngredient({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient } })
    })
  }, [])

  const removeIngredientHandler = useCallback(ingredientId => {
    dispatchHttp({ type: 'SEND' })
    fetch(`https://react-http-75081-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' })
      // setUserIngredients(prevIngredients =>
      //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      // )
      dispatchIngredient({ type: 'DELETE', id: ingredientId })
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', errorMessage: error.message })
    })

  }, [])

  const clearError = useCallback(() => {
    dispatchHttp({ type: 'CLEAR' });
  }, [])


  const ingredientList = useMemo(() => {
    return <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
  }, [userIngredients, removeIngredientHandler])

  return (
    <div className="App">

      {httpReducer.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}

      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
