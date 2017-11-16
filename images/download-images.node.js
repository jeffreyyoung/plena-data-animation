var IMAGES = ["image/business_intelligence_sherlock_data_source_access.png", "image/business_intelligence_sherlock_data_source_adwords.png", "image/business_intelligence_sherlock_data_source_aws.png", "image/business_intelligence_sherlock_data_source_bing.png", "image/business_intelligence_sherlock_data_source_criteo.png", "image/business_intelligence_sherlock_data_source_entrata.png", "image/business_intelligence_sherlock_data_source_excel.png", "image/business_intelligence_sherlock_data_source_facebook.png", "image/business_intelligence_sherlock_data_source_firebird.png", "image/business_intelligence_sherlock_data_source_googleanalytics.png", "image/business_intelligence_sherlock_data_source_hadoop.png", "image/business_intelligence_sherlock_data_source_kenshoo.png", "image/business_intelligence_sherlock_data_source_mailchimp.png", "image/business_intelligence_sherlock_data_source_marin.png", "image/business_intelligence_sherlock_data_source_mongo.png", "image/business_intelligence_sherlock_data_source_moz.png", "image/business_intelligence_sherlock_data_source_mysql.png", "image/business_intelligence_sherlock_data_source_oracle.png", "image/business_intelligence_sherlock_data_source_postgres.png", "image/business_intelligence_sherlock_data_source_quickbooks.png", "image/business_intelligence_sherlock_data_source_salesforce.png", "image/business_intelligence_sherlock_data_source_sparksql.png", "image/business_intelligence_sherlock_data_source_stripe.png", "image/business_intelligence_sherlock_data_source_teradata.png", "image/business_intelligence_sherlock_data_source_trello.png", "image/business_intelligence_sherlock_data_source_twitter.png", "image/business_intelligence_sherlock_data_source_xero.png"]

var https = require('https'),                                                
    fs = require('fs');                                                    

var filesystem = fs;
var downloadFile = function(url, dest, cb) {
   var file = filesystem.createWriteStream(dest);
   var request = https.get(url, function(httpResponse) {
    httpResponse.pipe(file);
    file.on('finish', function() {
      console.log("piping to file finished")
      file.close(cb);  // close() is async, call cb after close completes.
    });
   }).on('error', function(err) { // Handle errors
    filesystem.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
   });
	}
IMAGES.forEach(function(img, index) {
  downloadFile('https://sherlockintelligence.com/'+img, img.replace('image/business_intelligence_sherlock_', ''));
});