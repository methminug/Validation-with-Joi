import {
  Grid,
  Typography,
  TextField,
  AppBar,
  Toolbar,
  Alert,
} from "@mui/material";
import Joi from "joi";
import React, { useReducer, useState } from "react";

const Home = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const initialFormErrorState = {
    nameError: "",
    emailError: "",
    pwdError: "",
    rpwdError: "",
  };
  const reducer = (state, action) => {
    return {
      ...state,
      [action.name]: action.value,
    };
  };

  const [state, dispatch] = useReducer(reducer, initialFormErrorState);

  const objectSchema = {
    name: Joi.string().alphanum().min(3).max(30).required(),

    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),

    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required()
      .messages({
        "string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
        "string.empty": `Password cannot be empty`,
        "any.required": `Password is required`,
      }),

    repeatPassword: Joi.valid(userData.password).messages({
      "any.only": "The two passwords do not match",
      "any.required": "Please re-enter the password",
    }),
  };

  const handleChange = (e, errorFieldName) => {
    setUserData((currentData) => {
      return {
        ...currentData,
        [e.target.id]: e.target.value,
      };
    });
    const propertySchema = Joi.object({
      [e.target.id]: objectSchema[e.target.id],
    });

    const result = propertySchema.validate({ [e.target.id]: e.target.value });
    result.error == null
      ? dispatch({
          name: errorFieldName,
          value: "",
        })
      : dispatch({
          name: errorFieldName,
          value: result.error.details[0].message,
        });
  };

  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography textAlign="center" variant="h6">
            Data Validation with Joi
          </Typography>
        </Toolbar>
      </AppBar>
      <form
        style={{ margin: "3em 4em 0em 4em" }}
        onSubmit={() => handleSubmit()}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              style={{ width: "100%" }}
              id="name"
              label="Name"
              variant="outlined"
              size="small"
              color="primary"
              onChange={(value) => handleChange(value, "nameError")}
              value={userData.name}
            />
            {state.nameError !== "" ? (
              <Alert severity="error">{state.nameError}</Alert>
            ) : null}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              style={{ width: "100%" }}
              id="email"
              label="Email"
              variant="outlined"
              size="small"
              color="primary"
              onChange={(value) => handleChange(value, "emailError")}
              value={userData.email}
            />
            {state.emailError !== "" ? (
              <Alert severity="error">{state.emailError}</Alert>
            ) : null}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              type="password"
              style={{ width: "100%" }}
              id="password"
              label="Password"
              variant="outlined"
              size="small"
              color="primary"
              onChange={(value) => handleChange(value, "pwdError")}
              value={userData.password}
            />
            {state.pwdError !== "" ? (
              <Alert severity="error">{state.pwdError}</Alert>
            ) : null}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              type="password"
              style={{ width: "100%" }}
              id="repeatPassword"
              label="Repeat Password"
              variant="outlined"
              size="small"
              color="primary"
              onChange={(value) => handleChange(value, "rpwdError")}
              value={userData.repeatPassword}
            />
            {state.rpwdError !== "" ? (
              <Alert severity="error">{state.rpwdError}</Alert>
            ) : null}
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};

export default Home;
