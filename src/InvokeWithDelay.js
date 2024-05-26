function InvokeWitDelay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export default InvokeWitDelay;
