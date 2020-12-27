import WordPieceTokenizer from "./wordpiecetokenizer";
import vocab from "./vocab";

function isPunctuation(cp: number): boolean {
  // Checks a cp is a punctuation character or not.
  return punctuations.indexOf(cp) !== -1;
}

function runStripAccents(text: string) {
  // strips accent marks from text
  text = text.normalize("NFD");
  nsmarks.forEach((cp: number) => {
    text = text.replace(String.fromCodePoint(cp), "");
  });
  return text;
}

function isWhiteSpace(cp: number): boolean {
  // \t, \n, and \r are technically control characters but we treat them
  // as whitespace since they are generally considered as such.
  if (cp === 32 || cp === 9 || cp === 10 || cp === 13) {
    return true;
  }
  if (spcsep.indexOf(cp) !== -1) {
    return true;
  }
  return false;
}

function isControl(cp: number): boolean {
  // "\t" "\n" "\r" are technically control characters but we count them as whitespace
  // characters.
  if (ctlchar.indexOf(cp) !== -1 && cp !== 9 && cp !== 10 && cp !== 13) {
    return true;
  }
  return false;
}

// function runSplitOnPunctuation(text: string) {
//   // Splits punctuation with a space on a piece of text
//   // e.g.:
//   // "abc?" -> "abc ?"
//   // "abc?def" -> "abc ? def"
//   // "abc??def" -> abc ? ? def"
//   const output = [];
//   let preCodePoint = -1;
//   let preCodePointIsPunc = false;
//   for (let i = 0; i < text.length; i++) {
//     // current cp is a punctuation AND previous codePoint is not a space
//     // e.g abc?
//     const codePoint = text.charCodeAt(i);
//     const isPuncCurrent = isPunctuation(codePoint);
//     if (isPuncCurrent && preCodePoint !== 32) {
//       output.push(32);
//       // previous cp is not space AND previous codePoint is punctuation
//       // e.g. abc??
//     } else if (preCodePointIsPunc && codePoint !== 32) {
//       output.push(32);
//     }
//     output.push(codePoint);
//     preCodePoint = codePoint;
//     preCodePointIsPunc = isPuncCurrent;
//   }
//   return String.fromCodePoint(...output);
// }

function cleanText(text: string) {
  //Performs invalid character removal and whitespace cleanup on text.
  const output = [];
  for (let i = 0; i < text.length; i++) {
    let cp = text.charCodeAt(i);
    if (cp === 0 || cp === 65533 || isControl(cp)) {
      continue;
    }
    if (isWhiteSpace(cp)) {
      output.push(32);
    } else {
      output.push(cp);
    }
  }
  return String.fromCharCode(...output);
}

class BertTokenizer {
  //Runs basic tokenization (punctuation splitting, lower casing, etc.).
  private doLowerCase: boolean;
  tokenizer: WordPieceTokenizer;
  clsId: number;
  sepId: number;
  maxSeqLength: number;

  constructor(doLowerCase: boolean = true, maxSeqLength: number = 128) {
    this.tokenizer = new WordPieceTokenizer();
    this.tokenizer.load(vocab);
    this.doLowerCase = doLowerCase;
    this.maxSeqLength = maxSeqLength;
    this.clsId = this.convertTokensToId("[CLS]")[0];
    this.sepId = this.convertTokensToId("[SEP]")[0];
  }

  tokenize(text: string) {
    text = cleanText(text);
    // text = runSplitOnPunctuation(text);
    text = runStripAccents(text);
    if (this.doLowerCase) {
      text = text.toLowerCase();
    }
    return this.tokenizer.tokenize(text);
  }

  convertIdsToTokens(ids: number[]) {
    let tokens: string[] = [];
    ids.forEach((id) => {
      tokens.push(this.tokenizer.vocab[id]);
    });
    return tokens;
  }

  convertTokensToId(token: string) {
    //convert a token directly to token ID without any pre processing
    return this.tokenizer.tokenize(token);
  }

