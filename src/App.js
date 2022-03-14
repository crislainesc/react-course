import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import { uiActions } from './store/ui-slice';

function App() {
  const dispatch = useDispatch();
  const showCart = useSelector(state => state.ui.cartIsVisible);
  const cart = useSelector(state => state.cart)
  const notification = useSelector()

  useEffect(() => {
    const sendCartData = async () => {
      dispatch(uiActions.showNotification({
        state: 'pending',
        title: 'Sending...',
        message: 'Sending cart data!'
      }))

      const response = await fetch('https://react-http-75081-default-rtdb.firebaseio.com/cart.json', {
        method: 'PUT',
        body: JSON.stringify(cart)
      })

      if (!response.ok) {
        dispatch(uiActions.showNotification({
          state: 'error',
          title: 'Error!',
          message: 'Sending cart data failed!'
        }))
      }

      dispatch(uiActions.showNotification({
        state: 'success',
        title: 'Success!',
        message: 'Sent cart data successfully!'
      }))

    }

    sendCartData().catch(error => {
      dispatch(uiActions.showNotification({
        state: 'error',
        title: 'Error!',
        message: 'Sending cart data failed!'
      }))
    });
  }, [cart, dispatch])

  return (
    <Layout>
      {showCart && <Cart />}
      <Products />
    </Layout>
  );
}

export default App;
