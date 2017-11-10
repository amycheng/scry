const puppeteer = require('puppeteer'),
  argv = require('yargs').argv,
  BlinkDiff = require('blink-diff');

let source = argv.s,
target = argv.t,
fileName = argv.n;

console.log("scrying");

(async () => {


  const browser = await puppeteer.launch();
  const sourcePage = await browser.newPage();
  await sourcePage.goto(source);
  await sourcePage.setViewport({width: 1500, height: 1000});
  await sourcePage.screenshot({path: 'source'+fileName+'.png'});

  const targetPage = await browser.newPage();
  await targetPage.goto(target);
  await targetPage.setViewport({width: 1500, height: 1000});
  await targetPage.screenshot({path: 'target'+fileName+'.png'});

  browser.close();

var diff = new BlinkDiff({
    imageAPath: 'source'+fileName+'.png', // Use file-path
    imageBPath: 'target'+fileName+'.png',

    thresholdType: BlinkDiff.THRESHOLD_PERCENT,
    threshold: 0.01, // 1% threshold

    imageOutputPath: 'diff'+fileName+'.png'
});

diff.run(function (error, result) {
   if (error) {
      throw error;
   } else {
      console.log(diff.hasPassed(result.code) ? 'Passed' : 'Failed');
      console.log('Found ' + result.differences + ' differences.');
   }
});

  console.log("end scrying");
})();
