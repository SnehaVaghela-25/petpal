// // import { createSlice } from "@reduxjs/toolkit";

// // const initialState = {
// //   cartItems: [],
// // };

// // const cartSlice = createSlice({
// //   name: "cart",
// //   initialState,
// //   reducers: {
// //     addToCart: (state, action) => {
// //       const { product, quantity } = action.payload;
// //       const existingItem = state.cartItems.find(
// //         (item) => item.id === product.id,
// //       );

// //       if (existingItem) {
// //         existingItem.quantity += quantity;
// //       } else {
// //         state.cartItems.push({ ...product, quantity });
// //       }
// //     },

// //     removeFromCart: (state, action) => {
// //       state.cartItems = state.cartItems.filter(
// //         (item) => item.id !== action.payload,
// //       );
// //     },

// //     clearCart: (state) => {
// //       state.cartItems = [];
// //     },

// //     loadCart: (state, action) => {
// //       state.cartItems = action.payload || [];
// //     },
// //   },
// // });

// // export const { addToCart, removeFromCart, clearCart, loadCart } =
// //   cartSlice.actions;
// // export default cartSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   cartItems: [],
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       const { product, quantity } = action.payload;

//       const existingItem = state.cartItems.find(
//         (item) => item.id === product.id,
//       );

//       if (existingItem) {
//         existingItem.quantity += quantity;
//       } else {
//         state.cartItems.push({
//           ...product,
//           quantity,
//         });
//       }
//     },

//     removeFromCart: (state, action) => {
//       state.cartItems = state.cartItems.filter(
//         (item) => item.id !== action.payload,
//       );
//     },

//     clearCart: (state) => {
//       state.cartItems = [];
//     },

//     loadCart: (state, action) => {
//       state.cartItems = Array.isArray(action.payload) ? action.payload : [];
//     },
//   },
// });

// export const { addToCart, removeFromCart, clearCart, loadCart } =
//   cartSlice.actions;

// export default cartSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCartFromDB, saveCartToDB } from "../services/cartService";

export const fetchCart = createAsyncThunk("cart/fetchCart", async (uid) => {
  const items = await fetchCartFromDB(uid);
  return items;
});

export const syncCart = createAsyncThunk(
  "cart/syncCart",
  async ({ uid, cartItems }) => {
    await saveCartToDB(uid, cartItems);
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    loading: false,
  },

  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;

      const existing = state.cartItems.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.cartItems.push({
          ...product,
          quantity,
        });
      }
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload,
      );
    },

    clearCart: (state) => {
      state.cartItems = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;