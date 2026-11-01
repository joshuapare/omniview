// Run with an available Puppeteer page at the local prototype URL. No cluster access.
export async function capture(page, directory) {
  await page.setViewport({width:1440,height:900,deviceScaleFactor:1.25});
  const kinds=['Kafka','KafkaNodePool','KafkaConnect','KafkaConnector','KafkaTopic','KafkaUser','KafkaBridge','KafkaMirrorMaker2','KafkaRebalance'];
  for (const kind of kinds) {
    await page.select('#kind',kind);
    await page.screenshot({path:directory+'/'+kind+'-overview.png'});
    if(kind!=='KafkaRebalance') {
      await page.click('[data-section="details"]');
      if(await page.$('#add')) {await page.click('#add');}
      await page.screenshot({path:directory+'/'+kind+'-configuration.png'});
    }
  }
}
