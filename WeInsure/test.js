const WeInsure = artifacts.require("WeInsure");

module.exports = async function() {
  const WeInsure = await WeInsure.deployed();
  await WeInsure.resetResult();

  resultReceived = await WeInsure.resultReceived();
  result = await WeInsure.result();
  console.log(`Received result: ${resultReceived}`);
  console.log(`Initial result: ${result.toString()}`);

  console.log("Making a Chainlink request using a Honeycomb job...");
  requestId = await WeInsure.makeRequest.call();
  await WeInsure.makeRequest();
  console.log(`Request ID: ${requestId}`);

  console.log("Waiting for the request to be fulfilled...");
  while (true) {
    const responseEvents = await WeInsure.getPastEvents(
      "ChainlinkFulfilled",
      { filter: { id: requestId } }
    );
    if (responseEvents.length !== 0) {
      console.log("Request fulfilled!");
      break;
    }
  }

  resultReceived = await WeInsure.resultReceived();
  result = await WeInsure.result();
  console.log(`Received result: ${resultReceived}`);
  console.log(`Final result: ${result.toString()}`);

  process.exit();
};
