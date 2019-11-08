import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import axios from 'axios';

const ParseXbrl = require('parse-xbrl');

const API_KEY = 'c2e0937ead8097ef6fcdd61a1f94dd7893a3e4982595e110eab9c7f122ee44f2';

const secApi = `https://api.sec-api.io?token=${API_KEY}`;

interface Filing {
  ticker: string,
  formType: string,
  filedAt: string,
  cik: string,
  companyName: string,
  linkToTxt: string,
  id: string,
  linkToHtml: string,
};

interface SecApiQueryResult {
  total: number,
  filings: Filing[];
}

interface XbrlRecord {
  source: string,
  data: {}
}

async function getMetaData(ticker: string): Promise<SecApiQueryResult> {
  const data = {
    'query': {
      'query_string': {
        'query': `ticker:${ticker} 
                    AND filedAt:{2016-01-01 TO 2016-12-31} 
                    AND formType:\"10-Q\"`
      }
    },
    'from': '0',
    'size': '10',
    'sort': [
      {
        'filedAt': {
          'order': 'desc'
        }
      }
    ]
  };

  try {
    const response = await axios.post(
      secApi,
      data,
      {
        headers: {
          'Content-type': 'application/json',
        }
      }
    );

    return response.data;
  }
  catch (error) {
    // Error 😨
    if (error.response) {
      /*
      * The request was made and the server responded with a
      * status code that falls out of the range of 2xx
      */
      console.log('response', error.response.data);
    } else if (error.request) {
      /*
      * The request was made but no response was received, `error.request`
      * is an instance of XMLHttpRequest in the browser and an instance
      * of http.ClientRequest in Node.js
      */
      console.log(error.request);
    } else {
      // Something happened in setting up the request and triggered an Error
      console.log('Error', error.message);
    }
    console.log(error);
  }
}

async function getXbrlFromTxt(txtData): Promise<XbrlRecord> {
  const documents = txtData.split(/(?=\<DOCUMENT\>)/);

  const xbrls = documents
    .filter((d) => d.includes('<TYPE>EX-101.INS'));

  if (xbrls.length != 1) {
    throw new Error(`Found ${xbrls.length} xbrl records, SEC says this is invalid.`);
  }

  const rawXbrl = xbrls[0].split('<XBRL>')[1].split('</XBRL>')[0].trim();

  return await ParseXbrl.parseStr(rawXbrl);
}

@Injectable()
export class AppService {
  constructor(
    private readonly logger: PinoLogger,
  ) {
    logger.setContext(AppService.name);
  }

  async getCap(ticker: string): Promise<{}> {
    const applData = await getMetaData(ticker);

    const xbrlPromises = applData.filings.map(async (filing) => {
      const txtData = await axios.get(filing.linkToTxt);

      return {
        source: filing.linkToTxt,
        data: await getXbrlFromTxt(txtData.data)
      };
    })

    // Cheating because even though allSettled exists, the TS @typings don't know it yet.
    const xbrls = await Promise['allSettled'](xbrlPromises);
    
    const report = {
      tickerSymbol: ticker,
      results: {}
    };

    xbrls.map((x) => x.value).forEach((xbrl) => {
      const key = `${xbrl.data.DocumentFiscalYearFocus}-${xbrl.data.DocumentFiscalPeriodFocus}`;
      report.results[key] = {
        source: xbrl.source,
        equity: xbrl.data.Equity,
      };
    });

    return report;

  }
}
