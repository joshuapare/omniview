// Browser smoke driver. Supply a Puppeteer-compatible isolated page and output directory.
export async function capture(page, output) {
 await page.setViewport({width:1440,height:900,deviceScaleFactor:1.25});
 const kinds=["Prometheus","PrometheusAgent","Alertmanager","ThanosRuler","ServiceMonitor","PodMonitor","Probe","PrometheusRule","AlertmanagerConfig","ScrapeConfig"];
 for (const kind of kinds) {
  await page.goto('http://127.0.0.1:53077/?kind='+kind+'&intent=edit');
  await page.waitForSelector('input');
  await page.screenshot({path:output+'/'+kind+'.png'});
 }
}
