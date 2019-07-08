// var e="AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N/E:P/RL:O/RC:C/CR:L/IR:X/AR:X/MAV:X/MAC:X/MPR:X/MUI:X/MS:X/MC:L/MI:N/MA:N"
// function cvss(e) {
//   var test="test";
//   return test
//     if (!CVSS.vectorStringRegex_30.test("CVSS:3.0/"+e)){
//       if (e.length == 0)
//         return "";
//       else
//         return 0;
//     }
//     var cvss = CVSS.calculateCVSSFromVector("CVSS:3.0/"+e);
//     var base = cvss.baseMetricScore;
//     var temp = cvss.temporalMetricScore;
//     var env = cvss.environmentalMetricScore;
//
//     var over = base;
//     if (temp > 1) over = temp;
//     if (env > 1) over = env;
//     return over;
// }
// document.getElementById("demo").innerHTML = "CVSS"+cvss();
