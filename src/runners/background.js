addEventListener("myCustomEvent", (resolve, reject, args) => {
  console.log("Running background task...");
  // Your logic here (e.g., data sync, notifications)
  resolve();
});
