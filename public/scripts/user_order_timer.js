//order acepted at 8pm
//order expected to be completed at 8:45pm
//current time - 8:45pm

//let t = "08:30"; // hh:mm
//let ms = Number(t.split(':')[0]) * 60 * 60 * 1000 + Number(t.split(':')[1]) * 60 * 1000;
//console.log(ms);



//((8pm)accepted_at + 45(8:45pm)) - currentTime(8:15) = timeLeft (30mins)
let acceptedTime = $('#accepted_at').val()//.slice(15, 24).replace('T', ' ');
// convert acceptedTime to MS
let acceptedTimeMs = new Date(acceptedTime).getTime();
let currentTimeMs = new Date().getTime()
//console.log(new Date(acceptedTime).toLocaleString("en-US", {timeZone: "America/New_York"}))
// add 45 mins via milliseconds(
let cookingTimeMs = (1000 * 60 * 45); //ms to seconds to minutes
let expectedCompletionTime = acceptedTimeMs + cookingTimeMs;
let timeSecond = (expectedCompletionTime - currentTimeMs) / 1000;

console.log("expect", expectedCompletionTime)
//let timeSecond = 1200;
let timeH = document.getElementById('user_timer');
displayTime(timeSecond);
const countDown = setInterval(() => {
  timeSecond--;
  displayTime(timeSecond);
  if (timeSecond == 0 || timeSecond < 1) {
    endCount();
    clearInterval(countDown);
  }
}, 1000);
function displayTime(second) {
  const min = Math.floor(second / 60);
  const sec = Math.floor(second % 60);
  timeH.innerHTML = `
  ${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}
  `;
}
function endCount() {
  timeH.innerHTML = 'Order completed! you should be notified soon';
}
// acceptedTime //// 23:29:14
// currentTime //// 00:29:05
