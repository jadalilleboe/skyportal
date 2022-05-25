import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserPreferencesHeader from "./UserPreferencesHeader";
import { useForm } from "react-hook-form";
import { Button, Chip, TextField, Typography } from "@material-ui/core";
import FilterSelect from "./FilterSelect";
import OriginSelect from "./OriginSelect";
import { makeStyles } from "@material-ui/core/node_modules/@material-ui/styles";
import * as profileActions from "../ducks/profile";

const useStyles = makeStyles(() => ({
  submitButton: {
    margin: "1.5rem 0 0 0",
  },
  form: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    paddingBottom: "1.5rem",
  },
}));

const PhotometryButtonsForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { photometryButtons } = useSelector(
    (state) => state.profile.preferences
  );
  const { handleSubmit, register, control, errors, reset } = useForm();
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const onFilterSelectChange = (event) => {
    setSelectedFilters(event.target.value);
  };
  const onOriginSelectChange = (event) => {
    setSelectedOrigins(event.target.value);
  };
  const onSubmit = (formValues) => {
    const currPhotButtons = photometryButtons || {};
    currPhotButtons[formValues.photometryButtonName] = {
      filters: selectedFilters,
      origins: selectedOrigins,
    };
    const prefs = {
      photometryButtons: currPhotButtons,
    };
    dispatch(profileActions.updateUserPreferences(prefs));
    setSelectedFilters([]);
    setSelectedOrigins([]);
    reset({
      photometryButtonName: "",
    });
  };
  const onDelete = (buttonName) => {
    const currPhotButtons = photometryButtons;
    delete currPhotButtons[buttonName];
    const prefs = {
      photometryButtons: currPhotButtons,
    };
    dispatch(profileActions.updateUserPreferences(prefs));
  };
  return (
    <div>
      <UserPreferencesHeader title="Photometry Buttons" />
      <div className={classes.form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <FilterSelect
              initValue={selectedFilters}
              onFilterSelectChange={onFilterSelectChange}
              control={control}
            />
            <OriginSelect
              initValue={selectedOrigins}
              onOriginSelectChange={onOriginSelectChange}
              control={control}
            />
            <TextField
              label="Name"
              inputRef={register({
                required: true,
                validate: (value) => {
                  if (photometryButtons) {
                    return !(value in photometryButtons);
                  }
                  return null;
                },
              })}
              name="photometryButtonName"
              id="photometryButtonNameInput"
              error={!!errors.photometryButtonName}
              helperText={
                errors.photometryButtonName
                  ? "Required/Button with that name already exists"
                  : ""
              }
            />
          </div>
          <Button
            variant="contained"
            type="submit"
            className={classes.submitButton}
          >
            Submit
          </Button>
        </form>
        {photometryButtons && (
          <div>
            <Typography>Photometry Buttons</Typography>
            {Object.keys(photometryButtons).map((buttonName) => (
              <Chip
                key={buttonName}
                label={buttonName}
                onDelete={() => onDelete(buttonName)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotometryButtonsForm;