  convertSingleExample(text: string) {
    // converts single example to feature input. This is derived from:
    // https://github.com/google-research/bert/blob/88a817c37f788702a363ff935fd173b6dc6ac0d6/run_classifier.py#L377-L476

    let inputIds: number[] = [];
    let inputMask: number[] = [];
    let segmentIds: number[] = [];
    const tokenIds = this.tokenize(text);

    inputIds.push(this.clsId);
    inputMask.push(1);
    segmentIds.push(0);

    inputIds.push(...tokenIds);
    tokenIds.forEach((id) => {
      inputMask.push(1);
      segmentIds.push(0);
    });

    inputIds.push(this.sepId);
    inputMask.push(1);
    segmentIds.push(0);

    // pad with 0 up to the maxSeqLength
    const numTokens = inputIds.length;
    for (let i = 0; i < this.maxSeqLength - numTokens; i++) {
      inputIds.push(0);
      inputMask.push(0);
      segmentIds.push(0);
    }
    // console.log('input_ids: ', inputIds);
    // console.log('input_mask: ', inputMask);
    // console.log('segmentIds: ', segmentIds);
    return { inputIds, segmentIds, inputMask };
  }
}
// Unicode code points are extracted from repo below which is intended for node.js not client js.
// https://github.com/mathiasbynens/unicode-12.1.0/blob/master/General_Category/Nonspacing_Mark/code-points.js
var nsmarks = [
  768,
  769,
  770,
  771,
  772,
  773,
  774,
  775,
  776,
  777,
  778,
  779,
  780,
  781,
  782,
  783,
  784,
  785,
  786,
  787,
  788,
  789,
  790,
  791,
  792,
  793,
  794,
  795,
  796,
  797,
  798,
  799,
  800,
  801,
  802,
  803,
  804,
  805,
  806,
  807,
  808,
  809,
  810,
  811,
  812,
  813,
  814,
  815,
  816,
  817,
  818,
  819,
  820,
  821,
  822,
  823,
  824,
  825,
  826,
  827,
  828,
  829,
  830,
  831,
  832,
  833,
  834,
  835,
  836,
  837,
  838,
  839,
  840,
  841,
  842,
  843,
  844,
  845,
  846,
  847,
  848,
  849,
  850,
  851,
  852,
  853,
  854,
  855,
  856,
  857,
  858,
  859,
  860,
  861,
  862,
  863,
  864,
  865,
  866,
  867,
  868,
  869,
  870,
  871,
  872,
  873,
  874,
  875,
  876,
  877,
  878,
  879,
  1155,
  1156,
  1157,
  1158,
  1159,
  1425,
  1426,
  1427,
  1428,
  1429,
  1430,
  1431,
  1432,
  1433,
  1434,
  1435,
  1436,
  1437,
  1438,
  1439,
  1440,
  1441,
  1442,
  1443,
  1444,
  1445,
  1446,
  1447,
  1448,
  1449,
  1450,
  1451,
  1452,
  1453,
  1454,
  1455,
  1456,
  1457,
  1458,
  1459,
  1460,
  1461,
  1462,
  1463,
  1464,
  1465,
  1466,
  1467,
  1468,
  1469,
  1471,
  1473,
  1474,
  1476,
  1477,
  1479,
  1552,
  1553,
  1554,
  1555,
  1556,
  1557,
  1558,
  1559,
  1560,
  1561,
  1562,
  1611,
  1612,
  1613,
  1614,
  1615,
  1616,
  1617,
  1618,
  1619,
  1620,
  1621,
  1622,
  1623,
  1624,
  1625,
  1626,
  1627,
  1628,
  1629,
  1630,
  1631,
  1648,
  1750,
  1751,
  1752,
  1753,
  1754,
  1755,
  1756,
  1759,
  1760,
  1761,
  1762,
  1763,
  1764,
  1767,
  1768,
  1770,
  1771,
  1772,
  1773,
  1809,
  1840,
  1841,
  1842,
  1843,
  1844,
  1845,
  1846,
  1847,
  1848,
  1849,
  1850,
  1851,
  1852,
  1853,
  1854,
  1855,
  1856,
  1857,
  1858,
  1859,
  1860,
  1861,
  1862,
  1863,
  1864,
  1865,
  1866,
  1958,
  1959,
  1960,
  1961,
  1962,
  1963,
  1964,
  1965,
  1966,
  1967,
  1968,
  2027,
  2028,
  2029,
  2030,
  2031,
  2032,
  2033,
  2034,
  2035,
  2045,
  2070,
  2071,
  2072,
  2073,
  2075,
  2076,
  2077,
  2078,
  2079,
  2080,
  2081,
  2082,
  2083,
  2085,
  2086,
  2087,
  2089,
  2090,
  2091,
  2092,
  2093,
  2137,
  2138,
  2139,
  2259,
  2260,
  2261,
  2262,
  2263,
  2264,
  2265,
  2266,
  2267,
  2268,
  2269,
  2270,
  2271,
  2272,
  2273,
  2275,
  2276,
  2277,
  2278,
  2279,
  2280,
  2281,
  2282,
  2283,
  2284,
  2285,
  2286,
  2287,
  2288,
  2289,
  2290,
  2291,
  2292,
  2293,
  2294,
  2295,
  2296,
  2297,
  2298,
  2299,
  2300,
  2301,
  2302,
  2303,
  2304,
  2305,
  2306,
  2362,
  2364,
  2369,
  2370,
  2371,
  2372,
  2373,
  2374,
  2375,
  2376,
  2381,
  2385,
  2386,
  2387,
  2388,
  2389,
  2390,
  2391,
  2402,
  2403,
  2433,
  2492,
  2497,
  2498,
  2499,
  2500,
  2509,
  2530,
  2531,
  2558,
  2561,
  2562,
  2620,
  2625,
  2626,
  2631,
  2632,
  2635,
  2636,
  2637,
  2641,
  2672,
  2673,
  2677,
  2689,
  2690,
  2748,
  2753,
  2754,
  2755,
  2756,
  2757,
  2759,
  2760,
  2765,
  2786,
  2787,
  2810,
  2811,
  2812,
  2813,
  2814,
  2815,
  2817,
  2876,
  2879,
  2881,
  2882,
  2883,
  2884,
  2893,
  2902,
  2914,
  2915,
  2946,
  3008,
  3021,
  3072,
  3076,
  3134,
  3135,
  3136,
  3142,
  3143,
  3144,
  3146,
  3147,
  3148,
  3149,
  3157,
  3158,
  3170,
  3171,
  3201,
  3260,
  3263,
  3270,
  3276,
  3277,
  3298,
  3299,
  3328,
  3329,
  3387,
  3388,
  3393,
  3394,
  3395,
  3396,
  3405,
  3426,
  3427,
  3530,
  3538,
  3539,
  3540,
  3542,
  3633,
  3636,
  3637,
  3638,
  3639,
  3640,
  3641,
  3642,
  3655,
  3656,
  3657,
  3658,
  3659,
  3660,
  3661,
  3662,
  3761,
  3764,
  3765,
  3766,
  3767,
  3768,
  3769,
  3770,
  3771,
  3772,
  3784,
  3785,
  3786,
  3787,
  3788,
  3789,
  3864,
  3865,
  3893,
  3895,
  3897,
  3953,
  3954,
  3955,
  3956,
  3957,
  3958,
  3959,
  3960,
  3961,
  3962,
  3963,
  3964,
  3965,
  3966,
  3968,
  3969,
  3970,
  3971,
  3972,
  3974,
  3975,
  3981,
  3982,
  3983,
  3984,
  3985,
  3986,
  3987,
  3988,
  3989,
  3990,
  3991,
  3993,
  3994,
  3995,
  3996,
  3997,
  3998,
  3999,
  4000,
  4001,
  4002,
  4003,
  4004,
  4005,
  4006,
  4007,
  4008,
  4009,
  4010,
  4011,
  4012,
  4013,
  4014,
  4015,
  4016,
  4017,
  4018,
  4019,
  4020,
  4021,
  4022,
  4023,
  4024,
  4025,
  4026,
  4027,
  4028,
  4038,
  4141,
  4142,
  4143,
  4144,
  4146,
  4147,
  4148,
  4149,
  4150,
  4151,
  4153,
  4154,
  4157,
  4158,
  4184,
  4185,
  4190,
  4191,
  4192,
  4209,
  4210,
  4211,
  4212,
  4226,
  4229,
  4230,
  4237,
  4253,
  4957,
  4958,
  4959,
  5906,
  5907,
  5908,
  5938,
  5939,
  5940,
  5970,
  5971,
  6002,
  6003,
  6068,
  6069,
  6071,
  6072,
  6073,
  6074,
  6075,
  6076,
  6077,
  6086,
  6089,
  6090,
  6091,
  6092,
  6093,
  6094,
  6095,
  6096,
  6097,
  6098,
  6099,
  6109,
  6155,
  6156,
  6157,
  6277,
  6278,
  6313,
  6432,
  6433,
  6434,
  6439,
  6440,
  6450,
  6457,
  6458,
  6459,
  6679,
  6680,
  6683,
  6742,
  6744,
  6745,
  6746,
  6747,
  6748,
  6749,
  6750,
  6752,
  6754,
  6757,
  6758,
  6759,
  6760,
  6761,
  6762,
  6763,
  6764,
  6771,
  6772,
  6773,
  6774,
  6775,
  6776,
  6777,
  6778,
  6779,
  6780,
  6783,
  6832,
  6833,
  6834,
  6835,
  6836,
  6837,
  6838,
  6839,
  6840,
  6841,
  6842,
  6843,
  6844,
  6845,
  6912,
  6913,
  6914,
  6915,
  6964,
  6966,
  6967,
  6968,
  6969,
  6970,
  6972,
  6978,
  7019,
  7020,
  7021,
  7022,
  7023,
  7024,
  7025,
  7026,
  7027,
  7040,
  7041,
  7074,
  7075,
  7076,
  7077,
  7080,
  7081,
  7083,
  7084,
  7085,
  7142,
  7144,
  7145,
  7149,
  7151,
  7152,
  7153,
  7212,
  7213,
  7214,
  7215,
  7216,
  7217,
  7218,
  7219,
  7222,
  7223,
  7376,
  7377,
  7378,
  7380,
  7381,
  7382,
  7383,
  7384,
  7385,
  7386,
  7387,
  7388,
  7389,
  7390,
  7391,
  7392,
  7394,
  7395,
  7396,
  7397,
  7398,
  7399,
  7400,
  7405,
  7412,
  7416,
  7417,
  7616,
  7617,
  7618,
  7619,
  7620,
  7621,
  7622,
  7623,
  7624,
  7625,
  7626,
  7627,
  7628,
  7629,
  7630,
  7631,
  7632,
  7633,
  7634,
  7635,
  7636,
  7637,
  7638,
  7639,
  7640,
  7641,
  7642,
  7643,
  7644,
  7645,
  7646,
  7647,
  7648,
  7649,
  7650,
  7651,
  7652,
  7653,
  7654,
  7655,
  7656,
  7657,
  7658,
  7659,
  7660,
  7661,
  7662,
  7663,
  7664,
  7665,
  7666,
  7667,
  7668,
  7669,
  7670,
  7671,
  7672,
  7673,
  7675,
  7676,
  7677,
  7678,
  7679,
  8400,
  8401,
  8402,
  8403,
  8404,
  8405,
  8406,
  8407,
  8408,
  8409,
  8410,
  8411,
  8412,
  8417,
  8421,
  8422,
  8423,
  8424,
  8425,
  8426,
  8427,
  8428,
  8429,
  8430,
  8431,
  8432,
  11503,
  11504,
  11505,
  11647,
  11744,
  11745,
  11746,
  11747,
  11748,
  11749,
  11750,
  11751,
  11752,
  11753,
  11754,
  11755,
  11756,
  11757,
  11758,
  11759,
  11760,
  11761,
  11762,
  11763,
  11764,
  11765,
  11766,
  11767,
  11768,
  11769,
  11770,
  11771,
  11772,
  11773,
  11774,
  11775,
  12330,
  12331,
  12332,
  12333,
  12441,
  12442,
  42607,
  42612,
  42613,
  42614,
  42615,
  42616,
  42617,
  42618,
  42619,
  42620,
  42621,
  42654,
  42655,
  42736,
  42737,
  43010,
  43014,
  43019,
  43045,
  43046,
  43204,
  43205,
  43232,
  43233,
  43234,
  43235,
  43236,
  43237,
  43238,
  43239,
  43240,
  43241,
  43242,
  43243,
  43244,
  43245,
  43246,
  43247,
  43248,
  43249,
  43263,
  43302,
  43303,
  43304,
  43305,
  43306,
  43307,
  43308,
  43309,
  43335,
  43336,
  43337,
  43338,
  43339,
  43340,
  43341,
  43342,
  43343,
  43344,
  43345,
  43392,
  43393,
  43394,
  43443,
  43446,
  43447,
  43448,
  43449,
  43452,
  43453,
  43493,
  43561,
  43562,
  43563,
  43564,
  43565,
  43566,
  43569,
  43570,
  43573,
  43574,
  43587,
  43596,
  43644,
  43696,
  43698,
  43699,
  43700,
  43703,
  43704,
  43710,
  43711,
  43713,
  43756,
  43757,
  43766,
  44005,
  44008,
  44013,
  64286,
  65024,
  65025,
  65026,
  65027,
  65028,
  65029,
  65030,
  65031,
  65032,
  65033,
  65034,
  65035,
  65036,
  65037,
  65038,
  65039,
  65056,
  65057,
  65058,
  65059,
  65060,
  65061,
  65062,
  65063,
  65064,
  65065,
  65066,
  65067,
  65068,
  65069,
  65070,
  65071,
  66045,
  66272,
  66422,
  66423,
  66424,
  66425,
  66426,
  68097,
  68098,
  68099,
  68101,
  68102,
  68108,
  68109,
  68110,
  68111,
  68152,
  68153,
  68154,
  68159,
  68325,
  68326,
  68900,
  68901,
  68902,
  68903,
  69446,
  69447,
  69448,
  69449,
  69450,
  69451,
  69452,
  69453,
  69454,
  69455,
  69456,
  69633,
  69688,
  69689,
  69690,
  69691,
  69692,
  69693,
  69694,
  69695,
  69696,
  69697,
  69698,
  69699,
  69700,
  69701,
  69702,
  69759,
  69760,
  69761,
  69811,
  69812,
  69813,
  69814,
  69817,
  69818,
  69888,
  69889,
  69890,
  69927,
  69928,
  69929,
  69930,
  69931,
  69933,
  69934,
  69935,
  69936,
  69937,
  69938,
  69939,
  69940,
  70003,
  70016,
  70017,
  70070,
  70071,
  70072,
  70073,
  70074,
  70075,
  70076,
  70077,
  70078,
  70089,
  70090,
  70091,
  70092,
  70191,
  70192,
  70193,
  70196,
  70198,
  70199,
  70206,
  70367,
  70371,
  70372,
  70373,
  70374,
  70375,
  70376,
  70377,
  70378,
  70400,
  70401,
  70459,
  70460,
  70464,
  70502,
  70503,
  70504,
  70505,
  70506,
  70507,
  70508,
  70512,
  70513,
  70514,
  70515,
  70516,
  70712,
  70713,
  70714,
  70715,
  70716,
  70717,
  70718,
  70719,
  70722,
  70723,
  70724,
  70726,
  70750,
  70835,
  70836,
  70837,
  70838,
  70839,
  70840,
  70842,
  70847,
  70848,
  70850,
  70851,
  71090,
  71091,
  71092,
  71093,
  71100,
  71101,
  71103,
  71104,
  71132,
  71133,
  71219,
  71220,
  71221,
  71222,
  71223,
  71224,
  71225,
  71226,
  71229,
  71231,
  71232,
  71339,
  71341,
  71344,
  71345,
  71346,
  71347,
  71348,
  71349,
  71351,
  71453,
  71454,
  71455,
  71458,
  71459,
  71460,
  71461,
  71463,
  71464,
  71465,
  71466,
  71467,
  71727,
  71728,
  71729,
  71730,
  71731,
  71732,
  71733,
  71734,
  71735,
  71737,
  71738,
  72148,
  72149,
  72150,
  72151,
  72154,
  72155,
  72160,
  72193,
  72194,
  72195,
  72196,
  72197,
  72198,
  72199,
  72200,
  72201,
  72202,
  72243,
  72244,
  72245,
  72246,
  72247,
  72248,
  72251,
  72252,
  72253,
  72254,
  72263,
  72273,
  72274,
  72275,
  72276,
  72277,
  72278,
  72281,
  72282,
  72283,
  72330,
  72331,
  72332,
  72333,
  72334,
  72335,
  72336,
  72337,
  72338,
  72339,
  72340,
  72341,
  72342,
  72344,
  72345,
  72752,
  72753,
  72754,
  72755,
  72756,
  72757,
  72758,
  72760,
  72761,
  72762,
  72763,
  72764,
  72765,
  72767,
  72850,
  72851,
  72852,
  72853,
  72854,
  72855,
  72856,
  72857,
  72858,
  72859,
  72860,
  72861,
  72862,
  72863,
  72864,
  72865,
  72866,
  72867,
  72868,
  72869,
  72870,
  72871,
  72874,
  72875,
  72876,
  72877,
  72878,
  72879,
  72880,
  72882,
  72883,
  72885,
  72886,
  73009,
  73010,
  73011,
  73012,
  73013,
  73014,
  73018,
  73020,
  73021,
  73023,
  73024,
  73025,
  73026,
  73027,
  73028,
  73029,
  73031,
  73104,
  73105,
  73109,
  73111,
  73459,
  73460,
  92912,
  92913,
  92914,
  92915,
  92916,
  92976,
  92977,
  92978,
  92979,
  92980,
  92981,
  92982,
  94031,
  94095,
  94096,
  94097,
  94098,
  113821,
  113822,
  119143,
  119144,
  119145,
  119163,
  119164,
  119165,
  119166,
  119167,
  119168,
  119169,
  119170,
  119173,
  119174,
  119175,
  119176,
  119177,
  119178,
  119179,
  119210,
  119211,
  119212,
  119213,
  119362,
  119363,
  119364,
  121344,
  121345,
  121346,
  121347,
  121348,
  121349,
  121350,
  121351,
  121352,
  121353,
  121354,
  121355,
  121356,
  121357,
  121358,
  121359,
  121360,
  121361,
  121362,
  121363,
  121364,
  121365,
  121366,
  121367,
  121368,
  121369,
  121370,
  121371,
  121372,
  121373,
  121374,
  121375,
  121376,
  121377,
  121378,
  121379,
  121380,
  121381,
  121382,
  121383,
  121384,
  121385,
  121386,
  121387,
  121388,
  121389,
  121390,
  121391,
  121392,
  121393,
  121394,
  121395,
  121396,
  121397,
  121398,
  121403,
  121404,
  121405,
  121406,
  121407,
  121408,
  121409,
  121410,
  121411,
  121412,
  121413,
  121414,
  121415,
  121416,
  121417,
  121418,
  121419,
  121420,
  121421,
  121422,
  121423,
  121424,
  121425,
  121426,
  121427,
  121428,
  121429,
  121430,
  121431,
  121432,
  121433,
  121434,
  121435,
  121436,
  121437,
  121438,
  121439,
  121440,
  121441,
  121442,
  121443,
  121444,
  121445,
  121446,
  121447,
  121448,
  121449,
  121450,
  121451,
  121452,
  121461,
  121476,
  121499,
  121500,
  121501,
  121502,
  121503,
  121505,
  121506,
  121507,
  121508,
  121509,
  121510,
  121511,
  121512,
  121513,
  121514,
  121515,
  121516,
  121517,
  121518,
  121519,
  122880,
  122881,
  122882,
  122883,
  122884,
  122885,
  122886,
  122888,
  122889,
  122890,
  122891,
  122892,
  122893,
  122894,
  122895,
  122896,
  122897,
  122898,
  122899,
  122900,
  122901,
  122902,
  122903,
  122904,
  122907,
  122908,
  122909,
  122910,
  122911,
  122912,
  122913,
  122915,
  122916,
  122918,
  122919,
  122920,
  122921,
  122922,
  123184,
  123185,
  123186,
  123187,
  123188,
  123189,
  123190,
  123628,
  123629,
  123630,
  123631,
  125136,
  125137,
  125138,
  125139,
  125140,
  125141,
  125142,
  125252,
  125253,
  125254,
  125255,
  125256,
  125257,
  125258,
  917760,
  917761,
  917762,
  917763,
  917764,
  917765,
  917766,
  917767,
  917768,
  917769,
  917770,
  917771,
  917772,
  917773,
  917774,
  917775,
  917776,
  917777,
  917778,
  917779,
  917780,
  917781,
  917782,
  917783,
  917784,
  917785,
  917786,
  917787,
  917788,
  917789,
  917790,
  917791,
  917792,
  917793,
  917794,
  917795,
  917796,
  917797,
  917798,
  917799,
  917800,
  917801,
  917802,
  917803,
  917804,
  917805,
  917806,
  917807,
  917808,
  917809,
  917810,
  917811,
  917812,
  917813,
  917814,
  917815,
  917816,
  917817,
  917818,
  917819,
  917820,
  917821,
  917822,
  917823,
  917824,
  917825,
  917826,
  917827,
  917828,
  917829,
  917830,
  917831,
  917832,
  917833,
  917834,
  917835,
  917836,
  917837,
  917838,
  917839,
  917840,
  917841,
  917842,
  917843,
  917844,
  917845,
  917846,
  917847,
  917848,
  917849,
  917850,
  917851,
  917852,
  917853,
  917854,
  917855,
  917856,
  917857,
  917858,
  917859,
  917860,
  917861,
  917862,
  917863,
  917864,
  917865,
  917866,
  917867,
  917868,
  917869,
  917870,
  917871,
  917872,
  917873,
  917874,
  917875,
  917876,
  917877,
  917878,
  917879,
  917880,
  917881,
  917882,
  917883,
  917884,
  917885,
  917886,
  917887,
  917888,
  917889,
  917890,
  917891,
  917892,
  917893,
  917894,
  917895,
  917896,
  917897,
  917898,
  917899,
  917900,
  917901,
  917902,
  917903,
  917904,
  917905,
  917906,
  917907,
  917908,
  917909,
  917910,
  917911,
  917912,
  917913,
  917914,
  917915,
  917916,
  917917,
  917918,
  917919,
  917920,
  917921,
  917922,
  917923,
  917924,
  917925,
  917926,
  917927,
  917928,
  917929,
  917930,
  917931,
  917932,
  917933,
  917934,
  917935,
  917936,
  917937,
  917938,
  917939,
  917940,
  917941,
  917942,
  917943,
  917944,
  917945,
  917946,
  917947,
  917948,
  917949,
  917950,
  917951,
  917952,
  917953,
  917954,
  917955,
  917956,
  917957,
  917958,
  917959,
  917960,
  917961,
  917962,
  917963,
  917964,
  917965,
  917966,
  917967,
  917968,
  917969,
  917970,
  917971,
  917972,
  917973,
  917974,
  917975,
  917976,
  917977,
  917978,
  917979,
  917980,
  917981,
  917982,
  917983,
  917984,
  917985,
  917986,
  917987,
  917988,
  917989,
  917990,
  917991,
  917992,
  917993,
  917994,
  917995,
  917996,
  917997,
  917998,
  917999,
];

