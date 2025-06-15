export const handleSaveError = (error, data, next) => {
    error.status = 400;
    next();
};

export const setUpdateSettings = function(next) {
  this.getOptions.runValidators = true;
  this.schemaLevelProjections.new = true;
  next();
};