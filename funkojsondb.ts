const fs = require("fs");

fs.readFile("./funko_pop.json", "utf8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  let funkoInfo = JSON.parse(data);

  console.log(funkoInfo.length);

  console.log(
        funkoInfo.filter((o => {
            return o.handle.includes('spider-man');
        }))
  );

});