// https://github.com/mathiasbynens/unicode-12.1.0/blob/master/General_Category/Punctuation/code-points.js
var punctuations = [
  33,
  34,
  35,
  37,
  38,
  39,
  40,
  41,
  42,
  44,
  45,
  46,
  47,
  58,
  59,
  63,
  64,
  91,
  92,
  93,
  95,
  123,
  125,
  161,
  167,
  171,
  182,
  183,
  187,
  191,
  894,
  903,
  1370,
  1371,
  1372,
  1373,
  1374,
  1375,
  1417,
  1418,
  1470,
  1472,
  1475,
  1478,
  1523,
  1524,
  1545,
  1546,
  1548,
  1549,
  1563,
  1566,
  1567,
  1642,
  1643,
  1644,
  1645,
  1748,
  1792,
  1793,
  1794,
  1795,
  1796,
  1797,
  1798,
  1799,
  1800,
  1801,
  1802,
  1803,
  1804,
  1805,
  2039,
  2040,
  2041,
  2096,
  2097,
  2098,
  2099,
  2100,
  2101,
  2102,
  2103,
  2104,
  2105,
  2106,
  2107,
  2108,
  2109,
  2110,
  2142,
  2404,
  2405,
  2416,
  2557,
  2678,
  2800,
  3191,
  3204,
  3572,
  3663,
  3674,
  3675,
  3844,
  3845,
  3846,
  3847,
  3848,
  3849,
  3850,
  3851,
  3852,
  3853,
  3854,
  3855,
  3856,
  3857,
  3858,
  3860,
  3898,
  3899,
  3900,
  3901,
  3973,
  4048,
  4049,
  4050,
  4051,
  4052,
  4057,
  4058,
  4170,
  4171,
  4172,
  4173,
  4174,
  4175,
  4347,
  4960,
  4961,
  4962,
  4963,
  4964,
  4965,
  4966,
  4967,
  4968,
  5120,
  5742,
  5787,
  5788,
  5867,
  5868,
  5869,
  5941,
  5942,
  6100,
  6101,
  6102,
  6104,
  6105,
  6106,
  6144,
  6145,
  6146,
  6147,
  6148,
  6149,
  6150,
  6151,
  6152,
  6153,
  6154,
  6468,
  6469,
  6686,
  6687,
  6816,
  6817,
  6818,
  6819,
  6820,
  6821,
  6822,
  6824,
  6825,
  6826,
  6827,
  6828,
  6829,
  7002,
  7003,
  7004,
  7005,
  7006,
  7007,
  7008,
  7164,
  7165,
  7166,
  7167,
  7227,
  7228,
  7229,
  7230,
  7231,
  7294,
  7295,
  7360,
  7361,
  7362,
  7363,
  7364,
  7365,
  7366,
  7367,
  7379,
  8208,
  8209,
  8210,
  8211,
  8212,
  8213,
  8214,
  8215,
  8216,
  8217,
  8218,
  8219,
  8220,
  8221,
  8222,
  8223,
  8224,
  8225,
  8226,
  8227,
  8228,
  8229,
  8230,
  8231,
  8240,
  8241,
  8242,
  8243,
  8244,
  8245,
  8246,
  8247,
  8248,
  8249,
  8250,
  8251,
  8252,
  8253,
  8254,
  8255,
  8256,
  8257,
  8258,
  8259,
  8261,
  8262,
  8263,
  8264,
  8265,
  8266,
  8267,
  8268,
  8269,
  8270,
  8271,
  8272,
  8273,
  8275,
  8276,
  8277,
  8278,
  8279,
  8280,
  8281,
  8282,
  8283,
  8284,
  8285,
  8286,
  8317,
  8318,
  8333,
  8334,
  8968,
  8969,
  8970,
  8971,
  9001,
  9002,
  10088,
  10089,
  10090,
  10091,
  10092,
  10093,
  10094,
  10095,
  10096,
  10097,
  10098,
  10099,
  10100,
  10101,
  10181,
  10182,
  10214,
  10215,
  10216,
  10217,
  10218,
  10219,
  10220,
  10221,
  10222,
  10223,
  10627,
  10628,
  10629,
  10630,
  10631,
  10632,
  10633,
  10634,
  10635,
  10636,
  10637,
  10638,
  10639,
  10640,
  10641,
  10642,
  10643,
  10644,
  10645,
  10646,
  10647,
  10648,
  10712,
  10713,
  10714,
  10715,
  10748,
  10749,
  11513,
  11514,
  11515,
  11516,
  11518,
  11519,
  11632,
  11776,
  11777,
  11778,
  11779,
  11780,
  11781,
  11782,
  11783,
  11784,
  11785,
  11786,
  11787,
  11788,
  11789,
  11790,
  11791,
  11792,
  11793,
  11794,
  11795,
  11796,
  11797,
  11798,
  11799,
  11800,
  11801,
  11802,
  11803,
  11804,
  11805,
  11806,
  11807,
  11808,
  11809,
  11810,
  11811,
  11812,
  11813,
  11814,
  11815,
  11816,
  11817,
  11818,
  11819,
  11820,
  11821,
  11822,
  11824,
  11825,
  11826,
  11827,
  11828,
  11829,
  11830,
  11831,
  11832,
  11833,
  11834,
  11835,
  11836,
  11837,
  11838,
  11839,
  11840,
  11841,
  11842,
  11843,
  11844,
  11845,
  11846,
  11847,
  11848,
  11849,
  11850,
  11851,
  11852,
  11853,
  11854,
  11855,
  12289,
  12290,
  12291,
  12296,
  12297,
  12298,
  12299,
  12300,
  12301,
  12302,
  12303,
  12304,
  12305,
  12308,
  12309,
  12310,
  12311,
  12312,
  12313,
  12314,
  12315,
  12316,
  12317,
  12318,
  12319,
  12336,
  12349,
  12448,
  12539,
  42238,
  42239,
  42509,
  42510,
  42511,
  42611,
  42622,
  42738,
  42739,
  42740,
  42741,
  42742,
  42743,
  43124,
  43125,
  43126,
  43127,
  43214,
  43215,
  43256,
  43257,
  43258,
  43260,
  43310,
  43311,
  43359,
  43457,
  43458,
  43459,
  43460,
  43461,
  43462,
  43463,
  43464,
  43465,
  43466,
  43467,
  43468,
  43469,
  43486,
  43487,
  43612,
  43613,
  43614,
  43615,
  43742,
  43743,
  43760,
  43761,
  44011,
  64830,
  64831,
  65040,
  65041,
  65042,
  65043,
  65044,
  65045,
  65046,
  65047,
  65048,
  65049,
  65072,
  65073,
  65074,
  65075,
  65076,
  65077,
  65078,
  65079,
  65080,
  65081,
  65082,
  65083,
  65084,
  65085,
  65086,
  65087,
  65088,
  65089,
  65090,
  65091,
  65092,
  65093,
  65094,
  65095,
  65096,
  65097,
  65098,
  65099,
  65100,
  65101,
  65102,
  65103,
  65104,
  65105,
  65106,
  65108,
  65109,
  65110,
  65111,
  65112,
  65113,
  65114,
  65115,
  65116,
  65117,
  65118,
  65119,
  65120,
  65121,
  65123,
  65128,
  65130,
  65131,
  65281,
  65282,
  65283,
  65285,
  65286,
  65287,
  65288,
  65289,
  65290,
  65292,
  65293,
  65294,
  65295,
  65306,
  65307,
  65311,
  65312,
  65339,
  65340,
  65341,
  65343,
  65371,
  65373,
  65375,
  65376,
  65377,
  65378,
  65379,
  65380,
  65381,
  65792,
  65793,
  65794,
  66463,
  66512,
  66927,
  67671,
  67871,
  67903,
  68176,
  68177,
  68178,
  68179,
  68180,
  68181,
  68182,
  68183,
  68184,
  68223,
  68336,
  68337,
  68338,
  68339,
  68340,
  68341,
  68342,
  68409,
  68410,
  68411,
  68412,
  68413,
  68414,
  68415,
  68505,
  68506,
  68507,
  68508,
  69461,
  69462,
  69463,
  69464,
  69465,
  69703,
  69704,
  69705,
  69706,
  69707,
  69708,
  69709,
  69819,
  69820,
  69822,
  69823,
  69824,
  69825,
  69952,
  69953,
  69954,
  69955,
  70004,
  70005,
  70085,
  70086,
  70087,
  70088,
  70093,
  70107,
  70109,
  70110,
  70111,
  70200,
  70201,
  70202,
  70203,
  70204,
  70205,
  70313,
  70731,
  70732,
  70733,
  70734,
  70735,
  70747,
  70749,
  70854,
  71105,
  71106,
  71107,
  71108,
  71109,
  71110,
  71111,
  71112,
  71113,
  71114,
  71115,
  71116,
  71117,
  71118,
  71119,
  71120,
  71121,
  71122,
  71123,
  71124,
  71125,
  71126,
  71127,
  71233,
  71234,
  71235,
  71264,
  71265,
  71266,
  71267,
  71268,
  71269,
  71270,
  71271,
  71272,
  71273,
  71274,
  71275,
  71276,
  71484,
  71485,
  71486,
  71739,
  72162,
  72255,
  72256,
  72257,
  72258,
  72259,
  72260,
  72261,
  72262,
  72346,
  72347,
  72348,
  72350,
  72351,
  72352,
  72353,
  72354,
  72769,
  72770,
  72771,
  72772,
  72773,
  72816,
  72817,
  73463,
  73464,
  73727,
  74864,
  74865,
  74866,
  74867,
  74868,
  92782,
  92783,
  92917,
  92983,
  92984,
  92985,
  92986,
  92987,
  92996,
  93847,
  93848,
  93849,
  93850,
  94178,
  113823,
  121479,
  121480,
  121481,
  121482,
  121483,
  125278,
  125279,
];

// https://github.com/mathiasbynens/unicode-12.1.0/blob/master/General_Category/Control/code-points.js
var ctlchar = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  127,
  128,
  129,
  130,
  131,
  132,
  133,
  134,
  135,
  136,
  137,
  138,
  139,
  140,
  141,
  142,
  143,
  144,
  145,
  146,
  147,
  148,
  149,
  150,
  151,
  152,
  153,
  154,
  155,
  156,
  157,
  158,
  159,
];

// https://github.com/mathiasbynens/unicode-12.1.0/blob/master/General_Category/Space_Separator/code-points.js
var spcsep = [
  32,
  160,
  5760,
  8192,
  8193,
  8194,
  8195,
  8196,
  8197,
  8198,
  8199,
  8200,
  8201,
  8202,
  8239,
  8287,
  12288,
];

export default BertTokenizer;
